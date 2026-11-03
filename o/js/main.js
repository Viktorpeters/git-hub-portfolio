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
// Autonomous cursor-style spotlight — wanders the topbar + hero
// area on its own, starting from the top-left. Uses a golden-ratio
// frequency mismatch between x and y so the path never obviously
// repeats. The glow now lives in its own layer (#glowLayer) sized
// to cover the topbar AND the hero, instead of being boxed inside
// the hero section alone — so it can drift behind the nav too.
// ============================================================
const glowLayer = document.getElementById("glowLayer");
const topbar = document.querySelector(".topbar");

function sizeGlowLayer() {
  if (glowLayer && topbar && hero) {
    glowLayer.style.height = topbar.offsetHeight + hero.offsetHeight + "px";
  }
}
window.addEventListener("resize", sizeGlowLayer);
window.addEventListener("load", sizeGlowLayer);
sizeGlowLayer();

if (glowLayer) {
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
    const w = glowLayer.clientWidth;
    const h = glowLayer.clientHeight;

    // Glow 1 — full range guaranteed: (1-cos)/2 always spans exactly 0..1
    const x1 = (w * (1 - Math.cos(t * fx1))) / 2;
    const y1 = (h * (1 - Math.cos(t * fy1))) / 2;
    const size1 = 250 + (500 - 250) * (0.5 + 0.5 * Math.sin(t * fr1));

    // Glow 2 — independent phase/frequency, also full range
    const x2 = (w * (1 - Math.cos(t * fx2 + phase2x))) / 2;
    const y2 = (h * (1 - Math.cos(t * fy2 + phase2y))) / 2;
    const size2 = 90 + (220 - 90) * (0.5 + 0.5 * Math.sin(t * fr2 + 1.1));

    glowLayer.style.setProperty("--spot-x", `${x1}px`);
    glowLayer.style.setProperty("--spot-y", `${y1}px`);
    glowLayer.style.setProperty("--spot-size", `${size1}px`);
    glowLayer.style.setProperty("--spot2-x", `${x2}px`);
    glowLayer.style.setProperty("--spot2-y", `${y2}px`);
    glowLayer.style.setProperty("--spot2-size", `${size2}px`);
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

// ============================================================
// GitHub contributions — real data, Jan 2026 → present, private
// repos included. Fetched from a Cloudflare Worker that holds the
// GitHub token server-side (never exposed here) and returns the
// GraphQL contributionsCollection response.
//
// ============================================================
const CONTRIB_WORKER_URL =
  "https://github-contrib-worker.alternativeschool073.workers.dev";

// ---- Helpers to build a full Jan 1 – Dec 31 calendar, independent of
// how much real data GitHub has given us so far. ----

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toDateStr(d) {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

// Flattens the GraphQL weeks/contributionDays shape into a simple
// { "2026-03-14": { count, color }, ... } lookup.
function buildDataMap(weeks) {
  const map = {};
  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      map[day.date] = { count: day.contributionCount, color: day.color };
    });
  });
  return map;
}

