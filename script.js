const toast = document.querySelector(".toast");
const canvas = document.querySelector(".network-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(95, Math.max(42, Math.floor(width / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: Math.random() * 1.8 + 0.8,
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 128) {
        const alpha = (1 - dist / 128) * 0.24;
        ctx.strokeStyle = `rgba(49, 199, 183, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    ctx.fillStyle = "rgba(126, 171, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawNetwork);
}

resizeCanvas();
drawNetwork();
window.addEventListener("resize", resizeCanvas);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function actionMarkup(action) {
  const target = action.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="button ${escapeHtml(action.style || "secondary")}" href="${escapeHtml(action.href)}"${target}>${escapeHtml(action.label)}</a>`;
}

function projectMarkup(project) {
  const actions = [...(project.actions || []).map(actionMarkup)];
  if (project.resumeBullet) {
    actions.push(`<button class="button secondary" type="button" data-copy="${escapeHtml(project.resumeBullet)}">Copy Resume Bullet</button>`);
  }

  return `
    <section id="${escapeHtml(project.id)}" class="section ${escapeHtml(project.sectionClass || "")}">
      <div class="section-heading">
        <p class="eyebrow">${escapeHtml(project.eyebrow || "Featured Project")}</p>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
      </div>

      <div class="project-layout">
        <article class="project-panel">
          <h3>What it does</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="project-actions">${actions.join("")}</div>
        </article>

        <div class="workflow" aria-label="${escapeHtml(project.title)} workflow">
          ${(project.workflow || []).map((step) => `
            <div class="workflow-step">
              <span>${escapeHtml(step.number)}</span>
              <strong>${escapeHtml(step.title)}</strong>
              <p>${escapeHtml(step.text)}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="feature-grid">
        ${(project.features || []).map((feature) => `
          <article>
            <h3>${escapeHtml(feature.title)}</h3>
            <p>${escapeHtml(feature.text)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
        toast.textContent = "Copied resume bullet";
      } catch {
        toast.textContent = text;
      }
      toast.classList.add("visible");
      window.setTimeout(() => toast.classList.remove("visible"), 2200);
    });
  });
}

async function renderProjects() {
  const root = document.querySelector("#projects-root");
  if (!root) return;
  try {
    const response = await fetch(root.dataset.projectsSrc || "projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load projects");
    const projects = await response.json();
    root.innerHTML = projects.map(projectMarkup).join("");
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  } catch {
    root.innerHTML = `
      <section class="section zoro-section">
        <div class="section-heading">
          <p class="eyebrow">Featured Projects</p>
          <h2>Projects unavailable</h2>
          <p>Project data could not be loaded. Please refresh the page.</p>
        </div>
      </section>
    `;
  }
}

renderProjects().then(bindCopyButtons);
