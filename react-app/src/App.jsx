import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, MotionConfig } from "framer-motion";
import Home from "./routes/Home.jsx";
import SmoothScroll from "./lib/SmoothScroll.jsx";
import Cursor from "./components/Cursor.jsx";
import Preloader from "./components/Preloader.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import EasterEgg from "./components/EasterEgg.jsx";
import ErrorBoundary from "./lib/ErrorBoundary.jsx";
import BmlaGate from "./components/bmla/BmlaGate.jsx";

// Code-split the secondary routes out of the landing bundle. Home stays eager
// (it's the LCP route); the cockpit + case studies load on navigation.
const CaseStudy = lazy(() => import("./routes/CaseStudy.jsx"));
const Owner = lazy(() => import("./routes/Owner.jsx"));
const NotFound = lazy(() => import("./routes/NotFound.jsx"));
const Bmla = lazy(() => import("./routes/bmla/Bmla.jsx"));
const BmlaLearn = lazy(() => import("./routes/bmla/BmlaLearn.jsx"));
const BmlaLesson = lazy(() => import("./routes/bmla/BmlaLesson.jsx"));
const BmlaResources = lazy(() => import("./routes/bmla/BmlaResources.jsx"));
const BmlaReference = lazy(() => import("./routes/bmla/BmlaReference.jsx"));
const BmlaExam = lazy(() => import("./routes/bmla/BmlaExam.jsx"));

// Framer Motion's feature pack loads in its own async chunk after first paint.
const loadFeatures = () => import("./lib/features.js").then((mod) => mod.default);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ErrorBoundary>
            <Preloader />
            <Cursor />
            <CommandPalette />
            <EasterEgg />
          </ErrorBoundary>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:text-silver"
          >
            Skip to content
          </a>
          <ScrollToTop />
          <SmoothScroll>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/bmla" element={<BmlaGate><Bmla /></BmlaGate>} />
                <Route path="/bmla/learn" element={<BmlaGate><BmlaLearn /></BmlaGate>} />
                <Route path="/bmla/lesson/:slug" element={<BmlaGate><BmlaLesson /></BmlaGate>} />
                <Route path="/bmla/resources" element={<BmlaGate><BmlaResources /></BmlaGate>} />
                <Route path="/bmla/reference" element={<BmlaGate><BmlaReference /></BmlaGate>} />
                <Route path="/bmla/exam" element={<BmlaGate><BmlaExam /></BmlaGate>} />
                <Route path="/owner" element={<Owner />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SmoothScroll>
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  );
}
