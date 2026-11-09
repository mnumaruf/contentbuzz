/* Shared layout: header, footer, service cards, proof bar. Everything reads from config.js */
(function () {
  const C = window.CB;
  const page = document.body.dataset.page || "";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Link for a service: live -> its page, soon -> generic coming-soon page
  const serviceUrl = (s) => (s.status === "live" && s.url ? s.url : "service.html?id=" + s.id);
  window.CB.serviceUrl = serviceUrl;

  /* ---------- Header ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    const links = C.services
      .map((s) => {
        const active = page === s.id ? " active" : "";
        const soon = s.status === "soon" ? '<span class="badge-soon">শীঘ্রই</span>' : "";
        return `<li><a class="${active}" href="${serviceUrl(s)}">${esc(s.name)}${soon}</a></li>`;
      })
      .join("");
    header.className = "site-header";
    header.innerHTML = `
      <div class="container nav">
        <a class="logo" href="index.html">Content<span>buzz</span></a>
        <ul class="nav-links" id="nav-links">
          ${links}
          <li><a href="roadmap.html" class="${page === "roadmap" ? "active" : ""}">Free Roadmap</a></li>
          <li class="nav-cta-mobile"><a class="btn btn-primary" href="apply.html">I'm Ready to Scale</a></li>
        </ul>
        <a class="btn btn-primary nav-cta-desktop" href="apply.html">I'm Ready to Scale</a>
        <button class="menu-toggle" aria-label="মেনু খুলুন" id="menu-toggle"><span></span><span></span><span></span></button>
      </div>`;
    const t = document.getElementById("menu-toggle");
    const nl = document.getElementById("nav-links");
    t.addEventListener("click", () => nl.classList.toggle("open"));
    // hide duplicate CTA inside menu on desktop
    const style = document.createElement("style");
    style.textContent = "@media(min-width:1141px){.nav-cta-mobile{display:none}}";
    document.head.appendChild(style);
  }

  /* ---------- Footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    const b = C.brand;
    const svc = C.services.map((s) => `<li><a href="${serviceUrl(s)}">${esc(s.bn)}</a></li>`).join("");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="logo">Content<span class="gold">buzz</span></div>
            <p style="margin-top:16px;max-width:340px">উদ্যোক্তাদের জন্য হাতে-কলমে স্কেলিং — শেখা থেকে এক্সিকিউশন পর্যন্ত।</p>
          </div>
          <div><h4>সার্ভিস</h4><ul>${svc}<li><a href="roadmap.html">ফ্রি গ্রোথ রোডম্যাপ</a></li></ul></div>
          <div><h4>যোগাযোগ</h4><ul>
            <li>${esc(b.email)}</li><li>${esc(b.phone)}</li><li>${esc(b.address)}</li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(b.name)}. সর্বস্বত্ব সংরক্ষিত।</span>
          <span>Execution over information.</span>
        </div>
      </div>`;
  }

  /* ---------- Proof bar ---------- */
  document.querySelectorAll("[data-proof]").forEach((el) => {
    el.innerHTML = C.proof
      .map((p) => `<div><div class="proof-value">${esc(p.value)}</div><div class="proof-label">${esc(p.label)}</div></div>`)
      .join("");
  });

  /* ---------- Service cards ---------- */
  document.querySelectorAll("[data-services]").forEach((el) => {
    el.innerHTML = C.services
      .map((s, i) => {
        const live = s.status === "live";
        return `<a class="card ${live ? "featured" : "is-soon"}" href="${serviceUrl(s)}">
          <span class="tag ${live ? "tag-live" : "tag-soon"}">${live ? "এখন ভর্তি চলছে" : "শীঘ্রই আসছে"}</span>
          <div class="num">0${i + 1}</div>
          <h3 style="margin-top:6px">${esc(s.bn)}</h3>
          <p>${esc(s.summary)}</p>
          <span class="more">${live ? "বিস্তারিত দেখুন →" : "ওয়েটলিস্টে যোগ দিন →"}</span>
        </a>`;
      })
      .join("");
  });

  /* ---------- Founder ---------- */
  document.querySelectorAll("[data-founder]").forEach((el) => {
    const b = C.brand;
    const photo = b.founderPhoto ? `<img src="${esc(b.founderPhoto)}" alt="${esc(b.founder)}">` : "ছবি যোগ করুন";
    el.innerHTML = `
      <div class="founder-photo">${photo}</div>
      <div>
        <span class="eyebrow">ফাউন্ডার</span>
        <h2>${esc(b.founder)}</h2>
        <div class="founder-role">${esc(b.founderRole)}</div>
        <p class="lead">${esc(b.founderBio)}</p>
        <div class="btn-row"><a class="btn btn-ghost" href="apply.html">কথা বলতে চাই</a></div>
      </div>`;
  });

  /* ---------- Form submit helper (used by apply + roadmap + waitlist) ---------- */
  window.CB.submitLead = async function (data) {
    if (C.formEndpoint) {
      const res = await fetch(C.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("submit failed");
      return "sent";
    }
    if (C.brand.whatsapp) {
      const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.open(`https://wa.me/${C.brand.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
      return "whatsapp";
    }
    console.warn("[Contentbuzz] formEndpoint বা whatsapp কোনোটাই config.js-এ সেট করা নেই। ডেটা কোথাও যায়নি:", data);
    return "demo";
  };
})();
