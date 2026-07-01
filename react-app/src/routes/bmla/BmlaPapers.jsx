import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Timer, CheckCircle2, XCircle, RotateCcw, Flag, ArrowLeft, Crosshair, ChevronDown, FileText } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import BmlaSubnav from "../../components/bmla/BmlaSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import Seo from "../../components/Seo.jsx";
import MathTex from "../../components/bmla/Math.jsx";
import { cn } from "../../lib/cn.js";
import { PAPER_BANK } from "../../data/bmla/paper-bank.js";
import { PAPER_META, ARCHETYPES, DRILL_ORDER, HOUR_PLAN, TRAIN_FORMAT } from "../../data/bmla/papers.js";
import { recordQuiz } from "../../lib/bmla/stats.js";
import { get, set } from "../../lib/bmla/storage.js";

const ARCH = Object.fromEntries(ARCHETYPES.map((a) => [a.id, a]));

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sample `per` items from each archetype in `ids`. */
function buildTest(ids, per) {
  const out = [];
  for (const id of ids) {
    out.push(...shuffled(PAPER_BANK.filter((q) => q.archetype === id)).slice(0, per));
  }
  return shuffled(out);
}

/** Accept "3", "-3.5", "-7/2" style answers. */
function parseNumeric(s) {
  if (typeof s !== "string") return NaN;
  const t = s.trim().replace(/\s+/g, "").replace("−", "-");
  if (!t) return NaN;
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = parseFloat(frac[2]);
    return d === 0 ? NaN : parseFloat(frac[1]) / d;
  }
  const v = parseFloat(t);
  return Number.isFinite(v) && /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? v : NaN;
}

