/* =========================================================
   CHAUHAN MIS — DIGITAL MARKETING LANDING PAGE SCRIPTS
========================================================= */

// Same Google Apps Script Web App URL as the original site —
// keeps all leads (all landing pages) in one Google Sheet.
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbycI_jfWFjo3vPZ0o32DUzrZHV6sLj49thJYHDND7nLixyV3ofbt-W2-9GIaGFMd4pC/exec";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Year ---------- */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Header scroll + progress bar ---------- */
  const header = document.getElementById("dmHeader");
  const progress = document.getElementById("scrollProgress");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    updateWorkflow();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("dmMenuBtn");
  const nav = document.getElementById("dmNav");
  menuBtn.addEventListener("click", function () {
    nav.classList.toggle("open");
    menuBtn.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      menuBtn.classList.remove("open");
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Typed word in hero ---------- */
  const typedEl = document.getElementById("typedWord");
  const words = ["Automation", "Google Ads", "Meta Ads", "SEO", "CRM"];
  if (typedEl && !reduceMotion) {
    let wi = 0, ci = words[0].length, deleting = true;
    setTimeout(function tick() {
      const w = words[wi];
      if (deleting) {
        ci--;
        typedEl.textContent = w.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, 55);
      } else {
        const nw = words[wi];
        ci++;
        typedEl.textContent = nw.slice(0, ci);
        if (ci === nw.length) { deleting = true; setTimeout(tick, 2000); }
        else setTimeout(tick, 95);
      }
    }, 2600);
  }

  /* ---------- Hero particles (connected network) ---------- */
  const canvas = document.getElementById("heroParticles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, pts = [], mouse = { x: -999, y: -999 };
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.min(70, Math.floor((W * H) / 18000));
      pts = [];
      for (let i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.8 + 0.6 });
      }
    }
    size();
    window.addEventListener("resize", size);
    canvas.parentElement.parentElement.addEventListener("mousemove", function (e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    let visible = true;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);
    (function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,200,255,.7)"; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 14000) {
            ctx.strokeStyle = "rgba(10,174,255," + (0.16 * (1 - d / 14000)) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < 26000) {
          ctx.strokeStyle = "rgba(255,122,69," + (0.35 * (1 - md / 26000)) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    })();
  }

  /* ---------- 3D tilt cards (desktop only) ---------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        if (window.innerWidth <= 1024) return;
        const r = card.getBoundingClientRect();
        const rx = ((r.height / 2 - (e.clientY - r.top)) / r.height) * 8;
        const ry = (((e.clientX - r.left) - r.width / 2) / r.width) * 8;
        const lift = card.classList.contains("featured") ? -20 : -8;
        card.style.transition = "transform .08s linear, border-color .35s, box-shadow .35s";
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(" + lift + "px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "";
        card.style.transform = "";
      });
    });

    /* magnetic buttons */
    document.querySelectorAll(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        const r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.15 + "px," + (e.clientY - r.top - r.height / 2) * 0.25 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- Package buttons → preselect service in contact form ---------- */
  const contactService = document.getElementById("contactService");
  document.querySelectorAll(".pc-btn[data-plan]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (contactService) {
        contactService.value = btn.getAttribute("data-plan");
        const field = contactService.closest(".dm-field");
        field.style.transition = "transform .3s";
        setTimeout(function () { field.style.transform = "scale(1.03)"; }, 700);
        setTimeout(function () { field.style.transform = ""; }, 1000);
      }
    });
  });

  /* ---------- Investment calculator ---------- */
  const fmt = function (n) { return "₹" + n.toLocaleString("en-IN"); };
  const planBtns = document.querySelectorAll(".calc-plans button");
  const slider = document.getElementById("adBudget");
  const adVal = document.getElementById("adBudgetVal");
  const feeEl = document.getElementById("calcFee");
  const adEl = document.getElementById("calcAd");
  const totalEl = document.getElementById("calcTotal");
  let fee = 9999;
  function calc() {
    const ad = parseInt(slider.value, 10);
    const pct = ((ad - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--fill", pct + "%");
    adVal.textContent = fmt(ad);
    feeEl.textContent = fmt(fee) + " / Month";
    adEl.textContent = fmt(ad) + " / Month";
    totalEl.textContent = fmt(fee + ad);
    totalEl.classList.remove("bump"); void totalEl.offsetWidth; totalEl.classList.add("bump");
  }
  planBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      planBtns.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      fee = parseInt(b.getAttribute("data-fee"), 10);
      calc();
    });
  });
  if (slider) { slider.addEventListener("input", calc); calc(); }

  /* ---------- Live lead ticker (demo animation) ---------- */
  const tickerText = document.getElementById("leadTickerText");
  const leads = [
    "New lead: Rahul S. — Google Ads → Assigned to Sales Exec 1",
    "New lead: Priya M. — Meta Ads → WhatsApp follow-up sent",
    "New lead: Amit K. — Website form → Reminder set for 4:00 PM",
    "Lead status updated: Neha G. → Converted ✓",
    "New lead: Vikas T. — Google Ads → Assigned to Sales Exec 2",
  ];
  if (tickerText && !reduceMotion) {
    let li = 0;
    setInterval(function () {
      tickerText.classList.add("swap");
      setTimeout(function () {
        li = (li + 1) % leads.length;
        tickerText.textContent = leads[li];
        tickerText.classList.remove("swap");
      }, 350);
    }, 3000);
  }

  /* ---------- Workflow progress line ---------- */
  const wfTrack = document.getElementById("workflowTrack");
  const wfFill = document.getElementById("wfFill");
  const wfSteps = wfTrack ? wfTrack.querySelectorAll(".wf-step") : [];
  function updateWorkflow() {
    if (!wfTrack) return;
    const r = wfTrack.getBoundingClientRect();
    const vh = window.innerHeight;
    let p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
    p = Math.max(0, Math.min(1, p));
    if (wfFill) wfFill.style.width = p * 100 + "%";
    const lit = Math.round(p * wfSteps.length);
    wfSteps.forEach(function (s, i) { s.classList.toggle("lit", i < lit); });
  }

  onScroll();

  /* ---------- Forms ---------- */
  setupForm("heroContactForm", "heroFormStatus");
  setupForm("chauhanContactForm", "cmFormStatus");
});

