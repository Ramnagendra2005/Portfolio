import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/* ───── DATA ───── */
const NAV_LINKS = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

const SKILLS = [
  { name: 'React / Next.js', pct: 90 },
  { name: 'JavaScript / TypeScript', pct: 92 },
  { name: 'Python / Flask', pct: 88 },
  { name: 'Node.js / Express', pct: 85 },
  { name: 'C / C++ / Java', pct: 85 },
  { name: 'MongoDB / SQL', pct: 82 },
  { name: 'TensorFlow / ML', pct: 75 },
  { name: 'Linux / DevOps', pct: 78 },
];

const TECH_STACK = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Flask', 'TensorFlow',
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Git', 'GitHub',
  'MySQL', 'SQLite', 'Figma', 'Linux', 'Nginx', 'REST APIs', 'Tableau', 'MediaPipe',
];

const PROJECTS = [
  {
    num: '01', year: '2025', title: 'Daily Dungeon',
    desc: 'Full-stack MERN productivity platform with task management, goal tracking, journaling, and analytics dashboards for actionable insights.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind'],
    accent: '#00FFD1', spotColor: 'rgba(0,255,209,.06)',
  },
  {
    num: '02', year: '2025', title: 'Smart Posture',
    desc: 'AI-powered real-time posture detection using webcam input with ML inference pipelines, alerts, and comprehensive health reports.',
    tags: ['Python', 'Flask', 'TensorFlow', 'MediaPipe', 'OpenCV'],
    accent: '#FF6BF8', spotColor: 'rgba(255,107,248,.06)',
  },
  {
    num: '03', year: '2024', title: 'BlogApp',
    desc: 'Secure full-stack blogging platform with authentication, role-based access control, CRUD operations, and database integrity.',
    tags: ['Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    accent: '#FFC84A', spotColor: 'rgba(255,200,74,.06)',
  },
  {
    num: '04', year: '2025', title: 'Forte AI Website',
    desc: 'Modern responsive company website with clean UI, plus an HR attrition prediction model using Python and machine learning.',
    tags: ['React', 'JavaScript', 'Python', 'ML', 'HTML/CSS'],
    accent: '#4A9FFF', spotColor: 'rgba(74,159,255,.06)',
  },
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
  {
    icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFC84A" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>',
    title: '800+ Problems', sub: 'LeetCode · Codeforces · HackerRank'
  },
  {
    icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#00FFD1" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
    title: 'Gold Certified Coder', sub: 'Smart Interviews 2025'
  },
  {
    icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FF6BF8" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    title: 'Semi-Finalist', sub: 'CodeNox OctCoder Reloaded 2024'
  },
];

const CONTACT_WORDS = ["Let's", "solve", "something", "complex", "together."];

