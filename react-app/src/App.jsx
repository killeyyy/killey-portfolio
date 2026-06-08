import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Home from "./routes/Home.jsx";
import CaseStudy from "./routes/CaseStudy.jsx";
import Owner from "./routes/Owner.jsx";
import NotFound from "./routes/NotFound.jsx";
import SmoothScroll from "./lib/SmoothScroll.jsx";
import Cursor from "./components/Cursor.jsx";
import Preloader from "./components/Preloader.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Preloader />
        <Cursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded focus:bg-crimson focus:px-4 focus:py-2 focus:text-sm focus:text-silver"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </MotionConfig>
  );
}
