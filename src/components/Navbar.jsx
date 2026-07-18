import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';

const MotionNav = motion.nav;
const MotionDiv = motion.div;

const SECTIONS = [
  { id: 'work', label: 'Work', band: '#ff5c4d' },
  { id: 'projects', label: 'Projects', band: '#ffb84d' },
  { id: 'leadership', label: 'Leadership', band: '#5cff8f' },
  { id: 'education', label: 'Education', band: '#5c8aff' },
  { id: 'ethos', label: 'Ethos', band: '#b36bff' },
];

export default function Navbar() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const burgerRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      sheetRef.current?.querySelector('a')?.focus();
      const onKey = (e) => {
        if (e.key === 'Escape') {
          setOpen(false);
          burgerRef.current?.focus();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <MotionNav
        className={`site-nav${scrolled ? ' site-nav--scrolled' : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
            aethrex <span className="nav-logo-dim">/ Refraction</span>
          </a>
          <ul className="nav-links">
            {SECTIONS.map(({ id, label, band }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`nav-link${active === id ? ' nav-link--active' : ''}`}
                  style={{ '--band-link': band }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            ref={burgerRef}
            className={`nav-burger${open ? ' nav-burger--open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </MotionNav>

      {open && (
        <div className="nav-sheet" role="dialog" aria-modal="true" aria-label="Site navigation" ref={sheetRef}>
          <ul>
            {SECTIONS.map(({ id, label, band }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  style={{ '--band-link': band }}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-sheet-dot" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={() => setOpen(false)}>
                <span className="nav-sheet-dot" style={{ '--band-link': '#ffffff' }} aria-hidden />
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}

      <MotionDiv className="scroll-progress" style={{ scaleX: scrollYProgress }} />
    </>
  );
}
