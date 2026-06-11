import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./store/StoreProvider.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { TabBar } from "./components/ui/TabBar.jsx";
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

function Shell() {
  const [logOpen, setLogOpen] = useState(false);
  return (
    <>
      <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-32 pt-5">
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
      <TabBar onPlus={() => setLogOpen(true)} />
      <QuickLogSheet open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}
