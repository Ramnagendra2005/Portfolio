import { useState, useEffect, useRef, useCallback } from 'react';

const css = `
/* ===== FONTS & RESET ===== */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&display=swap');

/* ===== CUSTOM CURSOR ===== */
.cursor-dot{position:fixed;width:12px;height:12px;border-radius:50%;background:#00FFD1;pointer-events:none;z-index:10000;mix-blend-mode:difference;transition:transform .15s ease}
.cursor-ring{position:fixed;width:40px;height:40px;border-radius:50%;border:1.5px solid #00FFD1;pointer-events:none;z-index:10000;mix-blend-mode:difference;transition:transform .25s ease,width .3s,height .3s}
body{cursor:none !important}
a,button,input,textarea{cursor:none !important}

/* ===== NOISE OVERLAY ===== */
.noise-overlay{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:.035}

/* ===== GRID BG ===== */
.grid-bg{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;
background-image:
  linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
background-size:60px 60px}

/* ===== MOUSE GLOW ===== */
.mouse-glow{position:fixed;width:600px;height:600px;border-radius:50%;pointer-events:none;z-index:1;
background:radial-gradient(circle,rgba(0,255,209,.07) 0%,transparent 70%);
transform:translate(-50%,-50%);transition:left .3s ease,top .3s ease}

/* ===== SCROLL REVEAL ===== */
.reveal{opacity:0;transform:translateY(60px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:.1s}
.reveal-delay-2{transition-delay:.2s}
.reveal-delay-3{transition-delay:.3s}
.reveal-delay-4{transition-delay:.4s}
.reveal-delay-5{transition-delay:.5s}

/* ===== KEYFRAMES ===== */
@keyframes fadeUp{
  from{opacity:0;transform:translateY(40px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes float{
  0%,100%{transform:translateY(0) rotate(0deg)}
  50%{transform:translateY(-20px) rotate(3deg)}
}
@keyframes spin{
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}
@keyframes spinReverse{
  from{transform:rotate(360deg)}
  to{transform:rotate(0deg)}
}
@keyframes glitch1{
  0%{clip-path:inset(40% 0 61% 0)}
  20%{clip-path:inset(92% 0 1% 0)}
  40%{clip-path:inset(43% 0 1% 0)}
  60%{clip-path:inset(25% 0 58% 0)}
  80%{clip-path:inset(54% 0 7% 0)}
  100%{clip-path:inset(58% 0 43% 0)}
}
@keyframes glitch2{
  0%{clip-path:inset(65% 0 13% 0)}
  20%{clip-path:inset(79% 0 2% 0)}
  40%{clip-path:inset(48% 0 38% 0)}
  60%{clip-path:inset(33% 0 2% 0)}
  80%{clip-path:inset(2% 0 78% 0)}
  100%{clip-path:inset(16% 0 64% 0)}
}
@keyframes pulse{
  0%,100%{opacity:.6}
  50%{opacity:1}
}
@keyframes gradientShift{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes skillBarFill{
  from{width:0}
  to{width:var(--bar-width)}
}
@keyframes dotFloat1{
  0%,100%{transform:translate(0,0)}
  25%{transform:translate(10px,-15px)}
  50%{transform:translate(-5px,-25px)}
  75%{transform:translate(-15px,-10px)}
}
@keyframes dotFloat2{
  0%,100%{transform:translate(0,0)}
  25%{transform:translate(-12px,10px)}
  50%{transform:translate(8px,20px)}
  75%{transform:translate(15px,5px)}
}

/* ===== GLITCH ===== */
.glitch-name{position:relative;display:inline-block}
.glitch-name::before,.glitch-name::after{
  content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;
  opacity:0;pointer-events:none;
}
.glitch-name::before{color:#FF6BF8;z-index:-1}
.glitch-name::after{color:#00FFD1;z-index:-2}
.glitch-name:hover::before{
  opacity:.8;animation:glitch1 .3s infinite linear alternate-reverse;
  left:2px;text-shadow:-2px 0 #FF6BF8;
}
.glitch-name:hover::after{
  opacity:.8;animation:glitch2 .3s infinite linear alternate-reverse;
  left:-2px;text-shadow:2px 0 #00FFD1;
}

/* ===== NAV ===== */
.nav{position:fixed;top:0;left:0;right:0;z-index:9999;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  background:rgba(8,8,8,.7);border-bottom:1px solid rgba(255,255,255,.06)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:70px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;color:#fff;text-decoration:none;letter-spacing:-0.5px}
.nav-logo span{color:#00FFD1}
.nav-links{display:flex;gap:32px;list-style:none}
.nav-links li a{font-family:'Space Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.5);text-decoration:none;text-transform:uppercase;letter-spacing:1.5px;transition:color .3s;position:relative}
.nav-links li a:hover,.nav-links li a.active{color:#00FFD1}
.nav-links li a.active::after{content:'';position:absolute;bottom:-4px;left:0;width:100%;height:2px;background:#00FFD1;border-radius:1px}
.nav-cta{font-family:'Space Mono',monospace;font-size:.78rem;padding:10px 24px;background:transparent;
  border:1px solid #00FFD1;color:#00FFD1;border-radius:6px;text-transform:uppercase;letter-spacing:1.5px;
  transition:all .3s;text-decoration:none}
.nav-cta:hover{background:#00FFD1;color:#080808}

/* ===== HAMBURGER ===== */
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:8px;z-index:10001}
.hamburger span{display:block;width:24px;height:2px;background:#fff;transition:all .3s}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}

/* ===== MOBILE NAV ===== */
.mobile-menu{display:none;position:fixed;top:70px;left:0;right:0;bottom:0;background:rgba(8,8,8,.97);
  backdrop-filter:blur(20px);z-index:9998;flex-direction:column;align-items:center;justify-content:center;gap:32px}
.mobile-menu.open{display:flex}
.mobile-menu a{font-family:'Syne',sans-serif;font-size:1.8rem;color:rgba(255,255,255,.7);text-decoration:none;
  transition:color .3s}
.mobile-menu a:hover,.mobile-menu a.active{color:#00FFD1}

/* ===== SECTION SHARED ===== */
.section{position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:120px 24px}
.section-label{font-family:'Space Mono',monospace;font-size:.75rem;color:#00FFD1;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
.section-label::before{content:'';width:30px;height:1px;background:#00FFD1}
.section-title{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2rem,4vw,3rem);color:#fff;margin-bottom:48px;line-height:1.1}

/* ===== HERO ===== */
.hero{min-height:100vh;display:flex;align-items:center;position:relative;z-index:2;padding-top:100px}
.hero-inner{max-width:1200px;margin:0 auto;padding:0 24px;width:100%;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:40px}
.hero-content{animation:fadeUp .8s ease forwards}
.hero-label{font-family:'Space Mono',monospace;font-size:.75rem;color:#00FFD1;text-transform:uppercase;letter-spacing:3px;
  display:flex;align-items:center;gap:12px;margin-bottom:20px;opacity:0;animation:fadeUp .8s ease .2s forwards}
.hero-label::before{content:'';width:30px;height:1px;background:#00FFD1}
.hero-name{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2.8rem,6vw,5rem);color:#fff;line-height:1;
  margin-bottom:20px;opacity:0;animation:fadeUp .8s ease .3s forwards}
.hero-desc{font-family:'Space Mono',monospace;font-size:.9rem;color:rgba(255,255,255,.5);line-height:1.8;
  max-width:480px;margin-bottom:36px;opacity:0;animation:fadeUp .8s ease .5s forwards}
.hero-ctas{display:flex;gap:16px;opacity:0;animation:fadeUp .8s ease .6s forwards}
.btn-primary{font-family:'Space Mono',monospace;font-size:.8rem;padding:14px 32px;background:#00FFD1;color:#080808;
  border:none;border-radius:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;transition:all .3s;text-decoration:none}
.btn-primary:hover{background:#00e6bc;transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,255,209,.2)}
.btn-secondary{font-family:'Space Mono',monospace;font-size:.8rem;padding:14px 32px;background:transparent;
  color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:8px;font-weight:700;text-transform:uppercase;
  letter-spacing:1px;transition:all .3s;text-decoration:none}
.btn-secondary:hover{border-color:#FF6BF8;color:#FF6BF8;transform:translateY(-2px)}

/* Hero Stats */
.hero-stats{display:flex;gap:40px;margin-top:60px;opacity:0;animation:fadeUp .8s ease .8s forwards}
.hero-stat h3{font-family:'Syne',sans-serif;font-weight:800;font-size:2.2rem;color:#fff}
.hero-stat h3 span{color:#00FFD1}
.hero-stat p{font-family:'Space Mono',monospace;font-size:.7rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1.5px;margin-top:4px}

/* Hero Orbital */
.hero-visual{position:relative;display:flex;align-items:center;justify-content:center;min-height:400px;opacity:0;animation:fadeUp .8s ease .4s forwards}
.orbit-container{position:relative;width:320px;height:320px;animation:float 6s ease-in-out infinite}
.orbit-ring{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.06)}
.orbit-ring-1{width:100%;height:100%;top:0;left:0;animation:spin 20s linear infinite}
.orbit-ring-2{width:75%;height:75%;top:12.5%;left:12.5%;animation:spinReverse 15s linear infinite}
.orbit-ring-3{width:50%;height:50%;top:25%;left:25%;animation:spin 10s linear infinite}
.orbit-dot{position:absolute;width:10px;height:10px;border-radius:50%}
.orbit-dot-1{background:#00FFD1;top:-5px;left:50%;box-shadow:0 0 20px rgba(0,255,209,.5);animation:pulse 2s ease-in-out infinite}
.orbit-dot-2{background:#FF6BF8;top:50%;right:-5px;box-shadow:0 0 20px rgba(255,107,248,.5);animation:pulse 2s ease-in-out .5s infinite}
.orbit-dot-3{background:#FFC84A;bottom:-5px;left:30%;box-shadow:0 0 20px rgba(255,200,74,.5);animation:pulse 2s ease-in-out 1s infinite}
.orbit-dot-4{background:#00FFD1;top:30%;left:-5px;box-shadow:0 0 15px rgba(0,255,209,.4);animation:pulse 2s ease-in-out 1.5s infinite}
.orbit-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70px;height:70px;
  border-radius:50%;background:linear-gradient(135deg,#00FFD1,#FF6BF8);opacity:.15;filter:blur(20px)}
.orbit-center-inner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;
  border-radius:50%;background:#fff}

/* Floating particles around orbit */
.float-particle{position:absolute;border-radius:50%;animation:dotFloat1 5s ease-in-out infinite}
.float-particle:nth-child(odd){animation-name:dotFloat2}

/* ===== ABOUT ===== */
.about-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:60px;align-items:start}
.about-text{font-family:'Space Mono',monospace;font-size:.85rem;color:rgba(255,255,255,.55);line-height:1.9}
.about-text p{margin-bottom:20px}
.about-highlight{color:#00FFD1;font-weight:700}
.about-tags{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
.about-tag{font-family:'Space Mono',monospace;font-size:.7rem;padding:6px 16px;border-radius:20px;
  border:1px solid rgba(0,255,209,.2);color:#00FFD1;text-transform:uppercase;letter-spacing:1px}
.about-tag.available{background:rgba(0,255,209,.1);border-color:#00FFD1}

.about-card{background:#0f0f0f;border-radius:16px;padding:36px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.05)}
.about-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#00FFD1,#FF6BF8,#FFC84A);background-size:200% 100%;animation:gradientShift 4s ease infinite}
.about-card-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0;
  border-bottom:1px solid rgba(255,255,255,.05)}
.about-card-row:last-child{border-bottom:none}
.about-card-key{font-family:'Space Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px}
.about-card-val{font-family:'Space Mono',monospace;font-size:.82rem;color:#fff;text-align:right}

/* ===== SKILLS ===== */
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px 48px;margin-bottom:48px}
.skill-item{margin-bottom:8px}
.skill-header{display:flex;justify-content:space-between;margin-bottom:8px}
.skill-name{font-family:'Space Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.7)}
.skill-pct{font-family:'Space Mono',monospace;font-size:.78rem;color:#00FFD1}
.skill-bar-bg{width:100%;height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
.skill-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#00FFD1,#00e6bc);
  transition:width 1.2s cubic-bezier(.22,1,.36,1)}

.tech-pills{display:flex;flex-wrap:wrap;gap:10px}
.tech-pill{font-family:'Space Mono',monospace;font-size:.72rem;padding:8px 18px;
  border-radius:20px;border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.5);
  transition:all .3s;text-transform:uppercase;letter-spacing:.5px;background:rgba(255,255,255,.02)}
.tech-pill:hover{border-color:#00FFD1;color:#00FFD1;background:rgba(0,255,209,.05);transform:translateY(-2px)}

/* ===== PROJECTS ===== */
.projects-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.project-card{background:#0f0f0f;border:1px solid rgba(255,255,255,.05);border-radius:16px;padding:36px;
  position:relative;overflow:hidden;transition:all .4s;cursor:pointer}
.project-card:hover{transform:translateY(-4px);border-color:var(--accent)}
.project-card:hover .project-title{color:var(--accent)}
.project-card:hover .project-arrow{opacity:1;transform:translate(0,0)}
.project-number{font-family:'Syne',sans-serif;font-weight:800;font-size:5rem;color:rgba(255,255,255,.025);
  position:absolute;top:-10px;right:16px;line-height:1;pointer-events:none}
.project-year{font-family:'Space Mono',monospace;font-size:.7rem;color:rgba(255,255,255,.3);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px}
.project-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;color:#fff;margin-bottom:12px;transition:color .3s;line-height:1.3}
.project-desc{font-family:'Space Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.4);line-height:1.7;margin-bottom:20px}
.project-tags{display:flex;flex-wrap:wrap;gap:8px}
.project-tag{font-family:'Space Mono',monospace;font-size:.65rem;padding:4px 12px;border-radius:12px;
  border:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.5px}
.project-arrow{position:absolute;top:36px;right:36px;font-size:1.4rem;color:var(--accent);
  opacity:0;transform:translate(-10px,10px);transition:all .4s}

/* ===== EXPERIENCE ===== */
.exp-card{background:#0f0f0f;border:1px solid rgba(255,255,255,.05);border-radius:16px;padding:36px;position:relative;overflow:hidden}
.exp-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(180deg,#00FFD1,#FF6BF8)}
.exp-role{font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;color:#fff;margin-bottom:4px}
.exp-company{font-family:'Space Mono',monospace;font-size:.85rem;color:#00FFD1;margin-bottom:4px}
.exp-period{font-family:'Space Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.35);margin-bottom:16px}
.exp-list{list-style:none;padding:0}
.exp-list li{font-family:'Space Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.45);line-height:1.7;padding-left:16px;position:relative;margin-bottom:8px}
.exp-list li::before{content:'▸';position:absolute;left:0;color:#00FFD1}

/* ===== ACHIEVEMENTS ===== */
.ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:32px}
.ach-card{background:#0f0f0f;border:1px solid rgba(255,255,255,.05);border-radius:12px;padding:28px;text-align:center;transition:all .3s}
.ach-card:hover{border-color:rgba(255,200,74,.3);transform:translateY(-3px)}
.ach-icon{font-size:2rem;margin-bottom:12px}
.ach-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:#fff;margin-bottom:8px}
.ach-sub{font-family:'Space Mono',monospace;font-size:.7rem;color:rgba(255,255,255,.35)}

/* ===== CONTACT ===== */
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.contact-big{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(2rem,4vw,3.2rem);color:#fff;line-height:1.15;margin-bottom:40px}
.contact-big span{color:#00FFD1}
.contact-row{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.contact-row-icon{width:36px;height:36px;background:rgba(0,255,209,.06);border-radius:8px;
  display:flex;align-items:center;justify-content:center}
.contact-row-icon svg{width:18px;height:18px;stroke:#00FFD1;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.contact-row-text{font-family:'Space Mono',monospace;font-size:.82rem;color:rgba(255,255,255,.6)}
.contact-row-text a{color:#00FFD1;text-decoration:none;transition:opacity .3s}
.contact-row-text a:hover{opacity:.7}

.contact-form{background:#0f0f0f;border:1px solid rgba(255,255,255,.05);border-radius:16px;padding:40px;position:relative;overflow:hidden}
.contact-form::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,#00FFD1,#FF6BF8)}
.form-group{margin-bottom:20px}
.form-label{font-family:'Space Mono',monospace;font-size:.7rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;display:block}
.form-input{width:100%;padding:14px 18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:8px;color:#fff;font-family:'Space Mono',monospace;font-size:.85rem;transition:border-color .3s;outline:none}
.form-input:focus{border-color:#00FFD1}
.form-input::placeholder{color:rgba(255,255,255,.2)}
textarea.form-input{resize:vertical;min-height:120px}
.form-btn{width:100%;padding:16px;background:#00FFD1;color:#080808;border:none;border-radius:8px;
  font-family:'Space Mono',monospace;font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
  transition:all .3s}
.form-btn:hover{background:#00e6bc;transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,255,209,.2)}

.sent-state{text-align:center;padding:40px}
.sent-icon{font-size:3rem;margin-bottom:16px}
.sent-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.5rem;color:#fff;margin-bottom:8px}
.sent-desc{font-family:'Space Mono',monospace;font-size:.82rem;color:rgba(255,255,255,.4)}

/* ===== FOOTER ===== */
.footer{border-top:1px solid rgba(255,255,255,.05);padding:32px 24px;max-width:1200px;margin:0 auto;
  display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-family:'Space Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.3)}
.footer-socials{display:flex;gap:20px}
.footer-social{font-family:'Space Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.35);
  text-decoration:none;text-transform:uppercase;letter-spacing:1px;transition:color .3s}
.footer-social:hover{color:#00FFD1}

/* ===== RESPONSIVE ===== */
@media(max-width:900px){
  .hero-inner{grid-template-columns:1fr}
  .hero-visual{display:none}
  .about-grid{grid-template-columns:1fr}
  .skills-grid{grid-template-columns:1fr}
  .projects-grid{grid-template-columns:1fr}
  .contact-grid{grid-template-columns:1fr}
  .ach-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .nav-cta{display:none}
  .hamburger{display:flex}
}
@media(max-width:600px){
  .hero-name{font-size:clamp(2rem,10vw,3rem) !important}
  .hero-stats{flex-direction:column;gap:20px}
  .section{padding:80px 16px}
  .footer{flex-direction:column;gap:16px;text-align:center}
}
`;

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
    num: '01',
    year: '2025',
    title: 'Daily Dungeon',
    desc: 'Full-stack MERN productivity platform with task management, goal tracking, journaling, and analytics dashboards for actionable insights.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind'],
    accent: '#00FFD1',
  },
  {
    num: '02',
    year: '2025',
    title: 'Smart Posture',
    desc: 'AI-powered real-time posture detection using webcam input with ML inference pipelines, alerts, and comprehensive health reports.',
    tags: ['Python', 'Flask', 'TensorFlow', 'MediaPipe', 'OpenCV'],
    accent: '#FF6BF8',
  },
  {
    num: '03',
    year: '2024',
    title: 'BlogApp',
    desc: 'Secure full-stack blogging platform with authentication, role-based access control, CRUD operations, and database integrity.',
    tags: ['Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
    accent: '#FFC84A',
  },
  {
    num: '04',
    year: '2025',
    title: 'Forte AI Website',
    desc: 'Modern responsive company website with clean UI, plus an HR attrition prediction model using Python and machine learning.',
    tags: ['React', 'JavaScript', 'Python', 'ML', 'HTML/CSS'],
    accent: '#4A9FFF',
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
    title: '800+ Problems',
    sub: 'LeetCode · Codeforces · HackerRank'
  },
  {
    icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#00FFD1" stroke-width="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
    title: 'Gold Certified Coder',
    sub: 'Smart Interviews 2025'
  },
  {
    icon: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FF6BF8" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    title: 'Semi-Finalist',
    sub: 'CodeNox OctCoder Reloaded 2024'
  },
];