function isCorrect(q, val) {
  if (q.qtype === "mcq") return val === q.correctIndex;
  const v = parseNumeric(val ?? "");
  return Number.isFinite(v) && Math.abs(v - q.answer) <= (q.tol ?? 1e-6);
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const pctTone = (p) => (p >= 70 ? "text-jade-bright" : p >= 50 ? "text-gold" : "text-crimson-bright");

const SCOPES = [
  { id: "diagnostic", label: "Full diagnostic", sub: "current standing — every archetype, weighted like the exam", ids: DRILL_ORDER, per: 2 },
  { id: "red", label: "Must-know only", sub: "the 5 archetypes that appear in every sitting", ids: DRILL_ORDER.slice(0, 5), per: 2 },
];

export default function BmlaPapers() {
  const [phase, setPhase] = useState("board"); // board | running | done
  const [scope, setScope] = useState(SCOPES[0]);
  const [test, setTest] = useState([]);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [planOpen, setPlanOpen] = useState(false);
  const tick = useRef(null);
  const best = get("papers:best", 0);

  const minutes = (n) => Math.max(3, Math.round(n * 1.25));

  function start(sc) {
    const t = buildTest(sc.ids, sc.per);
    setScope(sc);
    setTest(t);
    setAnswers({});
    setResult(null);
    setSecondsLeft(minutes(t.length) * 60);
    setPhase("running");
    window.scrollTo(0, 0);
  }

  function drill(archId) {
    const a = ARCH[archId];
    start({ id: `drill-${archId}`, label: `Drill · ${a.short}`, ids: [archId], per: 99 });
  }

  function grade() {
    const byArch = {};
    let correct = 0;
    for (const q of test) {
      const ok = isCorrect(q, answers[q.id]);
      if (ok) correct += 1;
      byArch[q.archetype] = byArch[q.archetype] || { correct: 0, total: 0 };
      byArch[q.archetype].total += 1;
      if (ok) byArch[q.archetype].correct += 1;
    }
    Object.entries(byArch).forEach(([a, g]) => recordQuiz("papers", `paper-${a}`, g.correct, g.total));
    const pct = test.length ? Math.round((correct / test.length) * 100) : 0;
    const prevBest = get("papers:best", 0);
    if (scope.id === "diagnostic" && pct > prevBest) set("papers:best", pct);
    const weakest = Object.entries(byArch)
      .map(([a, g]) => ({ id: a, pct: Math.round((g.correct / g.total) * 100) }))
      .sort((x, y) => x.pct - y.pct)[0];
    if (scope.id === "diagnostic") {
      set("papers:last", { pct, at: Date.now(), weakest: weakest?.id || null });
    }
    setResult({ correct, total: test.length, pct, byArch, best: Math.max(prevBest, pct), weakest });
    setPhase("done");
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    if (phase !== "running") return undefined;
    tick.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tick.current);
          grade();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const answeredCount = useMemo(
    () => test.filter((q) => (q.qtype === "mcq" ? answers[q.id] !== undefined : (answers[q.id] ?? "").trim?.() !== "" && answers[q.id] !== undefined)).length,
    [answers, test],
  );

  return (
    <>
      <Seo title="Past papers — BMLA Mastery | KILLEYYY" description="Timed test-me mode grounded in real past papers, with a repeated-question weightage board." canonical="/bmla/papers" />
      <Nav />
      <BmlaSubnav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        {/* ── board ── */}
        {phase === "board" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">BMLA · Past papers</p>
            <h1 className="mt-1 font-serif text-fluid-xl font-semibold text-silver">What actually repeats — and test yourself on it.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Weightage analysis across {PAPER_META.length} real sittings ({PAPER_META.map((p) => p.label.split("·")[1]?.trim() || p.id).join(" · ")}).
              Every question below is taken from those papers and verified against the answer keys. {TRAIN_FORMAT}
            </p>
            {best > 0 && (
              <p className="mt-2 text-sm text-muted">Diagnostic best: <span className={cn("font-mono font-semibold", pctTone(best))}>{best}%</span></p>
            )}

            {/* timed tests */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SCOPES.map((s) => {
                const n = s.ids.reduce((acc, id) => acc + Math.min(s.per, PAPER_BANK.filter((q) => q.archetype === id).length), 0);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => start(s)}
                    className="rounded-[14px] border border-line/70 bg-surface/50 p-5 text-left transition-colors hover:border-crimson/60"
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-silver">
                      <Flag size={14} className="text-crimson-bright" aria-hidden="true" /> {s.label}
                    </p>
                    <p className="mt-1 text-xs text-muted">{s.sub}</p>
                    <p className="mt-2 font-mono text-[11px] text-gold">{n} questions · {minutes(n)} min · auto-submits</p>
                  </button>
                );
              })}
            </div>

            {/* 1-hour plan */}
            <div className="mt-6 rounded-[14px] border border-line/70 bg-surface/40">
              <button type="button" onClick={() => setPlanOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-3.5 text-left">
                <span className="text-sm font-semibold text-silver">The 1-hour quick-revision plan</span>
                <ChevronDown size={16} className={cn("text-muted transition-transform", planOpen && "rotate-180")} aria-hidden="true" />
              </button>
              {planOpen && (
                <ol className="space-y-2 border-t border-line/60 px-5 py-4">
                  {HOUR_PLAN.map((p) => (
                    <li key={p.window} className="text-sm text-muted">
                      <span className="font-mono text-xs text-gold">{p.window}</span>{" "}
                      <span className="text-silver">{p.focus}</span>
                      {p.archetypes.length > 0 && <> — {p.archetypes.map((a) => ARCH[a].short).join(" · ")}</>}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* weightage board */}
            <h2 className="mb-3 mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Most-repeated question types · weightage</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {DRILL_ORDER.map((id) => {
                const a = ARCH[id];
                const red = a.priority === "red";
                const stat = get(`quizStats`, {})[`topic:paper-${id}`];
                const acc = stat?.total ? Math.round((stat.correct / stat.total) * 100) : null;
                return (
                  <div key={id} className={cn("rounded-[14px] border bg-surface/50 p-5", red ? "border-crimson/40" : "border-gold/30")}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", red ? "text-crimson-bright" : "text-gold")}>
                          {red ? "must-know" : "likely"} · {a.weight}% of parts
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-snug text-silver">{a.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => drill(id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line/70 px-3 py-1.5 text-xs font-medium text-silver transition-colors hover:border-crimson/60 hover:text-crimson-bright"
                      >
                        <Crosshair size={12} aria-hidden="true" /> Drill
                      </button>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/60">
                      <div className={cn("h-full rounded-full", red ? "bg-crimson" : "bg-gold/70")} style={{ width: `${Math.min(100, a.weight * 4)}%` }} />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{a.tip}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {Object.entries(a.seenIn).map(([paper, qs]) => (
                        <span key={paper} className="rounded-full border border-line/60 px-2 py-0.5 font-mono text-[10px] text-muted">
                          {paper === "quiz26" ? "Quiz" : paper}: {qs}
                        </span>
                      ))}
                      {acc !== null && (
                        <span className={cn("ml-auto font-mono text-[11px] font-semibold", pctTone(acc))}>you: {acc}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* sources */}
            <h2 className="mb-2 mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Grounded in</h2>
            <ul className="space-y-1">
              {PAPER_META.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm text-muted">
                  <FileText size={13} className="shrink-0 text-gold" aria-hidden="true" />
                  <span className="text-silver">{p.label}</span> — {p.format}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── running ── */}
        {phase === "running" && (
          <div>
            <div className="sticky top-0 z-20 -mx-6 mb-6 flex items-center justify-between gap-4 border-b border-line/60 bg-ink/85 px-6 py-3 backdrop-blur">
              <span className={cn("inline-flex items-center gap-2 font-mono text-lg font-semibold", secondsLeft <= 60 ? "text-crimson-bright" : "text-silver")} role="timer" aria-label={`Time remaining ${mmss(secondsLeft)}`}>
                <Timer size={18} aria-hidden="true" /> {mmss(secondsLeft)}
              </span>
              <span className="font-mono text-xs text-muted">{scope.label} · {answeredCount}/{test.length}</span>
              <button type="button" onClick={grade} className="rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver hover:bg-crimson/90">
                Submit
              </button>
            </div>

            <ol className="space-y-6">
              {test.map((q, i) => (
                <li key={q.id}>
                  <fieldset className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
                    <legend className="float-left mr-2 font-mono text-xs text-gold">Q{i + 1}</legend>
                    <p className="text-sm leading-relaxed text-silver">{q.stem}</p>
                    {q.stemTex && <MathTex tex={q.stemTex} className="mt-2 text-silver" />}
                    {q.qtype === "mcq" ? (
                      <div className="mt-3 grid gap-2">
                        {q.options.map((opt, idx) => (
                          <label
                            key={idx}
                            className={cn(
                              "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors",
                              answers[q.id] === idx ? "border-crimson/60 bg-crimson/10 text-silver" : "border-line/70 text-silver hover:border-gold/50",
                            )}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === idx}
                              onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                              className="accent-crimson"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="numeric answer — fractions like -7/2 OK"
                          value={answers[q.id] ?? ""}
                          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                          className="w-full max-w-xs rounded-lg border border-line/70 bg-ink/60 px-4 py-2.5 font-mono text-sm text-silver placeholder:text-muted/60 focus:border-crimson/60 focus:outline-none"
                        />
                      </div>
                    )}
                    <p className="mt-3 font-mono text-[10px] text-muted/70">{ARCH[q.archetype].short}</p>
                  </fieldset>
                </li>
              ))}
            </ol>

            <button type="button" onClick={grade} className="mt-6 rounded-full bg-crimson px-7 py-3 text-sm font-medium text-silver hover:bg-crimson/90">
              Submit test
            </button>
          </div>
        )}

        {/* ── results ── */}
        {phase === "done" && result && (
          <div>
            <button type="button" onClick={() => setPhase("board")} className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver">
              <ArrowLeft size={15} aria-hidden="true" /> Back to the board
            </button>
            <div className="mt-6 rounded-xl2 border border-line/70 bg-surface/50 p-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{scope.label} · complete</p>
              <p className={cn("mt-2 font-serif text-fluid-2xl font-semibold", pctTone(result.pct))}>{result.pct}%</p>
              <p className="mt-1 text-sm text-muted">
                {result.correct}/{result.total} correct{scope.id === "diagnostic" && <> · best {result.best}%</>}
                {result.weakest && result.pct < 100 && (
                  <> · weakest: <span className="text-silver">{ARCH[result.weakest.id]?.short}</span></>
                )}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => start(scope.id.startsWith("drill-") ? scope : SCOPES.find((s) => s.id === scope.id) || scope)} className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver hover:bg-crimson/90">
                  <RotateCcw size={14} aria-hidden="true" /> Retake
                </button>
                {result.weakest && result.pct < 100 && (
                  <button type="button" onClick={() => drill(result.weakest.id)} className="inline-flex items-center gap-2 rounded-full border border-line/70 px-5 py-2.5 text-sm font-medium text-silver hover:border-crimson/60 hover:text-crimson-bright">
                    <Crosshair size={14} aria-hidden="true" /> Drill the weakest
                  </button>
                )}
              </div>
            </div>

            <h2 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">By question type</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(result.byArch).map(([a, g]) => {
                const p = Math.round((g.correct / g.total) * 100);
                return (
                  <div key={a} className="rounded-[14px] border border-line/70 bg-surface/50 p-4">
                    <p className="text-sm font-medium text-silver">{ARCH[a].short}</p>
                    <p className={cn("mt-1 font-mono text-lg font-semibold", pctTone(p))}>{g.correct}/{g.total}</p>
                  </div>
                );
              })}
            </div>

            <h2 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Review</h2>
            <ol className="space-y-4">
              {test.map((q, i) => {
                const given = answers[q.id];
                const okAns = isCorrect(q, given);
                const correctText = q.qtype === "mcq" ? q.options[q.correctIndex] : String(q.answer);
                const givenText = q.qtype === "mcq" ? (given === undefined ? "— (blank)" : q.options[given]) : (given?.trim?.() ? given : "— (blank)");
                return (
                  <li key={q.id} className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
                    <div className="flex items-start gap-2">
                      {okAns ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-jade-bright" aria-hidden="true" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-crimson-bright" aria-hidden="true" />}
                      <p className="text-sm font-medium text-silver">Q{i + 1}. {q.stem}</p>
                    </div>
                    {q.stemTex && <MathTex tex={q.stemTex} className="mt-1 pl-6 text-silver" />}
                    <p className="mt-2 pl-6 text-sm text-jade-bright">Correct: {correctText}</p>
                    {!okAns && <p className="pl-6 text-sm text-crimson-bright">Your answer: {givenText}</p>}
                    {q.explanation && <p className="mt-1 pl-6 text-sm text-muted">{q.explanation}</p>}
                    <p className="mt-1 pl-6 font-mono text-[10px] text-gold/80">source: {q.source}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
