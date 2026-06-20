/* ==============================================
   main.js — All JavaScript for Rakesh Portfolio
   This file controls everything interactive:
   scrolling effects, the mobile menu, the contact
   form, the 3D cube, and the floating particles.

   This file is loaded at the bottom of index.html
   so all HTML elements exist before this code runs.
============================================== */


/* -------------------------------------------
   SECURITY UTILITIES
   These two functions protect the contact form
   from being abused or hacked.
------------------------------------------- */

/*
   sanitize() — XSS (Cross-Site Scripting) Protection
   The problem: if someone types HTML or JavaScript into the form
   (like <script>steal_your_data()</script>), a bad site might run it.
   The fix: this function converts ALL special characters to safe text.
   For example: <script> becomes &lt;script&gt; which browsers display
   as text, NOT as code. So it can never execute.

   How it works:
   1. We create a temporary invisible div element.
   2. We set the user's text as its textContent (not innerHTML).
      textContent automatically escapes all HTML special characters.
   3. We read textContent back out — now it is safe plain text.
   4. We also trim whitespace and hard-limit the length to 2000 characters.
*/
function sanitize(str) {
  const div = document.createElement('div');
  // createElement('div') creates a new, invisible div element in memory.
  // It is never added to the page — it is just used as a safe encoder.

  div.textContent = String(str);
  // String(str) converts whatever was passed in to a string (safety check).
  // Setting textContent encodes all HTML characters: < > " ' & become harmless text.

  return div.textContent.trim().slice(0, 2000);
  // .trim() removes whitespace from the start and end.
  // .slice(0, 2000) limits output to 2000 characters maximum (prevents huge data dumps).
}


/*
   isValidEmail() — Email Format Validation
   Checks that the email address looks correct before we try to send it.
   Uses a regular expression (regex) — a pattern that the email must match.

   The pattern /^[^\s@"'<>]{1,64}@[^\s@"'<>]{1,255}\.[^\s@"'<>]{2,}$/ means:
   ^                  = start of the string
   [^\s@"'<>]{1,64}   = 1 to 64 characters that are NOT whitespace, @, ", ', < or >
   @                  = must have exactly one @ symbol
   [^\s@"'<>]{1,255}  = 1 to 255 safe characters for the domain name
   \.                 = must have a dot (the . before .com / .net / .in)
   [^\s@"'<>]{2,}     = at least 2 safe characters for the extension (.com, .in, .org)
   $                  = end of the string

   .test(email) runs the pattern check and returns true or false.
*/
function isValidEmail(email) {
  return /^[^\s@"'<>]{1,64}@[^\s@"'<>]{1,255}\.[^\s@"'<>]{2,}$/.test(email);
}


/* -------------------------------------------
   NAVBAR — SCROLL SHADOW EFFECT
   When the user scrolls down, JavaScript adds
   the class "scrolled" to the navbar.
   CSS then makes the navbar more opaque.
------------------------------------------- */

const navbar = document.getElementById('navbar');
// document.getElementById('navbar') finds the <nav id="navbar"> element in the HTML.
// We store it in a variable called "navbar" so we can use it below without searching again.

window.addEventListener('scroll', () => {
// window is the browser window object.
// addEventListener('scroll', ...) means: every time the user scrolls, run the function.
// The () => {} is an arrow function — a short way to write a function.

  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // classList.toggle(class, condition) adds the class if condition is true, removes it if false.
  // window.scrollY is how many pixels the user has scrolled down from the top.
  // window.scrollY > 50 is true when the user has scrolled more than 50px down.
  // So: navbar gets class "scrolled" (darker background) after scrolling 50px.

}, { passive: true });
// { passive: true } is a performance hint: tells the browser this scroll listener
// will NEVER call event.preventDefault(). This allows the browser to scroll
// the page more smoothly without waiting for JavaScript to finish.


/* -------------------------------------------
   MOBILE MENU — HAMBURGER TOGGLE
   Opens and closes the mobile dropdown menu
   when the hamburger button is clicked.
------------------------------------------- */

const menuBtn   = document.getElementById('menu-btn');
// Finds the <button id="menu-btn"> hamburger button.

const mobileNav = document.getElementById('mobile-nav');
// Finds the <div id="mobile-nav"> mobile menu dropdown.

