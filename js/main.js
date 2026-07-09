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
  const fx = 0.00048; // base angular speed (x axis) — faster than before
  const fy = fx * 1.61803399; // golden-ratio speed (y axis) — avoids repeating loops
  const fr = fx * 0.7; // independent speed for the glow's size pulse

  function animateSpotlight(t) {
    const w = hero.clientWidth;
    const h = hero.clientHeight;

    const x =
      w *
      (((1 - Math.cos(t * fx)) / 2) * 0.8 +
        ((1 - Math.cos(t * fx * 2.3)) / 2) * 0.2);
    const y =
      h *
      (((1 - Math.cos(t * fy)) / 2) * 0.8 +
        ((1 - Math.cos(t * fy * 2.3)) / 2) * 0.2);
    // Pulse the glow's size between small (180px) and large (460px)
    const size = 180 + (460 - 180) * (0.5 + 0.5 * Math.sin(t * fr));

    hero.style.setProperty("--spot-x", `${x}px`);
    hero.style.setProperty("--spot-y", `${y}px`);
    hero.style.setProperty("--spot-size", `${size}px`);
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
