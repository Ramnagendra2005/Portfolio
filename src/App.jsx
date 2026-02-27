import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ───── DATA ───── */
const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Profiles', 'Contact'];

const SKILL_ICONS = [
  { name: 'React', color: '#61DAFB', icon: '<svg viewBox="0 0 36 36"><ellipse cx="18" cy="18" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.5"/><ellipse cx="18" cy="18" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(60 18 18)"/><ellipse cx="18" cy="18" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.5" transform="rotate(120 18 18)"/><circle cx="18" cy="18" r="2.5" fill="#61DAFB"/></svg>' },
  { name: 'JavaScript', color: '#F7DF1E', icon: '<svg viewBox="0 0 36 36"><rect x="4" y="4" width="28" height="28" rx="4" fill="none" stroke="#F7DF1E" stroke-width="1.5"/><text x="18" y="26" text-anchor="middle" fill="#F7DF1E" font-family="Syne" font-weight="800" font-size="16">JS</text></svg>' },
  { name: 'TypeScript', color: '#3178C6', icon: '<svg viewBox="0 0 36 36"><rect x="4" y="4" width="28" height="28" rx="4" fill="none" stroke="#3178C6" stroke-width="1.5"/><text x="18" y="26" text-anchor="middle" fill="#3178C6" font-family="Syne" font-weight="800" font-size="16">TS</text></svg>' },
  { name: 'Python', color: '#3776AB', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#3776AB" stroke-width="1.5"><path d="M18 4c-6 0-7 3-7 5v4h8v1H9s-6 0-6 7 4 7 4 7h3v-4s0-4 4-4h7s4 0 4-4v-5s0-7-7-7z"/><circle cx="14" cy="11" r="1.5" fill="#3776AB"/></svg>' },
  { name: 'Node.js', color: '#339933', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#339933" stroke-width="1.5"><path d="M18 4L6 11v14l12 7 12-7V11L18 4z"/><path d="M18 14v8" stroke="#339933" stroke-width="2"/><circle cx="18" cy="24" r="1" fill="#339933"/></svg>' },
  { name: 'Express', color: '#ffffff', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#aaa" stroke-width="1.5"><path d="M4 18h28M10 10l8 8-8 8M26 10l-8 8 8 8"/></svg>' },
  { name: 'MongoDB', color: '#47A248', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#47A248" stroke-width="1.5"><path d="M18 4c-2 6-8 10-8 16a8 8 0 0016 0c0-6-6-10-8-16z"/><line x1="18" y1="10" x2="18" y2="30" stroke="#47A248" stroke-width="1.5"/></svg>' },
  { name: 'Flask', color: '#ffffff', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M14 6h8M18 6v10M10 28c0-6 4-10 8-12s8 6 8 12H10z"/></svg>' },
  { name: 'C++', color: '#00599C', icon: '<svg viewBox="0 0 36 36"><text x="18" y="25" text-anchor="middle" fill="#00599C" font-family="Syne" font-weight="800" font-size="14">C++</text><rect x="4" y="4" width="28" height="28" rx="14" fill="none" stroke="#00599C" stroke-width="1.5"/></svg>' },
  { name: 'HTML', color: '#E34F26', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#E34F26" stroke-width="1.5"><path d="M6 4l2.5 28L18 34l9.5-2L30 4H6z"/><path d="M18 8v22M12 10h12l-1 14-5 2-5-2-.5-6h3l.3 3 2.2.8 2.2-.8.3-4H12.5l-.5-6h12"/></svg>' },
  { name: 'CSS', color: '#1572B6', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#1572B6" stroke-width="1.5"><path d="M6 4l2.5 28L18 34l9.5-2L30 4H6z"/><path d="M24 10H12l.5 6h10.5l-1 8-4 2-4-2-.3-4h3l.15 2 1.15.5 1.15-.5.35-3H12.5l-1-9h13"/></svg>' },
  { name: 'TensorFlow', color: '#FF6F00', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#FF6F00" stroke-width="1.5"><path d="M18 4v28M10 10l8 4v8l-8-4V10zM26 10l-8 4v8l8-4V10z"/></svg>' },
  { name: 'Git', color: '#F05032', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#F05032" stroke-width="1.5"><circle cx="18" cy="18" r="3"/><circle cx="10" cy="10" r="2.5"/><circle cx="26" cy="26" r="2.5"/><circle cx="26" cy="10" r="2.5"/><path d="M13 13l2 2M21 21l2 2M21 15l2-2"/></svg>' },
  { name: 'MySQL', color: '#4479A1', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#4479A1" stroke-width="1.5"><ellipse cx="18" cy="10" rx="12" ry="4"/><path d="M6 10v16c0 2.2 5.4 4 12 4s12-1.8 12-4V10"/><path d="M6 18c0 2.2 5.4 4 12 4s12-1.8 12-4"/></svg>' },
  { name: 'Figma', color: '#A259FF', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#A259FF" stroke-width="1.5"><rect x="10" y="4" width="8" height="8" rx="4"/><rect x="18" y="4" width="8" height="8" rx="4"/><rect x="10" y="12" width="8" height="8" rx="4"/><circle cx="22" cy="16" r="4"/><rect x="10" y="20" width="8" height="12" rx="4"/></svg>' },
  { name: 'Linux', color: '#FCC624', icon: '<svg viewBox="0 0 36 36" fill="none" stroke="#FCC624" stroke-width="1.5"><path d="M18 6c-4 0-7 4-7 10 0 4 1 7 3 9l-3 5h14l-3-5c2-2 3-5 3-9 0-6-3-10-7-10z"/><circle cx="15" cy="14" r="1.5" fill="#FCC624"/><circle cx="21" cy="14" r="1.5" fill="#FCC624"/><path d="M14 20c2 2 6 2 8 0"/></svg>' },
];

const TECH_STACK = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Flask', 'TensorFlow',
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Git', 'GitHub',
  'MySQL', 'SQLite', 'Figma', 'Linux', 'Nginx', 'REST APIs', 'Tableau', 'MediaPipe',
];

const PROJECTS = [
  { num: '01', year: '2025', title: 'Daily Dungeon', desc: 'Full-stack MERN productivity platform with task management, goal tracking, journaling, and analytics dashboards for actionable insights.', tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind'], accent: '#00FFD1', spotColor: 'rgba(0,255,209,.06)' },
  { num: '02', year: '2025', title: 'Smart Posture', desc: 'AI-powered real-time posture detection using webcam input with ML inference pipelines, alerts, and comprehensive health reports.', tags: ['Python', 'Flask', 'TensorFlow', 'MediaPipe', 'OpenCV'], accent: '#FF6BF8', spotColor: 'rgba(255,107,248,.06)' },
  { num: '03', year: '2024', title: 'BlogApp', desc: 'Secure full-stack blogging platform with authentication, role-based access control, CRUD operations, and database integrity.', tags: ['Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript'], accent: '#FFC84A', spotColor: 'rgba(255,200,74,.06)' },
  { num: '04', year: '2025', title: 'Forte AI Website', desc: 'Modern responsive company website with clean UI, plus an HR attrition prediction model using Python and machine learning.', tags: ['React', 'JavaScript', 'Python', 'ML', 'HTML/CSS'], accent: '#4A9FFF', spotColor: 'rgba(74,159,255,.06)' },
];

const QUICK_FACTS = [
  { key: 'Name', val: 'Ram Sripada' },
  { key: 'Location', val: 'Warangal, Telangana' },
  { key: 'Experience', val: 'AI Dev Intern @ Forte AI' },
  { key: 'Focus', val: 'Problem Solving & Engineering' },
  { key: 'DSA', val: '800+ Problems Solved' },
  { key: 'CGPA', val: '9.25 / 10.0' },
];

const ACHIEVEMENTS = [
  { icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFC84A" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>', title: '800+ Problems', sub: 'LeetCode · Codeforces · HackerRank' },
  { icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#00FFD1" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>', title: 'Gold Certified Coder', sub: 'Smart Interviews 2025' },
  { icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FF6BF8" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>', title: 'Semi-Finalist', sub: 'CodeNox OctCoder Reloaded 2024' },
];

const CODING_PROFILES = [
  { name: 'LeetCode', handle: '@ramsripada', url: 'https://leetcode.com/', color: '#FFA116', glow: 'rgba(255,161,22,.08)', stats: [{ val: '500+', label: 'Solved' }, { val: '1700+', label: 'Rating' }], icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#FFA116" stroke-width="1.5" stroke-linecap="round"><path d="M12 3L2 9l10 6 10-6-10-6z"/><path d="M2 17l10 6 10-6"/><path d="M2 13l10 6 10-6"/></svg>' },
  { name: 'Codeforces', handle: '@ramsripada', url: 'https://codeforces.com/', color: '#1F8ACB', glow: 'rgba(31,138,203,.08)', stats: [{ val: '200+', label: 'Solved' }, { val: 'Pupil', label: 'Rank' }], icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#1F8ACB" stroke-width="1.5"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>' },
  { name: 'GeeksforGeeks', handle: '@ramsripada', url: 'https://geeksforgeeks.org/', color: '#2F8D46', glow: 'rgba(47,141,70,.08)', stats: [{ val: '150+', label: 'Solved' }, { val: '5★', label: 'Score' }], icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#2F8D46" stroke-width="1.5"><path d="M5 12a7 7 0 017-7M12 5a7 7 0 017 7M5 12a7 7 0 007 7M19 12a7 7 0 01-7 7M12 10v4M10 12h4"/></svg>' },
  { name: 'HackerRank', handle: '@ramsripada', url: 'https://hackerrank.com/', color: '#00EA64', glow: 'rgba(0,234,100,.08)', stats: [{ val: '5★', label: 'Problem Solving' }, { val: 'Gold', label: 'Badge' }], icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#00EA64" stroke-width="1.5"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4z"/><path d="M9 9v6M15 9v6M9 12h6"/></svg>' },
  { name: 'CodeChef', handle: '@ramsripada', url: 'https://codechef.com/', color: '#5B4638', glow: 'rgba(91,70,56,.12)', stats: [{ val: '3★', label: 'Rating' }, { val: '100+', label: 'Solved' }], icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#A0785A" stroke-width="1.5"><path d="M12 3c-2 3-5 6-5 11a5 5 0 0010 0c0-5-3-8-5-11z"/><path d="M10 17c1 1 3 1 4 0"/></svg>' },
];

const CONTACT_WORDS = ["Let's", "solve", "something", "complex", "together."];

const noiseSvg = `<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;

export default function Portfolio() {
  const [activeNav, setActiveNav] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [expVisible, setExpVisible] = useState(false);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const heroStatsRef = useRef(null);
  const expRef = useRef(null);
  const countsStarted = useRef(false);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const move = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (cursorDotRef.current) { cursorDotRef.current.style.left = e.clientX - 6 + 'px'; cursorDotRef.current.style.top = e.clientY - 6 + 'px'; }
      if (cursorRingRef.current) { cursorRingRef.current.style.left = e.clientX - 20 + 'px'; cursorRingRef.current.style.top = e.clientY - 20 + 'px'; }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  /* ── Scroll progress + scrolled state ── */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Hero stats count-up ── */
  useEffect(() => {
    if (!heroStatsRef.current) return;
    const targets = [1, 4, 800];
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !countsStarted.current) {
        countsStarted.current = true;
        const duration = 2000, start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1), e = 1 - Math.pow(1 - p, 3);
          setCounts(targets.map(t => Math.round(t * e)));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    obs.observe(heroStatsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Experience observer ── */
  useEffect(() => {
    if (!expRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setExpVisible(true); }, { threshold: 0.2 });
    obs.observe(expRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Active nav on scroll ── */
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveNav(e.target.getAttribute('data-section')); }),
      { threshold: 0.3 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* ── Handlers ── */
  const handleInput = useCallback((e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value })), []);
  const handleSubmit = useCallback((e) => { e.preventDefault(); setSent(true); setTimeout(() => { setSent(false); setFormData({ name: '', email: '', message: '' }); }, 4000); }, []);
  const scrollTo = useCallback((id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }, []);
  const handleMagnetic = useCallback((e) => { const b = e.currentTarget, r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`; }, []);
  const handleMagneticLeave = useCallback((e) => { e.currentTarget.style.transform = ''; }, []);
  const handleTilt = useCallback((e) => { const c = e.currentTarget, r = c.getBoundingClientRect(); c.style.transform = `perspective(800px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -8}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 8}deg) scale3d(1.02,1.02,1.02)`; }, []);
  const handleTiltLeave = useCallback((e) => { e.currentTarget.style.transform = ''; }, []);
  const handleSpotlight = useCallback((e) => { const c = e.currentTarget, r = c.getBoundingClientRect(); c.style.setProperty('--sx', `${e.clientX - r.left}px`); c.style.setProperty('--sy', `${e.clientY - r.top}px`); }, []);
  const handleRipple = useCallback((e) => { const b = e.currentTarget, r = b.getBoundingClientRect(), c = document.createElement('span'); c.className = 'ripple-circle'; c.style.left = `${e.clientX - r.left}px`; c.style.top = `${e.clientY - r.top}px`; c.style.width = c.style.height = '20px'; b.appendChild(c); setTimeout(() => c.remove(), 600); }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="noise-overlay" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <div className="grid-bg" />
      <div className="mouse-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* ═══ NAV ═══ */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="nav-logo" href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Ram<span>.</span>dev
          </a>
          <ul className="nav-links">
            {NAV_LINKS.map((l, i) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className={activeNav === l.toLowerCase() ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase()); }}
                >
                  <span className="nav-link-num">{String(i + 1).padStart(2, '0')}.</span>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <a className="nav-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
            <span className="nav-cta-glow" />
            Contact Me
          </a>
          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className={activeNav === l.toLowerCase() ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase()); }}>{l}</a>
        ))}
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-label">Software Engineer & Problem Solver<span className="hero-label-cursor" /></div>
            <h1 className="hero-name">
              <span className="glitch-name text-reveal" data-text="Ramnagendra" style={{ animationDelay: '.4s' }}>Ramnagendra</span><br />
              <span className="glitch-name text-reveal" data-text="Varma Sripada" style={{ color: '#00FFD1', animationDelay: '.7s' }}>Varma Sripada</span>
            </h1>
            <p className="hero-desc">I engineer robust full-stack systems and tackle complex algorithmic challenges. 800+ DSA problems solved. Driven by logic, clean architecture, and shipping real products.</p>
            <div className="hero-ctas">
              <a className="btn-primary btn-magnetic" href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }} onMouseMove={handleMagnetic} onMouseLeave={handleMagneticLeave}>View Projects</a>
              <a className="btn-secondary btn-magnetic" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} onMouseMove={handleMagnetic} onMouseLeave={handleMagneticLeave}>Get In Touch</a>
            </div>
            <div className="hero-stats" ref={heroStatsRef}>
              <div className="hero-stat"><h3>{counts[0]}<span>+</span></h3><p>Years Experience</p></div>
              <div className="hero-stat"><h3>{counts[1]}<span>+</span></h3><p>Projects Built</p></div>
              <div className="hero-stat"><h3>{counts[2]}<span>+</span></h3><p>Problems Solved</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit-container">
              <div className="orbit-glow" />
              <div className="orbit-ring orbit-ring-1"><div className="orbit-dot orbit-dot-1" /><div className="orbit-dot orbit-dot-4" /></div>
              <div className="orbit-ring orbit-ring-2"><div className="orbit-dot orbit-dot-2" /></div>
              <div className="orbit-ring orbit-ring-3"><div className="orbit-dot orbit-dot-3" /></div>
              <div className="orbit-center" /><div className="orbit-center-inner" />
              {[...Array(6)].map((_, i) => (<div key={i} className="float-particle" style={{ width: 4 + Math.random() * 4, height: 4 + Math.random() * 4, background: ['#00FFD1', '#FF6BF8', '#FFC84A'][i % 3], top: `${15 + Math.random() * 70}%`, left: `${15 + Math.random() * 70}%`, opacity: 0.3 + Math.random() * 0.4, animationDelay: `${i * 0.7}s`, animationDuration: `${4 + Math.random() * 3}s` }} />))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" data-section="about" className="section">
        <div className="reveal">
          <div className="section-label">About Me</div>
          <h2 className="section-title">Engineering solutions<br />that <span style={{ color: '#00FFD1' }}>scale</span>.</h2>
        </div>
        <div className="about-grid">
          <div className="about-text reveal-left reveal-delay-1">
            <p>Hey! I'm <span className="about-highlight">Ramnagendra Varma Sripada</span> — a B.Tech CSE student at VNR VJIET (JNTUH) with a <span className="about-highlight">9.25 CGPA</span>. I think in algorithms, build in code, and ship products that work.</p>
            <p>With <span className="about-highlight">800+ DSA problems</span> solved across LeetCode, Codeforces, and HackerRank, I approach every engineering challenge with structured thinking. As an <span className="about-highlight">AI Developer Intern at Forte AI</span>, I built production web systems and ML models — combining <span className="about-highlight">full-stack engineering</span> with<span className="about-highlight"> data-driven problem solving</span>.</p>
            <p>I'm obsessed with clean architecture, efficient algorithms, and turning complex problems into elegant, maintainable solutions.</p>
            <div className="about-tags">
              <span className="about-tag available">✦ Available for Internships</span>
              <span className="about-tag">Problem Solver</span>
              <span className="about-tag">Full-Stack</span>
              <span className="about-tag">Competitive Coder</span>
            </div>
          </div>
          <div className="about-card reveal reveal-delay-2" onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 20 }}>Quick Facts</div>
            {QUICK_FACTS.map((f) => (<div className="about-card-row" key={f.key}><span className="about-card-key">{f.key}</span><span className="about-card-val">{f.val}</span></div>))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" data-section="skills" className="section">
        <div className="reveal">
          <div className="section-label">Skills & Tools</div>
          <h2 className="section-title">My technical<br /><span style={{ color: '#FF6BF8' }}>toolkit</span>.</h2>
        </div>
        <div className="skill-icons-grid reveal reveal-delay-1">
          {SKILL_ICONS.map((s) => (
            <div className="skill-icon-card" key={s.name} style={{ '--skill-color': `${s.color}33`, '--skill-glow': `${s.color}20` }}>
              <div dangerouslySetInnerHTML={{ __html: s.icon }} />
              <span className="skill-icon-name">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="reveal reveal-delay-2" style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>Tech Stack</div>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...TECH_STACK, ...TECH_STACK].map((t, i) => (<span className="tech-pill" key={`${t}-${i}`}>{t}</span>))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══ */}
      <section id="projects" data-section="projects" className="section">
        <div className="reveal">
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">Things I've<br /><span style={{ color: '#FFC84A' }}>built</span>.</h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <div className={`project-card reveal reveal-delay-${i + 1}`} key={p.num} style={{ '--accent': p.accent, '--sc': p.spotColor }} onMouseMove={handleSpotlight} onMouseLeave={handleTiltLeave}>
              <div className="project-number">{p.num}</div>
              <div className="project-arrow">↗</div>
              <div className="project-year">{p.year}</div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">{p.tags.map((t) => (<span className="project-tag" key={t}>{t}</span>))}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" data-section="experience" className="section">
        <div className="reveal">
          <div className="section-label">Experience</div>
          <h2 className="section-title">Where I've<br /><span style={{ color: '#00FFD1' }}>worked</span>.</h2>
        </div>
        <div className={`exp-wrapper reveal reveal-delay-1${expVisible ? ' visible' : ''}`} ref={expRef}>
          <div className="exp-timeline-line" />
          <div className="exp-timeline-dot" />
          <div className="exp-card">
            <div className="exp-role">AI Developer Intern</div>
            <div className="exp-company">Forte AI — forteai.in</div>
            <div className="exp-period">Aug 2025 — Nov 2025</div>
            <ul className="exp-list">
              <li>Designed and developed a responsive company website with clean, modern UI using HTML, CSS, JavaScript, and React</li>
              <li>Built an HR Attrition Prediction model using Python and Machine Learning to analyze employee turnover risks</li>
              <li>Performed data preprocessing, feature engineering, model training, testing, and evaluation for prediction accuracy</li>
              <li>Documented workflows, model behavior, and results for clarity and maintainability</li>
              <li>Collaborated with cross-functional teams to integrate AI-driven insights into business processes</li>
            </ul>
          </div>
        </div>
        <div className="reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Achievements</div>
        </div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a, i) => (
            <div className={`ach-card reveal reveal-delay-${i + 1}`} key={a.title} onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
              <div className="ach-icon" dangerouslySetInnerHTML={{ __html: a.icon }} /><div className="ach-title">{a.title}</div><div className="ach-sub">{a.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CODING PROFILES ═══ */}
      <section id="profiles" data-section="profiles" className="section">
        <div className="reveal">
          <div className="section-label">Coding Profiles</div>
          <h2 className="section-title">Where I<br /><span style={{ color: '#FFC84A' }}>compete</span>.</h2>
        </div>
        <div className="profiles-grid">
          {CODING_PROFILES.map((p, i) => (
            <div className={`profile-card reveal reveal-delay-${i + 1}`} key={p.name} style={{ '--profile-color': p.color, '--profile-glow': p.glow }}>
              <div className="profile-card-header">
                <div className="profile-card-icon" dangerouslySetInnerHTML={{ __html: p.icon }} />
                <div className="profile-card-info">
                  <h4>{p.name}</h4>
                  <p>{p.handle}</p>
                </div>
              </div>
              <div className="profile-card-stats">
                {p.stats.map((s) => (
                  <div className="profile-stat" key={s.label}>
                    <span className="profile-stat-value">{s.val}</span>
                    <span className="profile-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <a className="profile-visit-btn" href={p.url} target="_blank" rel="noreferrer">
                Visit Profile <span>↗</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" data-section="contact" className="section">
        <div className="contact-grid">
          <div>
            <div className="reveal">
              <div className="section-label">Get In Touch</div>
              <h2 className="contact-big">
                {CONTACT_WORDS.map((word, i) => (
                  <span key={i} className="word-reveal" style={{ transitionDelay: `${0.1 + i * 0.12}s`, color: word === 'complex' ? '#00FFD1' : undefined }}>{word}{' '}</span>
                ))}<br />
              </h2>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="contact-row" style={{ transitionDelay: '.2s' }}>
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 4l10 9 10-9" /></svg></div>
                <div className="contact-row-text"><a href="mailto:sripadaram2005@gmail.com">sripadaram2005@gmail.com</a></div>
              </div>
              <div className="contact-row" style={{ transitionDelay: '.3s' }}>
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></div>
                <div className="contact-row-text">+91-9533376668</div>
              </div>
              <div className="contact-row" style={{ transitionDelay: '.4s' }}>
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                <div className="contact-row-text">Warangal, Telangana, India</div>
              </div>
              <div className="contact-row" style={{ transitionDelay: '.5s' }}>
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></div>
                <div className="contact-row-text"><a href="https://www.linkedin.com/in/ram-nagendra-sripada-433869291/" target="_blank" rel="noreferrer">LinkedIn Profile</a></div>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            {!sent ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" name="name" value={formData.name} onChange={handleInput} placeholder="John Doe" required /></div>
                <div className="form-group"><label className="form-label">Your Email</label><input className="form-input" name="email" type="email" value={formData.email} onChange={handleInput} placeholder="john@example.com" required /></div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" name="message" value={formData.message} onChange={handleInput} placeholder="Tell me about your project..." required /></div>
                <button className="form-btn" type="submit" onClick={handleRipple}>Send Message ↗</button>
              </form>
            ) : (
              <div className="contact-form">
                <div className="sent-state">
                  <div className="sent-icon"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#00FFD1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
                  <div className="sent-title">Message Sent!</div>
                  <div className="sent-desc">Thanks for reaching out. I'll get back to you soon.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wave-separator"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path className="wave-fill" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" /><path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30" /></svg></div>

      <footer className="footer">
        <div className="footer-copy">© 2025 Ram Sripada. All rights reserved.</div>
        <div className="footer-socials">
          <a className="footer-social" href="https://www.linkedin.com/in/ram-nagendra-sripada-433869291/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="footer-social" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <a className="footer-social" href="mailto:sripadaram2005@gmail.com">Email</a>
        </div>
      </footer>
    </>
  );
}