menuBtn.addEventListener('click', () => {
// Every time the hamburger button is clicked, run this function.

  const open = mobileNav.classList.toggle('open');
  // classList.toggle('open') adds 'open' if it is missing, removes it if it is there.
  // CSS shows the menu when it has the 'open' class (display:flex).
  // The return value is true if the class was ADDED, false if it was REMOVED.
  // We store it in "open" so we know the current state.

  menuBtn.classList.toggle('open', open);
  // Adds/removes 'open' on the button too.
  // CSS uses this to animate the hamburger bars into an X shape.

  menuBtn.setAttribute('aria-expanded', String(open));
  // aria-expanded tells screen readers whether the menu is open (true) or closed (false).
  // String(open) converts the boolean to the text "true" or "false".
});

document.querySelectorAll('.mn-link').forEach(link => {
// querySelectorAll('.mn-link') finds ALL elements with class "mn-link" (the mobile nav links).
// .forEach() loops through each one and runs the function for each link.

  link.addEventListener('click', () => {
  // When a mobile nav link is clicked (the user selected a section to go to):

    mobileNav.classList.remove('open');
    // Remove the 'open' class — this hides the mobile menu again.

    menuBtn.classList.remove('open');
    // Return the hamburger button back to its normal bars (not X) appearance.

    menuBtn.setAttribute('aria-expanded', 'false');
    // Tell screen readers the menu is now closed.
  });
});


/* -------------------------------------------
   SMOOTH SCROLL
   When any in-page link (href="#section") is clicked,
   instead of jumping, the page scrolls smoothly.
------------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
// 'a[href^="#"]' is a CSS selector that means:
//   a        = anchor (link) elements
//   [href^="#"] = whose href attribute STARTS WITH "#"
// This matches ALL in-page navigation links.

  anchor.addEventListener('click', function (e) {
  // When a nav link is clicked, run this function.
  // We use "function" here (not arrow function) because we need "this" to refer to
  // the clicked anchor element. Arrow functions do not have their own "this".

    const target = document.querySelector(this.getAttribute('href'));
    // this.getAttribute('href') gets the href value, e.g. "#contact"
    // document.querySelector("#contact") finds the HTML element with id="contact"
    // We store the element in "target"

    if (!target) return;
    // Safety check: if no element with that id exists, do nothing and exit the function.

    e.preventDefault();
    // Normally clicking a link with href="#section" would jump instantly.
    // e.preventDefault() stops that default behavior so we can scroll smoothly instead.

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      // getBoundingClientRect().top = distance from the top of the viewport to the element.
      // + window.scrollY = adds the current scroll position to get the absolute page position.
      // - 70 = subtracts 70px to account for the fixed navbar height (so content is not hidden under it).
      behavior: 'smooth'
      // 'smooth' makes the scroll animate instead of jumping.
    });
  });
});


/* -------------------------------------------
   SCROLL REVEAL ANIMATION
   Elements with class "reveal" start invisible.
   When they enter the visible area of the screen,
   the IntersectionObserver adds class "visible"
   and CSS animates them into view.
------------------------------------------- */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(entries => {
// IntersectionObserver watches elements and fires a callback when they
// enter or leave the visible area (the "viewport") of the browser.
// "entries" is an array of all the elements being watched.

  entries.forEach(entry => {
  // Loop through each watched element.

    if (entry.isIntersecting) {
    // isIntersecting is true when the element is inside the visible browser window.

      entry.target.classList.add('visible');
      // Add the "visible" class — CSS transitions the element from invisible to visible.

      revealObserver.unobserve(entry.target);
      // Stop watching this element. We only need to animate it once (when it first appears).
      // unobserve saves memory and CPU.
    }
  });
}, {
  threshold: prefersReducedMotion ? 0 : 0.12,
  rootMargin: prefersReducedMotion ? '0px' : '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  if (prefersReducedMotion) {
    el.classList.add('visible');
    return;
  }
  revealObserver.observe(el);
});
// Find every element with class "reveal" and tell the observer to watch it.


/* -------------------------------------------
   PARTICLES
   Creates small floating dots in the hero background.
   Each dot gets a random position, size, speed, and delay.
------------------------------------------- */

const particleContainer = document.getElementById('particles');
// Finds the empty div#particles in the hero section.