// Builds the full year as an array of weeks (each week = 7 day-cells),
// aligned Sunday-to-Saturday like GitHub's own graph, so the shape
// exists for the whole year regardless of what data we actually have.
// Each cell is one of:
//   { type: "pad" }                      – outside Jan1–Dec31, just for grid alignment
//   { type: "future", date }              – inside this year, hasn't happened yet
//   { type: "data", date, count, color }  – real day, filled from GitHub
function buildYearGrid(dataMap, year) {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const dec31 = new Date(Date.UTC(year, 11, 31));

  const gridStart = new Date(jan1);
  gridStart.setUTCDate(jan1.getUTCDate() - jan1.getUTCDay()); // back up to Sunday

  const gridEnd = new Date(dec31);
  gridEnd.setUTCDate(dec31.getUTCDate() + (6 - dec31.getUTCDay())); // forward to Saturday

  const todayStr = toDateStr(new Date());
  const weeks = [];
  let cur = new Date(gridStart);

  while (cur <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = toDateStr(cur);
      const inYear = cur.getUTCFullYear() === year;

      if (!inYear) {
        week.push({ type: "pad" });
      } else if (dateStr > todayStr) {
        week.push({ type: "future", date: dateStr });
      } else {
        const d = dataMap[dateStr];
        week.push({
          type: "data",
          date: dateStr,
          count: d ? d.count : 0,
          color: d ? d.color : "#ebedf0",
        });
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// Fixed cell size close to GitHub's own graph, just a touch bigger
// (~1.25x) so it reads as intentional rather than tiny — not scaled
// up to fill the screen, which is what made it huge before.
const CONTRIB_CELL = 13;
const CONTRIB_GAP = 4;
let lastRawWeeks = null;

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const LABEL_HEIGHT = 20; // room reserved above the grid for month text

function renderContribGrid(rawWeeks) {
  lastRawWeeks = rawWeeks;
  const grid = document.getElementById("contribGrid");
  if (!grid) return;

  const dataMap = buildDataMap(rawWeeks);
  const year = new Date().getUTCFullYear();
  const yearGrid = buildYearGrid(dataMap, year);

  const step = CONTRIB_CELL + CONTRIB_GAP;
  const totalWeeks = yearGrid.length;
  const svgW = totalWeeks * step;
  const svgH = 7 * step + LABEL_HEIGHT;

  // Find, for each week column, whether it contains the 1st of a
  // month — that's where GitHub places its month label, above the
  // column rather than centered over the whole month's span.
  let labels = "";
  yearGrid.forEach((week, wi) => {
    const firstOfMonth = week.find(
      (day) => day.date && day.date.slice(8, 10) === "01" && day.type !== "pad",
    );
    if (firstOfMonth) {
      const monthIdx = parseInt(firstOfMonth.date.slice(5, 7), 10) - 1;
      const x = wi * step;
      labels += `<text x="${x}" y="${LABEL_HEIGHT - 6}" font-size="11" fill="#8a7f70" font-family="inherit">${MONTH_ABBR[monthIdx]}</text>`;
    }
  });

  let rects = "";
  yearGrid.forEach((week, wi) => {
    week.forEach((day, di) => {
      const x = wi * step;
      const y = di * step + LABEL_HEIGHT;

      if (day.type === "pad") return; // outside the year, just alignment

      if (day.type === "future") {
        rects += `<rect x="${x}" y="${y}" width="${CONTRIB_CELL}" height="${CONTRIB_CELL}" rx="2.5" fill="none" stroke="#e1d5c2" stroke-width="1"><title>${day.date}: upcoming</title></rect>`;
        return;
      }

      const fill = day.count ? day.color : "#e1d5c2";
      rects += `<rect x="${x}" y="${y}" width="${CONTRIB_CELL}" height="${CONTRIB_CELL}" rx="2.5" fill="${fill}"><title>${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}</title></rect>`;
    });
  });

  grid.innerHTML = `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="GitHub contribution grid, January to December ${year}">${labels}${rects}</svg>`;
}

function renderContribTotal(thisYearTotal, allTimeTotal) {
  const el = document.getElementById("contribTotal");
  const allTimeEl = document.getElementById("contribAllTime");
  const year = new Date().getUTCFullYear();
  if (el) {
    el.innerHTML = `<span class="contrib-total-number">${thisYearTotal.toLocaleString()}</span> contributions in ${year}`;
  }
  if (allTimeEl) {
    allTimeEl.textContent = `${allTimeTotal.toLocaleString()} total contributions on GitHub`;
  }
}

function renderContribError() {
  const grid = document.getElementById("contribGrid");
  if (grid) {
    grid.innerHTML = `<p class="contrib-error">Couldn't load live contribution data right now.</p>`;
  }
}

if (document.getElementById("contribGrid")) {
  fetch(CONTRIB_WORKER_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Worker request failed");
      return res.json();
    })
    .then((json) => {
      const user = json && json.data && json.data.user;
      if (!user) throw new Error("Unexpected response shape");

      // The Worker returns one aliased field per year, like
      // y2022, y2023, y2024... — sum all of them for the all-time
      // total, and pull the current year's one out separately since
      // it's the only one carrying day-by-day data for the grid.
      const currentYear = new Date().getUTCFullYear();
      const yearKeys = Object.keys(user).filter((k) => /^y\d{4}$/.test(k));

      let allTimeTotal = 0;
      yearKeys.forEach((k) => {
        allTimeTotal += user[k].contributionCalendar.totalContributions;
      });

      const thisYearCalendar =
        user["y" + currentYear] && user["y" + currentYear].contributionCalendar;
      if (!thisYearCalendar) throw new Error("Missing current year data");

      renderContribGrid(thisYearCalendar.weeks);
      renderContribTotal(thisYearCalendar.totalContributions, allTimeTotal);
    })
    .catch((err) => {
      console.error("Contribution grid fetch failed:", err);
      renderContribError();
    });
}