function setupForm(formId, statusId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const status = document.getElementById(statusId);
  const button = form.querySelector(".dm-submit");
  const btnText = button.querySelector(".dm-submit-text");
  const originalText = btnText.textContent;

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      const f = el.closest(".dm-field");
      if (f) f.classList.remove("invalid");
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot spam check
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;

    status.className = "dm-form-status";
    status.textContent = "";

    // Validation
    let ok = true;
    form.querySelectorAll("[required]").forEach(function (el) {
      const f = el.closest(".dm-field");
      let valid = el.value.trim() !== "";
      if (valid && el.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      if (valid && el.type === "tel") valid = el.value.replace(/\D/g, "").length >= 10;
      if (f) f.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      status.classList.add("error");
      status.textContent = "Please fill all required fields correctly.";
      return;
    }

    button.disabled = true;
    btnText.textContent = "Sending...";

    const payload = {
      name: form.querySelector('[name="name"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      service: form.querySelector('[name="service"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
    };

    try {
      // mode: "no-cors" is required because Apps Script doesn't send CORS
      // headers; we treat "fetch didn't throw" as success.
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });

      status.classList.add("success");
      status.textContent = "✓ Thank you! Your message has been sent successfully.";
      form.reset();
      window.location.href = "/thank-you";
      return;
    } catch (error) {
      status.classList.add("error");
      status.textContent = "Unable to send your message. Please try again or contact us on WhatsApp.";
    } finally {
      button.disabled = false;
      btnText.textContent = originalText;
    }
  });
}