if (particleContainer && !prefersReducedMotion) {

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const particleCount = isMobile ? 14 : 28;

  for (let i = 0; i < particleCount; i++) {
  // A loop that runs 22 times (i starts at 0 and goes up to 21).
  // Each loop creates one particle dot.

    const p = document.createElement('div');
    // Create a new empty div element for this particle.

    p.className = 'particle' + (Math.random() > 0.6 ? ' twinkle' : '');

    p.style.cssText = [
    // cssText lets us set multiple CSS styles as one string.
    // We build an array of style strings and join them with semicolons.

      `left:${Math.random() * 100}%`,
      // Math.random() returns a random number between 0 and 1 (like 0.42).
      // Multiplying by 100 gives a number like 42.
      // So left:42% places the particle 42% from the left — a random horizontal position.

      `top:${50 + Math.random() * 50}%`,
      // 50 + random*50 gives a number between 50 and 100.
      // So particles only appear in the bottom half of the hero (below center).

      `animation-duration:${5 + Math.random() * 9}s`,
      // Random duration between 5 and 14 seconds — some particles drift fast, some slow.

      `animation-delay:${Math.random() * 7}s`,
      // Random start delay between 0 and 7 seconds — particles stagger their appearance.

      `width:${1 + Math.random() * 2}px`,
      // Random width between 1 and 3 pixels — particles have different sizes.

      `height:${1 + Math.random() * 2}px`,
      // Random height between 1 and 3 pixels.

      `opacity:${0.2 + Math.random() * 0.5}`
      // Random opacity between 0.2 and 0.7 — some are dimmer, some brighter.

    ].join(';');
    // .join(';') connects all the array items with semicolons: "left:42%;top:77%;..."

    particleContainer.appendChild(p);
    // appendChild adds the particle div as a child of the particles container.
    // This places it on the page where it will animate using the CSS "drift" keyframe.
  }
}


