// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const hero = document.getElementById("hero");

// ============================================================
// Autonomous cursor-style spotlight — wanders the full hero area
// on its own, starting from the top-left, illuminating whatever
// text/pattern it passes over. Uses a golden-ratio frequency
// mismatch between x and y so the path never obviously repeats.
// ============================================================
if (hero) {
  let heroWidth = hero.clientWidth;
  let heroHeight = hero.clientHeight;

  window.addEventListener("resize", () => {
    heroWidth = hero.clientWidth;
    heroHeight = hero.clientHeight;
  });

  const fx = 0.00016; // base angular speed (x axis)
  const fy = fx * 1.61803399; // golden-ratio speed (y axis) — avoids repeating loops

  function animateSpotlight(t) {
    const x =
      heroWidth *
      (((1 - Math.cos(t * fx)) / 2) * 0.8 +
        ((1 - Math.cos(t * fx * 2.3)) / 2) * 0.2);
    const y =
      heroHeight *
      (((1 - Math.cos(t * fy)) / 2) * 0.8 +
        ((1 - Math.cos(t * fy * 2.3)) / 2) * 0.2);
    hero.style.setProperty("--spot-x", `${x}px`);
    hero.style.setProperty("--spot-y", `${y}px`);
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