export default function Portfolio() {
  const [activeNav, setActiveNav] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const skillsRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

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

  /* ── IntersectionObserver for skills ── */
  useEffect(() => {
    if (!skillsRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Active nav on scroll ── */
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.getAttribute('data-section'));
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* ── Form handlers ── */
  const handleInput = useCallback((e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  /* ── Noise SVG ── */
  const noiseSvg = `<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;

  return (
    <>
      {/* Inject CSS */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />

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
            <div className="hero-label">Software Engineer & Problem Solver</div>
            <h1 className="hero-name">
              <span className="glitch-name" data-text="Ramnagendra">Ramnagendra</span>
              <br />
              <span className="glitch-name" data-text="Varma Sripada" style={{ color: '#00FFD1' }}>
                Varma Sripada
              </span>
            </h1>
            <p className="hero-desc">
              I engineer robust full-stack systems and tackle complex algorithmic challenges.
              800+ DSA problems solved. Driven by logic, clean architecture, and shipping real products.
            </p>
            <div className="hero-ctas">
              <a className="btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>
                View Projects
              </a>
              <a className="btn-secondary" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
                Get In Touch
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <h3>1<span>+</span></h3>
                <p>Years Experience</p>
              </div>
              <div className="hero-stat">
                <h3>4<span>+</span></h3>
                <p>Projects Built</p>
              </div>
              <div className="hero-stat">
                <h3>800<span>+</span></h3>
                <p>Problems Solved</p>
              </div>
            </div>
          </div>

          {/* Orbital Visual */}
          <div className="hero-visual">
            <div className="orbit-container">
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
              {/* Floating particles */}
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
          <div className="about-text reveal reveal-delay-1">
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
              <span className="about-highlight">data-driven problem solving</span>.
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
          <div className="about-card reveal reveal-delay-2">
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
          <div className="tech-pills">
            {TECH_STACK.map((t) => (
              <span className="tech-pill" key={t}>{t}</span>
            ))}
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
              style={{ '--accent': p.accent }}
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
        <div className="exp-card reveal reveal-delay-1">
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

        {/* Achievements */}
        <div className="reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
            Achievements
          </div>
        </div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a, i) => (
            <div className={`ach-card reveal reveal-delay-${i + 1}`} key={a.title}>
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
                Let's solve<br />something <span>complex</span><br />together.
              </h2>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="contact-row">
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 4l10 9 10-9" /></svg></div>
                <div className="contact-row-text">
                  <a href="mailto:sripadaram2005@gmail.com">sripadaram2005@gmail.com</a>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></div>
                <div className="contact-row-text">+91-9533376668</div>
              </div>
              <div className="contact-row">
                <div className="contact-row-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                <div className="contact-row-text">Warangal, Telangana, India</div>
              </div>
              <div className="contact-row">
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
                  <input
                    className="form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleInput}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInput}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input"
                    name="message"
                    value={formData.message}
                    onChange={handleInput}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                <button className="form-btn" type="submit">Send Message ↗</button>
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
