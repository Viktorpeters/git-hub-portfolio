// ============================================================
// Clock (Lagos time display in hero status bar)
// ============================================================
function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  };
  el.textContent = now.toLocaleTimeString("en-GB", options);
}
updateClock();
setInterval(updateClock, 1000);

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// Signal trace: pulse position follows scroll progress
// ============================================================
const tracePulse = document.querySelector(".trace__pulse");
function updateTrace() {
  if (!tracePulse) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  const trackHeight = window.innerHeight;
  tracePulse.style.top = `${progress * trackHeight}px`;
}
window.addEventListener("scroll", updateTrace, { passive: true });
updateTrace();

// ============================================================
// Node nav: scroll spy + click to scroll
// ============================================================
const navItems = document.querySelectorAll(".nodenav__item");
const sections = Array.from(navItems).map((item) =>
  document.getElementById(item.dataset.target),
);

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = document.getElementById(item.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) => item.classList.remove("is-active"));
        const active = document.querySelector(
          `.nodenav__item[data-target="${entry.target.id}"]`,
        );
        if (active) active.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
);

sections.forEach((section) => {
  if (section) observer.observe(section);
});

// ============================================================
// Scroll reveal for cards, projects, timeline items
// ============================================================
const revealTargets = document.querySelectorAll(
  ".card, .project, .timeline__item, .stat",
);
revealTargets.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  el.style.transition =
    "opacity 0.6s cubic-bezier(.22,.61,.36,1), transform 0.6s cubic-bezier(.22,.61,.36,1)";
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealTargets.forEach((el) => revealObserver.observe(el));
