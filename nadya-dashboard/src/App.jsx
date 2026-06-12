import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate,
} from "react-router-dom";
import { StoreProvider, useStore } from "./store/StoreProvider.jsx";
import { ToastProvider, useToast } from "./components/ui/Toast.jsx";
import { TabBar } from "./components/ui/TabBar.jsx";
import { Sidebar } from "./components/ui/Sidebar.jsx";
import { QuickLogSheet } from "./components/today/QuickLogSheet.jsx";
import { TimerPill } from "./components/ui/TimerPill.jsx";
import { Onboarding } from "./components/onboarding/Onboarding.jsx";
import Today from "./routes/Today.jsx";
import Stats from "./routes/Stats.jsx";
import Savings from "./routes/Savings.jsx";
import Journal from "./routes/Journal.jsx";
import Journey from "./routes/Journey.jsx";
import Wrapped from "./routes/Wrapped.jsx";
import Habits from "./routes/Habits.jsx";
import Settings from "./routes/Settings.jsx";
import * as storage from "./lib/storage.js";
import { computeJourney } from "./lib/journey.js";
import { confettiBurst } from "./lib/confetti.js";
import { levelUpMoment } from "./lib/celebrate.js";

// Data router (vs <BrowserRouter>): required for react-router's
// `viewTransition` support on Link/NavLink/navigate (≥6.30).
const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <Today /> },
      { path: "/stats", element: <Stats /> },
      { path: "/savings", element: <Savings /> },
      { path: "/journal", element: <Journal /> },
      { path: "/journey", element: <Journey /> },
      { path: "/wrapped", element: <Wrapped /> },
      { path: "/habits", element: <Habits /> },
      { path: "/settings", element: <Settings /> },
      { path: "*", element: <Today /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </StoreProvider>
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

// Spatial order for direction-aware view transitions (Family's "fly, don't
// teleport"): navigating to a higher index slides forward, lower slides back.
const ROUTE_ORDER = {
  "/": 0, "/stats": 1, "/journey": 2, "/journal": 3,
  "/savings": 4, "/habits": 5, "/settings": 6,
};

/**
 * Sets `data-nav-dir` on <html> during the route update so the
 * ::view-transition CSS can pick a directional slide. Routes outside
 * ROUTE_ORDER (e.g. /wrapped, which morphs) get the default crossfade.
 */
function useNavDirection() {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  useLayoutEffect(() => {
    const from = ROUTE_ORDER[prev.current];
    const to = ROUTE_ORDER[pathname];
    if (from !== undefined && to !== undefined && from !== to) {
      document.documentElement.dataset.navDir = to > from ? "forward" : "back";
    } else {
      delete document.documentElement.dataset.navDir;
    }
    prev.current = pathname;
  }, [pathname]);
}

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
      if (!levelUpMoment(`Level ${j.levelIndex + 1}`, j.levelName)) {
        toast.show(`Level up! Level ${j.levelIndex + 1} — ${j.levelName} 🌹`);
      }
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

// First run only: brand-new profile (nothing logged anywhere) → welcome flow.
// Existing users get the flag set silently and never see it.
function freshProfile() {
  if (storage.get("onboarded")) return false;
  const fresh =
    storage.listKeys("act:").length === 0 &&
    storage.get("habits", []).length === 0 &&
    Object.keys(storage.get("journal", {})).length === 0;
  if (!fresh) storage.set("onboarded", true);
  return fresh;
}

function Shell() {
  const [logOpen, setLogOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(freshProfile);
  const navigate = useNavigate();
  useNavDirection();

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
        navigate(KEY_ROUTES[e.key], { viewTransition: true });
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
        {/* Screen transitions are view-transition driven (see index.css);
            browsers without support get an instant swap. */}
        <Outlet />
      </main>
      <JourneyWatcher />
      <TimerPill />
      {onboarding && (
        <Onboarding
          onDone={() => {
            storage.set("onboarded", true);
            setOnboarding(false);
          }}
        />
      )}
      <div className="lg:hidden">
        <TabBar onPlus={() => setLogOpen(true)} />
      </div>
      <QuickLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
