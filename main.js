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
   3D CUBE — SMOOTH POINTER / TOUCH TRACKING
   Desktop: follows cursor on hover.
   Mobile: drag anywhere on the scene (pointer capture).
   Rotation is smoothed with requestAnimationFrame lerp.
------------------------------------------- */

const heroVisual = document.querySelector('.hero-scene');
const cube = document.querySelector('.cube');

if (heroVisual && cube) {
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const DEFAULT_X = -22;
  const DEFAULT_Y = 38;

  const cubeState = {
    currentX: DEFAULT_X,
    currentY: DEFAULT_Y,
    targetX: DEFAULT_X,
    targetY: DEFAULT_Y,
    dragging: false,
    pointerDown: false,
    idle: !prefersReducedMotion,
    rafId: null
  };

  function setTargetsFromClient(clientX, clientY) {
    const r = heroVisual.getBoundingClientRect();
    const x = (clientX - r.left) / r.width - 0.5;
    const y = (clientY - r.top) / r.height - 0.5;
    cubeState.targetY = DEFAULT_Y + x * 80;
    cubeState.targetX = DEFAULT_X - y * 60;
  }

  function applyCubeRotation() {
    cube.style.setProperty('--cube-x', cubeState.currentX.toFixed(2) + 'deg');
    cube.style.setProperty('--cube-y', cubeState.currentY.toFixed(2) + 'deg');
  }

  function lerp(current, target, amount) {
    return current + (target - current) * amount;
  }

  function tick(now) {
    if (
      cubeState.idle &&
      !cubeState.dragging &&
      !heroVisual.classList.contains('is-interacting') &&
      !prefersReducedMotion
    ) {
      const t = now / 1000;
      cubeState.targetY = DEFAULT_Y + Math.sin(t * 0.5) * 18;
      cubeState.targetX = DEFAULT_X + Math.cos(t * 0.4) * 10;
    }

    const ease = cubeState.dragging
      ? (isCoarsePointer ? 0.35 : 0.28)
      : cubeState.pointerDown ? 0.22 : 0.14;
    cubeState.currentX = lerp(cubeState.currentX, cubeState.targetX, ease);
    cubeState.currentY = lerp(cubeState.currentY, cubeState.targetY, ease);
    applyCubeRotation();

    const dx = Math.abs(cubeState.targetX - cubeState.currentX);
    const dy = Math.abs(cubeState.targetY - cubeState.currentY);
    const needsFrame = cubeState.dragging || cubeState.idle || dx > 0.05 || dy > 0.05;

    if (needsFrame) {
      cubeState.rafId = requestAnimationFrame(tick);
    } else {
      cubeState.rafId = null;
    }
  }

  function startCubeLoop() {
    if (!cubeState.rafId) {
      cubeState.rafId = requestAnimationFrame(tick);
    }
  }

  function stopCubeLoop() {
    if (cubeState.rafId) {
      cancelAnimationFrame(cubeState.rafId);
      cubeState.rafId = null;
    }
  }

  function beginInteraction(e) {
    cubeState.pointerDown = true;
    cubeState.dragging = true;
    cubeState.idle = false;
    heroVisual.classList.add('is-interacting');
    heroVisual.setPointerCapture(e.pointerId);
    setTargetsFromClient(e.clientX, e.clientY);
    startCubeLoop();
  }

  function endInteraction(e) {
    if (!cubeState.pointerDown) return;

    cubeState.pointerDown = false;
    cubeState.dragging = false;
    heroVisual.classList.remove('is-interacting');

    try {
      heroVisual.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* pointer may already be released */
    }

    if (isCoarsePointer) {
      cubeState.targetX = DEFAULT_X;
      cubeState.targetY = DEFAULT_Y;
      cubeState.idle = !prefersReducedMotion;
      startCubeLoop();
      return;
    }

    cubeState.targetX = DEFAULT_X;
    cubeState.targetY = DEFAULT_Y;
    startCubeLoop();
  }

  heroVisual.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    beginInteraction(e);
  }, { passive: false });

  heroVisual.addEventListener('pointermove', e => {
    if (cubeState.dragging) {
      setTargetsFromClient(e.clientX, e.clientY);
      startCubeLoop();
      return;
    }

    if (!isCoarsePointer && e.pointerType === 'mouse') {
      heroVisual.classList.add('is-interacting');
      setTargetsFromClient(e.clientX, e.clientY);
      startCubeLoop();
    }
  });

  heroVisual.addEventListener('pointerup', endInteraction);
  heroVisual.addEventListener('pointercancel', endInteraction);

  heroVisual.addEventListener('pointerleave', () => {
    if (cubeState.dragging) return;

    heroVisual.classList.remove('is-interacting');

    if (!isCoarsePointer) {
      cubeState.targetX = DEFAULT_X;
      cubeState.targetY = DEFAULT_Y;
      startCubeLoop();
    }
  });

  if (cubeState.idle) {
    startCubeLoop();
  }
}


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
