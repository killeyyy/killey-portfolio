import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, MotionConfig } from "framer-motion";
import Home from "./routes/Home.jsx";
import SmoothScroll from "./lib/SmoothScroll.jsx";
import Cursor from "./components/Cursor.jsx";
import Preloader from "./components/Preloader.jsx";
import ErrorBoundary from "./lib/ErrorBoundary.jsx";

// Code-split the secondary routes out of the landing bundle. Home stays eager
// (it's the LCP route); the cockpit + case studies load on navigation.
const CaseStudy = lazy(() => import("./routes/CaseStudy.jsx"));
const Owner = lazy(() => import("./routes/Owner.jsx"));
const NotFound = lazy(() => import("./routes/NotFound.jsx"));

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
