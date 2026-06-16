import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Timer, CheckCircle2, XCircle, RotateCcw, Flag, ArrowLeft } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import BmlaSubnav from "../../components/bmla/BmlaSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import Seo from "../../components/Seo.jsx";
import { cn } from "../../lib/cn.js";
import { questMcqs } from "../../data/bmla/quest-import.js";
import { recordQuiz, TOPIC_AREAS } from "../../lib/bmla/stats.js";
import { get, set } from "../../lib/bmla/storage.js";

const SCOPES = [
  { id: "mixed", label: "Mixed paper", sub: "§1.1–§1.3", topics: ["lec1", "lec2", "lec3"], per: 4 },
  { id: "lec1", label: "§1.1 only", sub: "Systems", topics: ["lec1"], per: 8 },
  { id: "lec2", label: "§1.2 only", sub: "Row reduction", topics: ["lec2"], per: 8 },
  { id: "lec3", label: "§1.3 only", sub: "Vectors", topics: ["lec3"], per: 8 },
];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPaper(scope) {
  const out = [];
  for (const topic of scope.topics) {
    const bank = questMcqs.filter((q) => q.topic === topic);
    out.push(...shuffled(bank).slice(0, scope.per));
  }
  return shuffled(out);
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function BmlaExam() {
  const [phase, setPhase] = useState("intro"); // intro | running | done
  const [scope, setScope] = useState(SCOPES[0]);
  const [paper, setPaper] = useState([]);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const tick = useRef(null);

  const minutes = useMemo(() => {
    const n = scope.topics.reduce((acc, t) => acc + Math.min(scope.per, questMcqs.filter((q) => q.topic === t).length), 0);
    return Math.max(6, Math.round(n * 1.5));
  }, [scope]);

  function start() {
    const p = buildPaper(scope);
    setPaper(p);
    setAnswers({});
    setResult(null);
    setSecondsLeft(minutes * 60);
    setPhase("running");
  }

  // grade is defined before the timer effect so the auto-submit can call it
  function grade() {
    const byTopic = {};
    let correct = 0;
    for (const q of paper) {
      const picked = answers[q.id];
      const ok = picked === q.correctIndex;
      if (ok) correct += 1;
      const t = q.topic || q.moduleSlug;
      byTopic[t] = byTopic[t] || { moduleSlug: q.moduleSlug, topic: q.topic, correct: 0, total: 0 };
      byTopic[t].total += 1;
      if (ok) byTopic[t].correct += 1;
    }
    Object.values(byTopic).forEach((g) => recordQuiz(g.moduleSlug, g.topic, g.correct, g.total));
    const pct = paper.length ? Math.round((correct / paper.length) * 100) : 0;
    const prevBest = get("exam:best", 0);
    if (pct > prevBest) set("exam:best", pct);
    setResult({ correct, total: paper.length, pct, byTopic, best: Math.max(prevBest, pct) });
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

  const answeredCount = Object.keys(answers).length;

  return (
    <>
      <Seo title="Mock exam — BMLA Mastery | KILLEYYY" description="Timed, exam-format practice with a topic-by-topic score breakdown." canonical="/bmla/exam" />
      <Nav />
      <BmlaSubnav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        {/* ── intro ── */}
        {phase === "intro" && (
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">BMLA · Mock exam</p>
            <h1 className="mt-1 font-serif text-fluid-xl font-semibold text-silver">Sit a timed paper.</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Exam-format MCQs under a countdown, then a topic-by-topic breakdown that feeds your dashboard weak-spots.
              Questions reshuffle every attempt.
            </p>
            <p className="mb-2 mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Choose a paper</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {SCOPES.map((s) => {
                const active = s.id === scope.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScope(s)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-[14px] border p-4 text-left transition-colors",
                      active ? "border-crimson/60 bg-crimson/10" : "border-line/70 bg-surface/50 hover:border-gold/50",
                    )}
                  >
                    <p className={cn("text-sm font-semibold", active ? "text-crimson-bright" : "text-silver")}>{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{s.sub}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted">
              <span className="text-silver">{minutes} minutes</span> · auto-submits when the timer runs out.
            </p>
            <button type="button" onClick={start} className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-medium text-silver transition-transform hover:scale-[1.03]">
              <Flag size={16} aria-hidden="true" /> Start exam
            </button>
          </div>
        )}

        {/* ── running ── */}
        {phase === "running" && (
          <div>
            <div className="sticky top-0 z-20 -mx-6 mb-6 flex items-center justify-between gap-4 border-b border-line/60 bg-ink/85 px-6 py-3 backdrop-blur">
              <span className={cn("inline-flex items-center gap-2 font-mono text-lg font-semibold", secondsLeft <= 60 ? "text-crimson-bright" : "text-silver")} role="timer" aria-label={`Time remaining ${mmss(secondsLeft)}`}>
                <Timer size={18} aria-hidden="true" /> {mmss(secondsLeft)}
              </span>
              <span className="font-mono text-xs text-muted">{answeredCount}/{paper.length} answered</span>
              <button type="button" onClick={grade} className="rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver hover:bg-crimson/90">
                Submit
              </button>
            </div>

            <ol className="space-y-6">
              {paper.map((q, i) => (
                <li key={q.id}>
                  <fieldset className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
                    <legend className="float-left mr-2 font-mono text-xs text-gold">Q{i + 1}</legend>
                    <p className="text-sm leading-relaxed text-silver">{q.q}</p>
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
                  </fieldset>
                </li>
              ))}
            </ol>

            <button type="button" onClick={grade} className="mt-6 rounded-full bg-crimson px-7 py-3 text-sm font-medium text-silver hover:bg-crimson/90">
              Submit exam
            </button>
          </div>
        )}

        {/* ── results ── */}
        {phase === "done" && result && (
          <div>
            <Link to="/bmla/learn" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver">
              <ArrowLeft size={15} aria-hidden="true" /> Dashboard
            </Link>
            <div className="mt-6 rounded-xl2 border border-line/70 bg-surface/50 p-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Exam complete</p>
              <p className={cn("mt-2 font-serif text-fluid-2xl font-semibold", result.pct >= 70 ? "text-jade-bright" : result.pct >= 50 ? "text-gold" : "text-crimson-bright")}>
                {result.pct}%
              </p>
              <p className="mt-1 text-sm text-muted">{result.correct}/{result.total} correct · best {result.best}%</p>
              <button type="button" onClick={() => setPhase("intro")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver hover:bg-crimson/90">
                <RotateCcw size={14} aria-hidden="true" /> New paper
              </button>
            </div>

            <h2 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">By topic</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(result.byTopic).map(([t, g]) => {
                const pct = Math.round((g.correct / g.total) * 100);
                return (
                  <div key={t} className="rounded-[14px] border border-line/70 bg-surface/50 p-4">
                    <p className="text-sm font-medium text-silver">{TOPIC_AREAS[t]?.label || t}</p>
                    <p className={cn("mt-1 font-mono text-lg font-semibold", pct >= 70 ? "text-jade-bright" : pct >= 50 ? "text-gold" : "text-crimson-bright")}>
                      {g.correct}/{g.total}
                    </p>
                  </div>
                );
              })}
            </div>

            <h2 className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Review</h2>
            <ol className="space-y-4">
              {paper.map((q, i) => {
                const picked = answers[q.id];
                const ok = picked === q.correctIndex;
                return (
                  <li key={q.id} className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
                    <div className="flex items-start gap-2">
                      {ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-jade-bright" aria-hidden="true" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-crimson-bright" aria-hidden="true" />}
                      <p className="text-sm font-medium text-silver">Q{i + 1}. {q.q}</p>
                    </div>
                    <p className="mt-2 pl-6 text-sm text-jade-bright">Correct: {q.options[q.correctIndex]}</p>
                    {!ok && (
                      <p className="pl-6 text-sm text-crimson-bright">
                        Your answer: {picked === undefined ? "— (blank)" : q.options[picked]}
                      </p>
                    )}
                    {q.explanation && <p className="mt-1 pl-6 text-sm text-muted">{q.explanation}</p>}
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
