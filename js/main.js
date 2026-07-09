// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Cursor-reactive spotlight over the hero's grid pattern
// ============================================================
const hero = document.getElementById("hero");
if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty("--spot-x", `${x}px`);
    hero.style.setProperty("--spot-y", `${y}px`);
    hero.style.setProperty("--spot-opacity", "1");
  });
  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--spot-opacity", "0");
  });
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
