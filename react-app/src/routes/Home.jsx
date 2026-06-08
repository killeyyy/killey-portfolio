import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import Process from "../components/Process.jsx";
import Work from "../components/Work.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