/* -------------------------------------------
   3D CANVAS — INTERACTIVE ROTATING SPHERE
------------------------------------------- */
function init3DCanvas(prefersReducedMotion) {
  const canvas = document.getElementById('canvas3d');
  const scene  = document.querySelector('.hero-scene');
  if (!canvas || !scene) return;

  const ctx = canvas.getContext('2d');
  let W = 380, H = 380;

  /* HiDPI support */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    W = r.width  || 380;
    H = r.height || 380;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  /* ── Sphere setup ────────────────────────── */
  const R     = 155;  // radius
  const N     = 200;  // particles
  const FOCAL = 400;  // perspective
  const CDIST = 115;  // neighbour link distance

  // Fibonacci sphere lattice
  const pts = [];
  const GA  = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y  = 1 - (i / (N - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = GA * i;
    pts.push({
      bx: Math.cos(th) * rr * R,
      by: y * R,
      bz: Math.sin(th) * rr * R,
      ph: Math.random() * Math.PI * 2
    });
  }

  // Pre-build adjacency (done once at startup)
  const adj = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i++) {
    const row = [];
    for (let j = i + 1; j < N; j++) {
      const dx = pts[i].bx - pts[j].bx;
      const dy = pts[i].by - pts[j].by;
      const dz = pts[i].bz - pts[j].bz;
      const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (d < CDIST) row.push(j);
    }
    adj[i] = row;
  }

  /* ── State ────────────────────────────────── */
  let rotX = -0.4, rotY = 0.5;
  let tgtX = rotX, tgtY = rotY;
  let velX = 0,    velY = 0;
  let drag = false, px0 = 0, py0 = 0;

  // Mouse in scene-local coordinates (-1…+1)
  let msx = 0, msy = 0, mOver = false;

  /* ── ALL pointer input via scene element ──── */
  scene.style.cursor = 'grab';

  scene.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    drag = true;
    px0  = e.clientX;
    py0  = e.clientY;
    velX = velY = 0;
    scene.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    // Track mouse relative to SCENE (not canvas) for wide hover area
    const r = scene.getBoundingClientRect();
    msx   = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    msy   = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    mOver = (e.clientX >= r.left && e.clientX <= r.right &&
             e.clientY >= r.top  && e.clientY <= r.bottom);

    if (drag) {
      const dx = e.clientX - px0;
      const dy = e.clientY - py0;
      velY =  dx * 0.010;
      velX = -dy * 0.010;
      tgtY += velY;
      tgtX += velX;
      px0 = e.clientX;
      py0 = e.clientY;
    }
  });

  window.addEventListener('mouseup', () => {
    drag = false;
    scene.style.cursor = 'grab';
  });

  // Touch support
  let t0x = 0, t0y = 0;
  scene.addEventListener('touchstart', e => {
    const t = e.touches[0];
    drag = true; px0 = t.clientX; py0 = t.clientY; velX = velY = 0;
  }, { passive: true });
  scene.addEventListener('touchmove', e => {
    if (!drag) return;
    const t  = e.touches[0];
    const dx = t.clientX - px0;
    const dy = t.clientY - py0;
    velY =  dx * 0.010; velX = -dy * 0.010;
    tgtY += velY; tgtX += velX;
    px0 = t.clientX; py0 = t.clientY;
  }, { passive: true });
  scene.addEventListener('touchend', () => { drag = false; });

  scene.addEventListener('mouseleave', () => { mOver = false; });

  /* ── Pulse ring ───────────────────────────── */
  let pulseT = 0;

  /* ── Render ───────────────────────────────── */
  function draw(ts) {
    const t = ts * 0.001;

    if (!drag) {
      // Inertia decay
      velX *= 0.88;
      velY *= 0.88;

      // Mouse tilt: sphere leans toward cursor
      if (mOver && !prefersReducedMotion) {
        tgtX = -0.40 + msy * 0.55 + Math.sin(t * 0.22) * 0.08;
        tgtY += velY + 0.0025 + msx * 0.012;
      } else {
        tgtX = -0.40 + Math.sin(t * 0.22) * 0.08;
        tgtY += velY + 0.0025;
      }
    }

    rotX += (tgtX - rotX) * 0.08;
    rotY += (tgtY - rotY) * 0.08;

    pulseT = (pulseT + 0.005) % 1;

    const cX = Math.cos(rotX), sX = Math.sin(rotX);
    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cx = W / 2, cy = H / 2;

    /* Project */
    const proj = new Array(N);
    for (let i = 0; i < N; i++) {
      const p  = pts[i];
      const x1 = p.bx * cY - p.bz * sY;
      const z1 = p.bx * sY + p.bz * cY;
      const y2 = p.by * cX - z1  * sX;
      const z2 = p.by * sX + z1  * cX;
      const sc = FOCAL / (FOCAL + z2 + R);
      const depth = Math.max(0, Math.min(1, (z2 + R) / (2 * R)));
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + p.ph);
      proj[i] = { px: x1 * sc + cx, py: y2 * sc + cy, z: z2, depth, pulse };
    }

    /* Depth sort */
    const ord = Array.from({ length: N }, (_, i) => i)
      .sort((a, b) => proj[a].z - proj[b].z);

    /* Clear */
    ctx.clearRect(0, 0, W, H);

    /* Ambient glow */
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.7);
    g.addColorStop(0,   'rgba(193,18,31,0.25)');
    g.addColorStop(0.5, 'rgba(193,18,31,0.08)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.7, 0, Math.PI * 2);
    ctx.fill();

    /* Pulse ring */
    if (!prefersReducedMotion) {
      const pr = pulseT * R * 1.8;
      const pa = (1 - pulseT) * 0.8;
      ctx.save();
      ctx.shadowColor = 'rgba(193,18,31,1)';
      ctx.shadowBlur  = 18;
      ctx.strokeStyle = `rgba(193,18,31,${pa.toFixed(3)})`;
      ctx.lineWidth   = 2.5 * (1 - pulseT) + 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    /* Edges */
    for (let ii = 0; ii < N; ii++) {
      const i  = ord[ii];
      const pi = proj[i];
      for (const j of adj[i]) {
        const pj = proj[j];
        const avgD = (pi.depth + pj.depth) * 0.5;
        const dx = pts[i].bx - pts[j].bx;
        const dy = pts[i].by - pts[j].by;
        const dz = pts[i].bz - pts[j].bz;
        const d3 = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const a  = (1 - d3 / CDIST) * 0.7 * (0.3 + avgD * 0.7);
        ctx.strokeStyle = `rgba(193,18,31,${Math.min(0.9, a).toFixed(3)})`;
        ctx.lineWidth   = 0.5 + avgD * 1.5;
        ctx.beginPath();
        ctx.moveTo(pi.px, pi.py);
        ctx.lineTo(pj.px, pj.py);
        ctx.stroke();
      }
    }

    /* Find nearest node to cursor */
    let litIdx = -1;
    if (mOver && !prefersReducedMotion) {
      const mcx = cx + msx * (W / 2);
      const mcy = cy + msy * (H / 2);
      let best = 50;
      for (let i = 0; i < N; i++) {
        const dx = proj[i].px - mcx;
        const dy = proj[i].py - mcy;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < best) { best = d; litIdx = i; }
      }
    }

    /* Particles */
    for (let ii = 0; ii < N; ii++) {
      const i   = ord[ii];
      const p   = proj[i];
      const pt  = pts[i];
      const lit = (i === litIdx);

      // Colour: dark-red → crimson → warm gold
      let r, gg, b;
      if (p.depth < 0.5) {
        const f = p.depth * 2;
        r  = Math.round(80  + f * 113);
        gg = Math.round(8   + f * 10);
        b  = Math.round(8   + f * 23);
      } else {
        const f = (p.depth - 0.5) * 2;
        r  = Math.round(193 + f * 62);
        gg = Math.round(18  + f * 192);
        b  = Math.round(31  + f * 89);
      }

      const alpha = 0.6 + p.depth * 0.4;
      const sz    = (1.8 + p.depth * 3.2) * (1 + pt.pulse * 0.3);
      const finalSz = lit ? sz * 3.5 : sz;

      // Glow halo
      if (!prefersReducedMotion) {
        const gr2 = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, finalSz * 5);
        gr2.addColorStop(0, `rgba(${r},${gg},${b},${(alpha * 0.6).toFixed(3)})`);
        gr2.addColorStop(1, `rgba(${r},${gg},${b},0)`);
        ctx.fillStyle = gr2;
        ctx.beginPath();
        ctx.arc(p.px, p.py, finalSz * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core dot
      ctx.fillStyle = `rgba(${r},${gg},${b},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.px, p.py, Math.max(0.8, finalSz), 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      if (lit) {
        ctx.save();
        ctx.shadowColor = `rgba(${r},${gg},${b},1)`;
        ctx.shadowBlur  = 28;
        ctx.fillStyle   = 'rgba(255,245,220,1)';
        ctx.beginPath();
        ctx.arc(p.px, p.py, finalSz, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* 3D Card Tilt Effect */
function initCardTilt() {
  const cards = document.querySelectorAll(".project-card, .service-card, .skill-group, .cert-card");
  
  cards.forEach(card => {
    card.style.transformStyle = "preserve-3d";
    
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = ((centerY - y) / centerY) * 10;
      const tiltY = ((x - centerX) / centerX) * 10;
      
      card.style.transition = "transform 0.08s ease-out, box-shadow 0.08s ease-out";
      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      
      card.style.boxShadow = `0 15px 35px -5px rgba(193, 18, 31, 0.28)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "";
    });

    if (card.classList.contains("project-card")) {
      card.style.cursor = "pointer";
      card.addEventListener("click", e => {
        if (!e.target.closest("a") && !e.target.closest("button")) {
          const link = card.querySelector("a");
          if (link) {
            window.open(link.href, "_blank", "noopener,noreferrer");
          }
        }
      });
    }
  });
}