/* ───── Noise SVG ───── */
const noiseSvg = `<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;

export default function Portfolio() {
  const [activeNav, setActiveNav] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [expVisible, setExpVisible] = useState(false);

  const skillsRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const heroStatsRef = useRef(null);
  const expRef = useRef(null);
  const countsStarted = useRef(false);

  /* ── Mouse tracking ── */
  useEffect(() => {
    const move = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = e.clientX - 6 + 'px';
        cursorDotRef.current.style.top = e.clientY - 6 + 'px';
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = e.clientX - 20 + 'px';
        cursorRingRef.current.style.top = e.clientY - 20 + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  /* ── Scroll progress ── */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Skills observer ── */
  useEffect(() => {
    if (!skillsRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Hero stats count-up ── */
  useEffect(() => {
    if (!heroStatsRef.current) return;
    const targets = [1, 4, 800];
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countsStarted.current) {
          countsStarted.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(targets.map(t => Math.round(t * eased)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(heroStatsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Experience timeline observer ── */
  useEffect(() => {
    if (!expRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setExpVisible(true); },
      { threshold: 0.2 }
    );
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
  const handleInput = useCallback((e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setFormData({ name: '', email: '', message: '' }); }, 4000);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  /* Magnetic button effect */
  const handleMagnetic = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }, []);
  const handleMagneticLeave = useCallback((e) => {
    e.currentTarget.style.transform = '';
  }, []);

  /* 3D tilt effect */
  const handleTilt = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -8}deg) rotateY(${(x - 0.5) * 8}deg) scale3d(1.02,1.02,1.02)`;
  }, []);
  const handleTiltLeave = useCallback((e) => {
    e.currentTarget.style.transform = '';
  }, []);

  /* Project card spotlight */
  const handleSpotlight = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  }, []);

  /* Ripple on button click */
  const handleRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple-circle';
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    circle.style.width = circle.style.height = '20px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />

      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Noise */}
      <div
        className="noise-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`, backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      {/* Grid BG */}
      <div className="grid-bg" />

      {/* Mouse Glow */}
      <div className="mouse-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* ═══ NAV ═══ */}
      <nav className="nav">
        <div className="nav-inner">
          <a className="nav-logo" href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Ram<span>.</span>dev
          </a>

          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className={activeNav === l.toLowerCase() ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase()); }}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <a className="nav-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
            Hire Me
          </a>

          <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className={activeNav === l.toLowerCase() ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(l.toLowerCase()); }}
          >
            {l}
          </a>
        ))}
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-label">
              Software Engineer & Problem Solver
              <span className="hero-label-cursor" />
            </div>
            <h1 className="hero-name">
              <span className="glitch-name text-reveal" data-text="Ramnagendra" style={{ animationDelay: '.4s' }}>Ramnagendra</span>
              <br />
              <span className="glitch-name text-reveal" data-text="Varma Sripada" style={{ color: '#00FFD1', animationDelay: '.7s' }}>
                Varma Sripada
              </span>
            </h1>
            <p className="hero-desc">
              I engineer robust full-stack systems and tackle complex algorithmic challenges.
              800+ DSA problems solved. Driven by logic, clean architecture, and shipping real products.
            </p>
            <div className="hero-ctas">
              <a
                className="btn-primary btn-magnetic"
                href="#projects"
                onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}
                onMouseMove={handleMagnetic}
                onMouseLeave={handleMagneticLeave}
              >
                View Projects
              </a>
              <a
                className="btn-secondary btn-magnetic"
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                onMouseMove={handleMagnetic}
                onMouseLeave={handleMagneticLeave}
              >
                Get In Touch
              </a>
            </div>
            <div className="hero-stats" ref={heroStatsRef}>
              <div className="hero-stat">
                <h3>{counts[0]}<span>+</span></h3>
                <p>Years Experience</p>
              </div>
              <div className="hero-stat">
                <h3>{counts[1]}<span>+</span></h3>
                <p>Projects Built</p>
              </div>
              <div className="hero-stat">
                <h3>{counts[2]}<span>+</span></h3>
                <p>Problems Solved</p>
              </div>
            </div>
          </div>

          {/* Orbital Visual */}
          <div className="hero-visual">
            <div className="orbit-container">
              {/* Conic gradient glow */}
              <div className="orbit-glow" />
              <div className="orbit-ring orbit-ring-1">
                <div className="orbit-dot orbit-dot-1" />
                <div className="orbit-dot orbit-dot-4" />
              </div>
              <div className="orbit-ring orbit-ring-2">
                <div className="orbit-dot orbit-dot-2" />
              </div>
              <div className="orbit-ring orbit-ring-3">
                <div className="orbit-dot orbit-dot-3" />
              </div>
              <div className="orbit-center" />
              <div className="orbit-center-inner" />
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="float-particle"
                  style={{
                    width: 4 + Math.random() * 4,
                    height: 4 + Math.random() * 4,
                    background: ['#00FFD1', '#FF6BF8', '#FFC84A'][i % 3],
                    top: `${15 + Math.random() * 70}%`,
                    left: `${15 + Math.random() * 70}%`,
                    opacity: 0.3 + Math.random() * 0.4,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${4 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" data-section="about" className="section">
        <div className="reveal">
          <div className="section-label">About Me</div>
          <h2 className="section-title">
            Engineering solutions<br />that <span style={{ color: '#00FFD1' }}>scale</span>.
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-text reveal-left reveal-delay-1">
            <p>
              Hey! I'm <span className="about-highlight">Ramnagendra Varma Sripada</span> — a B.Tech CSE student
              at VNR VJIET (JNTUH) with a <span className="about-highlight">9.25 CGPA</span>. I think in
              algorithms, build in code, and ship products that work.
            </p>
            <p>
              With <span className="about-highlight">800+ DSA problems</span> solved across LeetCode, Codeforces,
              and HackerRank, I approach every engineering challenge with structured thinking.
              As an <span className="about-highlight">AI Developer Intern at Forte AI</span>, I built production
              web systems and ML models — combining <span className="about-highlight">full-stack engineering</span> with
              <span className="about-highlight"> data-driven problem solving</span>.
            </p>
            <p>
              I'm obsessed with clean architecture, efficient algorithms, and turning complex
              problems into elegant, maintainable solutions.
            </p>
            <div className="about-tags">
              <span className="about-tag available">✦ Available for Internships</span>
              <span className="about-tag">Problem Solver</span>
              <span className="about-tag">Full-Stack</span>
              <span className="about-tag">Competitive Coder</span>
            </div>
          </div>
          <div
            className="about-card reveal reveal-delay-2"
            onMouseMove={handleTilt}
            onMouseLeave={handleTiltLeave}
          >
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 20 }}>
              Quick Facts
            </div>
            {QUICK_FACTS.map((f) => (
              <div className="about-card-row" key={f.key}>
                <span className="about-card-key">{f.key}</span>
                <span className="about-card-val">{f.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" data-section="skills" className="section" ref={skillsRef}>
        <div className="reveal">
          <div className="section-label">Skills & Tools</div>
          <h2 className="section-title">
            My technical<br /><span style={{ color: '#FF6BF8' }}>toolkit</span>.
          </h2>
        </div>
        <div className="skills-grid reveal reveal-delay-1">
          {SKILLS.map((s) => (
            <div className="skill-item" key={s.name}>
              <div className="skill-header">
                <span className="skill-name">{s.name}</span>
                <span className="skill-pct">{s.pct}%</span>
              </div>
              <div className="skill-bar-bg">
                <div
                  className="skill-bar-fill"
                  style={{ width: skillsVisible ? `${s.pct}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="reveal reveal-delay-2" style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>
            Tech Stack
          </div>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
                <span className="tech-pill" key={`${t}-${i}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══ */}
      <section id="projects" data-section="projects" className="section">
        <div className="reveal">
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">
            Things I've<br /><span style={{ color: '#FFC84A' }}>built</span>.
          </h2>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <div
              className={`project-card reveal reveal-delay-${i + 1}`}
              key={p.num}
              style={{ '--accent': p.accent, '--sc': p.spotColor }}
              onMouseMove={handleSpotlight}
              onMouseLeave={(e) => { handleTiltLeave(e); }}
            >
              <div className="project-number">{p.num}</div>
              <div className="project-arrow">↗</div>
              <div className="project-year">{p.year}</div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span className="project-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" data-section="experience" className="section">
        <div className="reveal">
          <div className="section-label">Experience</div>
          <h2 className="section-title">
            Where I've<br /><span style={{ color: '#00FFD1' }}>worked</span>.
          </h2>
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

        {/* Achievements */}
        <div className="reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
            Achievements
          </div>
        </div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a, i) => (
            <div
              className={`ach-card reveal reveal-delay-${i + 1}`}
              key={a.title}
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltLeave}
            >
              <div className="ach-icon" dangerouslySetInnerHTML={{ __html: a.icon }} />
              <div className="ach-title">{a.title}</div>
              <div className="ach-sub">{a.sub}</div>
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
                  <span
                    key={i}
                    className="word-reveal"
                    style={{
                      transitionDelay: `${0.1 + i * 0.12}s`,
                      color: word === 'complex' ? '#00FFD1' : undefined,
                    }}
                  >
                    {word}{' '}
                  </span>
                ))}
                <br />
              </h2>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="contact-row" style={{ transitionDelay: '.2s' }}>
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 4l10 9 10-9" /></svg></div>
                <div className="contact-row-text">
                  <a href="mailto:sripadaram2005@gmail.com">sripadaram2005@gmail.com</a>
                </div>
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
                <div className="contact-row-text">
                  <a href="https://www.linkedin.com/in/ram-nagendra-sripada-433869291/" target="_blank" rel="noreferrer">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            {!sent ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" name="name" value={formData.name} onChange={handleInput} placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input className="form-input" name="email" type="email" value={formData.email} onChange={handleInput} placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" name="message" value={formData.message} onChange={handleInput} placeholder="Tell me about your project..." required />
                </div>
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

      {/* ═══ WAVE SEPARATOR ═══ */}
      <div className="wave-separator">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path className="wave-fill" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30" />
        </svg>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-copy">© 2025 Ram Sripada. All rights reserved.</div>
        <div className="footer-socials">
          <a className="footer-social" href="https://www.linkedin.com/in/ram-nagendra-sripada-433869291/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="footer-social" href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="footer-social" href="mailto:sripadaram2005@gmail.com">
            Email
          </a>
        </div>
      </footer>
    </>
  );
}
