import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { StoreProvider, useStore } from "./store/StoreProvider.jsx";
import { ToastProvider, useToast } from "./components/ui/Toast.jsx";
import { TabBar } from "./components/ui/TabBar.jsx";
import { Sidebar } from "./components/ui/Sidebar.jsx";
import { QuickLogSheet } from "./components/today/QuickLogSheet.jsx";
import Today from "./routes/Today.jsx";
import Stats from "./routes/Stats.jsx";
import Savings from "./routes/Savings.jsx";
import Journal from "./routes/Journal.jsx";
import Journey from "./routes/Journey.jsx";
import Habits from "./routes/Habits.jsx";
import Settings from "./routes/Settings.jsx";
import * as storage from "./lib/storage.js";
import { computeJourney } from "./lib/journey.js";
import { confettiBurst } from "./lib/confetti.js";

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}

/** Soft aurora glows + film grain behind everything. */
function Ambient() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-rose/[0.07] blur-[120px]" />
      <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-lavender/[0.06] blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[380px] w-[380px] rounded-full bg-coral/[0.05] blur-[120px]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}

const KEY_ROUTES = { 1: "/", 2: "/stats", 3: "/journey", 4: "/journal", 5: "/savings" };

/** Celebrates level-ups and newly earned achievements (once each). */
function JourneyWatcher() {
  const { settings, categories, months, habits, habitLog, journal, savings } = useStore();
  const toast = useToast();
  useEffect(() => {
    const j = computeJourney({
      habits, habitLog, journal, savings,
      dailyTarget: settings.dailyTarget ?? 180,
      categories,
    });
    const earnedIds = j.achievements.filter((a) => a.earned).map((a) => a.id);
    const seen = storage.get("journeySeen");
    if (!seen) {
      // First run: existing history is honored silently, not re-celebrated.
      storage.set("journeySeen", { level: j.levelIndex, ach: earnedIds });
      return;
    }
    const newAch = j.achievements.filter((a) => a.earned && !seen.ach.includes(a.id));
    if (j.levelIndex > seen.level) {
      confettiBurst();
      toast.show(`Level up! Level ${j.levelIndex + 1} — ${j.levelName} 🌹`);
    } else if (newAch.length) {
      confettiBurst();
      toast.show(`Achievement unlocked: ${newAch[0].emoji} ${newAch[0].title}`);
    }
    if (j.levelIndex !== seen.level || newAch.length) {
      storage.set("journeySeen", {
        level: j.levelIndex,
        ach: [...new Set([...seen.ach, ...earnedIds])],
      });
    }
  }, [months, habitLog, journal, savings, habits, settings.dailyTarget, categories, toast]);
  return null;
}

function Shell() {
  const [logOpen, setLogOpen] = useState(false);
  const navigate = useNavigate();

  // Desktop shortcuts: L = quick log, 1–5 = navigate. Never while typing.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable) return;
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        setLogOpen(true);
      } else if (KEY_ROUTES[e.key]) {
        navigate(KEY_ROUTES[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="relative lg:flex">
      <Ambient />
      <Sidebar onPlus={() => setLogOpen(true)} />
      <main className="mx-auto w-full max-w-md px-4 pb-32 pt-5 lg:max-w-5xl lg:px-10 lg:pb-16 lg:pt-10">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Today />} />
        </Routes>
      </main>
      <JourneyWatcher />
      <div className="lg:hidden">
        <TabBar onPlus={() => setLogOpen(true)} />
      </div>
      <QuickLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
