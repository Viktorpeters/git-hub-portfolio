// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Mobile drawer nav
// ============================================================
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");

function openDrawer() {
  drawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-open");
  menuBtn.classList.add("is-open");
  menuBtn.setAttribute("aria-expanded", "true");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  drawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  menuBtn.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  drawer.querySelectorAll(".drawer__link").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

const hero = document.getElementById("hero");

// ============================================================
// Autonomous cursor-style spotlight — wanders the full hero area
// on its own, starting from the top-left, illuminating whatever
// text/pattern it passes over. Uses a golden-ratio frequency
// mismatch between x and y so the path never obviously repeats.
// ============================================================
// ============================================================
// Autonomous cursor-style spotlight — wanders the full hero area
// on its own, starting from the top-left, illuminating whatever
// text/pattern it passes over. Uses a golden-ratio frequency
// mismatch between x and y so the path never obviously repeats.
// Hero size is read fresh every frame (not cached) so it always
// covers the true, current dimensions of the section — including
// after images/fonts finish loading and the layout settles.
// ============================================================
if (hero) {
  // Each axis uses a SINGLE cosine term — this guarantees the glow
  // actually reaches every corner (0% to 100% of width/height) every
  // cycle. Golden-ratio / sqrt(2) mismatches between x and y keep the
  // path from ever tracing the same loop twice.
  const fx1 = 0.00048;
  const fy1 = fx1 * 1.61803399;
  const fr1 = fx1 * 0.7;

  const fx2 = 0.00081;
  const fy2 = fx2 * 1.41421356;
  const fr2 = fx2 * 0.55;
  const phase2x = 2.4;
  const phase2y = 5.1;

  function animateSpotlight(t) {
    const w = hero.clientWidth;
    const h = hero.clientHeight;

    // Glow 1 — full range guaranteed: (1-cos)/2 always spans exactly 0..1
    const x1 = (w * (1 - Math.cos(t * fx1))) / 2;
    const y1 = (h * (1 - Math.cos(t * fy1))) / 2;
    const size1 = 250 + (500 - 250) * (0.5 + 0.5 * Math.sin(t * fr1));

    // Glow 2 — independent phase/frequency, also full range
    const x2 = (w * (1 - Math.cos(t * fx2 + phase2x))) / 2;
    const y2 = (h * (1 - Math.cos(t * fy2 + phase2y))) / 2;
    const size2 = 90 + (220 - 90) * (0.5 + 0.5 * Math.sin(t * fr2 + 1.1));

    hero.style.setProperty("--spot-x", `${x1}px`);
    hero.style.setProperty("--spot-y", `${y1}px`);
    hero.style.setProperty("--spot-size", `${size1}px`);
    hero.style.setProperty("--spot2-x", `${x2}px`);
    hero.style.setProperty("--spot2-y", `${y2}px`);
    hero.style.setProperty("--spot2-size", `${size2}px`);
    requestAnimationFrame(animateSpotlight);
  }
  requestAnimationFrame(animateSpotlight);
}

// ============================================================
// Magnetic buttons — gently pull toward the cursor when nearby
// ============================================================
document.querySelectorAll(".magnetic").forEach((btn) => {
  const strength = 0.35;
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

// ============================================================
// Staggered entrance reveal for hero text
// ============================================================
const revealEls = document.querySelectorAll(".reveal-word");
revealEls.forEach((el, i) => {
  el.style.animationDelay = `${i * 0.12 + 0.1}s`;
  el.classList.add("reveal-word--play");
});
