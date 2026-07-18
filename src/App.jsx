import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import './index.css';
import Background from './components/Background';
import CursorLight from './components/CursorLight';
import LightSpine from './components/LightSpine';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Projects from './components/Projects';
import Leadership from './components/Leadership';
import Education from './components/Education';
import Manifesto from './components/Manifesto';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    try {
      if (localStorage.getItem('aethrex-side') === 'light') {
        document.body.classList.add('lightside');
      }
    } catch { /* private mode */ }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#work">Skip to content</a>
      <Background />
      <CursorLight />
      <LightSpine />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Projects />
        <Leadership />
        <Education />
        <Manifesto />
      </main>
      <Footer />
    </MotionConfig>
  );
}
