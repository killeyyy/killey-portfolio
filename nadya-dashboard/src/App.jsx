import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { StoreProvider } from "./store/StoreProvider.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { TabBar } from "./components/ui/TabBar.jsx";
import { Sidebar } from "./components/ui/Sidebar.jsx";
import { QuickLogSheet } from "./components/today/QuickLogSheet.jsx";
import Today from "./routes/Today.jsx";
import Stats from "./routes/Stats.jsx";
import Savings from "./routes/Savings.jsx";
import Journal from "./routes/Journal.jsx";
import Habits from "./routes/Habits.jsx";
import Settings from "./routes/Settings.jsx";

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

const KEY_ROUTES = { 1: "/", 2: "/stats", 3: "/savings", 4: "/journal", 5: "/habits" };

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
          <Route path="/habits" element={<Habits />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Today />} />
        </Routes>
      </main>
      <div className="lg:hidden">
        <TabBar onPlus={() => setLogOpen(true)} />
      </div>
      <QuickLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