/* -------------------------------------------
   3D SITE BACKGROUND — FULL-SCREEN PLEXUS
   This animates a beautiful, subtle 3D plexus background
   across the entire website.
   It reacts to mouse coordinates and scroll parallax.
------------------------------------------- */
function initSiteBg3D(prefersReducedMotion) {
  const canvas = document.getElementById("bg-canvas3d");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  if (prefersReducedMotion) return;

  // Configuration
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const particleCount = isMobile ? 35 : 75;
  const lineDistance = 140;
  const focalLength = 350;
  const particles = [];

  // Initialize particles in a large 3D space volume
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.15
    });
  }

  // Pointer & Scroll Tracking
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener("pointermove", (e) => {
    targetMouseX = e.clientX - width / 2;
    targetMouseY = e.clientY - height / 2;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth physics interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.05;

    const centerX = width / 2;
    const centerY = height / 2;

    // Update positions and project
    const projected = [];
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];

      // Drift in 3D
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Boundary wrapping in 3D box
      if (p.x < -800) p.x = 800;
      if (p.x > 800) p.x = -800;
      if (p.y < -800) p.y = 800;
      if (p.y > 800) p.y = -800;
      if (p.z < 0) p.z = 1000;
      if (p.z > 1000) p.z = 0;

      // Apply 3D Scroll Parallax
      const scrollFactor = (1000 - p.z) / 1000;
      const scrollOffset = scrollY * scrollFactor * 0.35;
      const renderedY = p.y - scrollOffset;

      // Apply 3D Mouse Parallax
      const mouseFactor = (1000 - p.z) / 1000;
      const renderedX = p.x - mouseX * mouseFactor * 0.18;
      const finalY = renderedY - mouseY * mouseFactor * 0.18;

      // Project onto 2D screen
      const scale = focalLength / (focalLength + p.z);
      const projX = renderedX * scale + centerX;
      const projY = finalY * scale + centerY;

      projected.push({
        x: projX,
        y: projY,
        z: p.z,
        scale: scale,
        orig: p
      });
    }

    // Draw Plexus lines in 3D space
    for (let i = 0; i < particleCount; i++) {
      const p1 = projected[i];
      
      // Draw particle dot
      if (p1.x > -50 && p1.x < width + 50 && p1.y > -50 && p1.y < height + 50) {
        const size = Math.max(0.4, 2.2 * p1.scale);
        const alpha = (1 - p1.z / 1000) * 0.28;
        
        ctx.fillStyle = `rgba(193, 18, 31, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = projected[j];
          
          const dx = p1.orig.x - p2.orig.x;
          const dy = p1.orig.y - p2.orig.y;
          const dz = p1.orig.z - p2.orig.z;
          const dist3D = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist3D < lineDistance) {
            const opacity = (1 - dist3D / lineDistance) * 0.11 * Math.min(1 - p1.z / 1000, 1 - p2.z / 1000);
            ctx.strokeStyle = `rgba(193, 18, 31, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// Run canvas and tilt animations
init3DCanvas(prefersReducedMotion);
initCardTilt();
initSiteBg3D(prefersReducedMotion);


/* -------------------------------------------
   CONTACT FORM — SECURE SUBMISSION
   This handles the full form submission flow:
   1. Bot check (honeypot)
   2. Input sanitization (XSS)
   3. Email validation
   4. Loading state on the button
   5. Opening the email client with the data
   6. Success message

   Security measures applied:
     Honeypot field check    = blocks automated bots
     sanitize()              = strips all HTML and script tags
     isValidEmail()          = rejects malformed email addresses
     maxlength (HTML)        = prevents oversized input
     encodeURIComponent()    = safely encodes data inside the mailto URL
     submitBtn.disabled      = prevents double-clicking Submit
------------------------------------------- */

/* Injects a CSS keyframe animation for the shake effect into the page.
   We create it in JavaScript so it works without a separate CSS file.
   @keyframes shake defines how the shake movement works frame by frame. */
const shakeStyle = document.createElement('style');
// Creates a new <style> element in memory.

shakeStyle.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
// This CSS string defines the shake animation:
//   0% and 100%: button is at normal position (translateX(0)).
//   20%: button shifts 6px to the left.
//   40%: button shifts 6px to the right.
//   60%: button shifts 4px to the left.
//   80%: button shifts 4px to the right.
// The result is a fast left-right vibration (like an error shake on iPhone).

document.head.appendChild(shakeStyle);
// Adds the <style> element into <head> so the browser reads the animation.

/* Get references to the form elements we need to control. */
const form       = document.getElementById('contact-form');
// The <form> element.

const submitBtn  = document.getElementById('submit-btn');
// The Submit button — we will disable it during sending.

const btnText    = document.getElementById('btn-text');
// The <span> inside the button — we change its text to "Sending..." while processing.

const successMsg = document.getElementById('form-success');
// The hidden success message div — we make it visible after submission.


form.addEventListener('submit', e => {
// Listen for the form's "submit" event.
// This fires when the user clicks the Submit button (or presses Enter in a field).

  e.preventDefault();
  // Stop the browser from reloading the page (the default form submit behavior).
  // We handle the submission ourselves using JavaScript.


  /* STEP 1: Honeypot Check — detect bots */
  const honeypot = form.querySelector('input[name="_hp"]');
  // Finds the hidden honeypot input field inside the form.

  if (honeypot && honeypot.value.length > 0) {
  // If the honeypot field has ANY text in it, a bot filled it in.
  // Real humans never see or interact with this field (it is hidden).

    form.reset();
    // Clear the form.

    return;
    // Exit the function immediately. Do not send. Do not show an error.
    // Silently fail — we do not want to tell bots why they were blocked.
  }


  /* STEP 2: Sanitize all input values (XSS prevention) */
  const name  = sanitize(form.name.value);
  // form.name.value reads the current text in the "name" input field.
  // sanitize() strips any HTML or script tags from it.

  const email = sanitize(form.email.value);
  // Same for the email field.

  const type  = sanitize(form.project_type.value  || 'Not specified');
  // form.project_type.value is the selected dropdown option.
  // || 'Not specified' means: if nothing was selected, use "Not specified" instead.

  const msg   = sanitize(form.message.value);
  // The message textarea content, sanitized.


  /* STEP 3: Check that required fields are not empty */
  if (!name || !email || !msg) {
  // !name is true if name is an empty string ("") or zero-length.
  // If any of the three required fields are empty:

    submitBtn.style.animation = 'shake 0.4s ease';
    // Apply the shake animation to the button to signal an error.
    // 'shake 0.4s ease' = run the "shake" keyframe animation over 0.4 seconds with ease timing.

    setTimeout(() => { submitBtn.style.animation = ''; }, 450);
    // After 450ms (slightly longer than the animation), remove the animation style.
    // This resets the button so it can shake again if needed later.

    return;
    // Exit — do not submit.
  }


  /* STEP 4: Validate email format */
  if (!isValidEmail(email)) {
  // isValidEmail() returns false if the email does not match the expected pattern.

    submitBtn.style.animation = 'shake 0.4s ease';
    // Shake the button to signal the email is invalid.

    setTimeout(() => { submitBtn.style.animation = ''; }, 450);
    // Reset the animation after it finishes.

    form.querySelector('input[type="email"]').focus();
    // Move the keyboard cursor into the email field so the user knows what to fix.

    return;
    // Exit — do not submit.
  }


  /* STEP 5: Show loading state */
  btnText.textContent   = 'Sending...';
  // Change the button label from "Send Message" to "Sending..." so the user knows it is working.

  submitBtn.disabled    = true;
  // Disable the button so the user cannot click it again while it is processing.
  // This prevents accidentally sending the email twice.

  submitBtn.style.opacity = '0.7';
  // Make the button look dimmed (70% opacity) to visually show it is disabled.


  /* STEP 6: Build the mailto link and open the email client */
  const subject = encodeURIComponent('New Project Inquiry from ' + name);
  // encodeURIComponent() makes the text safe to use inside a URL.
  // For example, spaces become %20, special characters get encoded.
  // This prevents the subject line from breaking the mailto URL.

  const body = encodeURIComponent(
    'Name: '         + name  + '\n' +
    // \n is a newline character — creates a line break in the email body.
    'Email: '        + email + '\n' +
    'Project Type: ' + type  + '\n\n' +
    // \n\n = two newlines = a blank line (paragraph break).
    'Message:\n'     + msg
  );
  // The complete email body is one long string with labels and values,
  // then encoded so it is safe inside the mailto URL.

  setTimeout(() => {
  // setTimeout runs the code inside after a delay.
  // 1000 = 1000 milliseconds = 1 second.
  // The 1-second delay lets the "Sending..." state be visible before the email app opens.

    window.location.href = 'mailto:rakesh837m@gmail.com?subject=' + subject + '&body=' + body;
    // window.location.href = changes the browser's current URL.
    // mailto: is a special URL scheme that opens the user's default email app.
    // ?subject= and &body= pass the pre-filled content into the email draft.

    form.reset();
    // Clears all form fields back to their empty/default state.

    submitBtn.style.opacity = '1';
    // Restore the button to full opacity.

    submitBtn.disabled = false;
    // Re-enable the button so the user could submit again if needed.

    btnText.textContent = 'Send Message';
    // Restore the original button text.

    successMsg.classList.add('show');
    // Add the "show" class to the success message — CSS changes it from display:none to display:flex.
    // The user sees: a green checkmark + "Message sent! I'll reply within 24 hours."

    setTimeout(() => successMsg.classList.remove('show'), 5000);
    // After 5000ms (5 seconds), remove the "show" class — hides the success message automatically.
    // The user does not need to manually dismiss it.

  }, 1000);
  // End of the 1-second delay.

});
// End of the form submit event listener.
