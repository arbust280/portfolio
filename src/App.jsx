import { MotionConfig } from 'framer-motion';
import './index.css';
import Background from './components/Background';
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
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#work">Skip to content</a>
      <Background />
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
