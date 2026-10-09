import { useEffect } from "react";

/* ---------------------------------------------------------------
   Real-time validation for EVERY form in the app.
   Mount <LiveValidation onInvalid={fn}/> once. It listens to all
   inputs/selects/textareas that live inside a <form> and:
     - checks them while the user types (after the first touch / blur)
     - shows a message under the field + red / green / amber border
     - blocks submit when something is wrong and focuses the first problem
   Rules are inferred from the input type, `required`, min/max and the
   label/name (email, phone, price, quantity, expiry date, password...).
   Opt out of a form with data-novalidate.
   --------------------------------------------------------------- */

const SKIP = new Set(["hidden", "checkbox", "radio", "file", "button", "submit", "reset", "range", "color", "image"]);
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
let uid = 0;

function eligible(el) {
  if (!el || !el.matches || !el.matches("input,select,textarea")) return false;
  if (SKIP.has((el.type || "").toLowerCase())) return false;
  if (!el.form || el.form.hasAttribute("data-novalidate")) return false;
  if (el.closest(".search") || el.hasAttribute("data-novalidate") || el.disabled) return false;
  return true;
}

function labelOf(el) {
  const lab = el.closest("label");
  let t = "";
  if (lab) t = [...lab.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ");
  t = (t || "").trim() || el.getAttribute("aria-label") || el.placeholder || el.name || "";
  return t.replace(/[_*:]/g, " ").replace(/\s+/g, " ").trim();
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

export function passwordScore(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return s;
}

/* returns { level: "error" | "warn" | "ok" | "", msg } */
export function check(el) {
  const raw = el.value ?? "";
  const val = String(raw).trim();
  const label = labelOf(el);
  const L = cap(label || "This field");
  const k = [label, el.name, el.placeholder, el.id].join(" ").toLowerCase();
  const type = (el.type || "text").toLowerCase();
  const required = el.required || el.dataset.required === "true";

  if (el.tagName === "SELECT") {
    const o = el.selectedOptions && el.selectedOptions[0];
    const empty = !val || (o && !o.hasAttribute("value") && /^(select|choose)/i.test(o.text));
    if (empty) return required ? { level: "error", msg: `Select ${label ? label.toLowerCase() : "an option"}` } : { level: "" };
    return { level: "ok" };
  }
  if (!val) return required ? { level: "error", msg: `${L} is required` } : { level: "" };

  const max = el.tagName === "TEXTAREA" ? 1000 : 255;
  if (val.length > (el.maxLength > 0 ? el.maxLength : max)) return { level: "error", msg: `${L} is too long (max ${el.maxLength > 0 ? el.maxLength : max} characters)` };

  /* email */
  if (type === "email" || /\be-?mail\b/.test(k)) {
    if (val.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val) || /\.\./.test(val))
      return { level: "error", msg: "Enter a valid email, e.g. name@example.com" };
    return { level: "ok" };
  }

  /* phone (Sri Lanka) */
  if (type === "tel" || /phone|mobile|contact (no|number)|\btel\b/.test(k)) {
    const d = val.replace(/[\s()-]/g, "");
    if (!/^(?:\+94|0)\d{9}$/.test(d)) return { level: "error", msg: "Enter a valid Sri Lankan number, e.g. 0771234567" };
    return { level: "ok" };
  }

  /* password */
  if (type === "password") {
    if (el.form.hasAttribute("data-login") || /current|old/.test(k)) return { level: "ok" };
    if (/confirm|repeat|re-?enter/.test(k)) {
      const other = [...el.form.querySelectorAll('input[type="password"]')].find((x) => x !== el && !/confirm|repeat|re-?enter/.test(labelOf(x).toLowerCase()));
      return other && other.value !== el.value ? { level: "error", msg: "Passwords do not match" } : { level: "ok" };
    }
    const miss = [];
    if (val.length < 8) miss.push("8+ characters");
    if (!/[a-z]/.test(val) || !/[A-Z]/.test(val)) miss.push("upper & lower case letters");
    if (!/\d/.test(val)) miss.push("a number");
    return miss.length ? { level: "error", msg: `Password needs ${miss.join(", ")}` } : { level: "ok" };
  }

  /* dates */
  if (type === "date") {
    const y = Number(val.slice(0, 4));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val) || Number.isNaN(Date.parse(val)) || y < 1900 || y > 2100) return { level: "error", msg: "Enter a valid date" };
    if (/expiry|expire/.test(k)) {
      if (val < today()) return { level: "error", msg: "This date has passed. Expired stock can't be added" };
      const n = daysBetween(today(), val);
      if (n <= 90) return { level: "warn", msg: `Expires in ${n} day${n === 1 ? "" : "s"}. Short shelf life` };
    }
    if (/payment|paid/.test(k) && val > today()) return { level: "error", msg: "Payment date can't be in the future" };
    if (/delivery|due|expected/.test(k) && val < today()) return { level: "error", msg: "Pick today or a later date" };
    if (/birth|dob/.test(k) && (val > today() || daysBetween(val, today()) > 43800)) return { level: "error", msg: "Enter a realistic birth date" };
    return { level: "ok" };
  }

  /* numbers: quantity, price, ids, points ... */
  const isId = /(^|[\s_])id$|\bid\b|saleid|medicine id|supplier id|branch id/.test(k);
  const isInt = isId || /quantity|\bqty\b|level|points|stock/.test(k);
  const isMoney = /price|amount|cost|total|discount|payment|fee/.test(k) && !isId;
  if (type === "number" || isInt || isMoney) {
    const n = Number(val.replace(/,/g, ""));
    if (!Number.isFinite(n)) return { level: "error", msg: `${L} must be a number` };
    if (el.min !== "" && n < Number(el.min)) return { level: "error", msg: `${L} must be at least ${el.min}` };
    if (el.max !== "" && n > Number(el.max)) return { level: "error", msg: `${L} can't be more than ${el.max}` };
    if (el.min === "" && n < 0) return { level: "error", msg: `${L} can't be negative` };
    if (isId && (n < 1 || !Number.isInteger(n))) return { level: "error", msg: `${L} must be a valid ID number` };
    if (isInt && !Number.isInteger(n)) return { level: "error", msg: `${L} must be a whole number` };
    if (isMoney && !/^\d+(\.\d{1,2})?$/.test(val.replace(/,/g, ""))) return { level: "error", msg: "Use at most 2 decimal places" };
    if (isMoney && el.min === "" && /price|amount/.test(k) && n === 0) return { level: "error", msg: `${L} must be greater than 0` };
    if (n > (isMoney ? 10000000 : 1000000)) return { level: "error", msg: "That looks too large. Please check the value" };
    return { level: "ok" };
  }

  /* text fields with meaning */
  if (/full.?name|contact.?person|customer.?name|doctor|staff.?name/.test(k) && !/medicine|generic|brand|pharmacy|system/.test(k)) {
    if (!/^\p{L}[\p{L}\p{M}\s.'’-]+$/u.test(val)) return { level: "error", msg: "Use letters only, e.g. Nimal Perera" };
    return { level: "ok" };
  }
  if (/barcode/.test(k) && !/^[A-Za-z0-9-]{4,30}$/.test(val)) return { level: "error", msg: "Barcode: 4 to 30 letters or numbers" };
  if (/batch/.test(k) && /(no|number)/.test(k) && !/^[A-Za-z0-9/_-]{2,30}$/.test(val)) return { level: "error", msg: "Batch number: 2 to 30 letters or numbers" };
  if (/address/.test(k) && val.length < 5) return { level: "error", msg: "Enter the full address" };
  if (/initials/.test(k) && !/^[\p{L}\p{N}]{1,3}$/u.test(val)) return { level: "error", msg: "Use 1 to 3 characters" };
  if (/\bname\b/.test(k) && (val.length < 2 || !/\p{L}/u.test(val))) return { level: "error", msg: `${L} must be at least 2 characters` };

  return { level: "ok" };
}

/* ---------------- rendering ---------------- */
function render(el, res, { showOk = true } = {}) {
  const id = el._fvid || (el._fvid = ++uid);
  el.classList.remove("fv-invalid", "fv-valid", "fv-warn");
  el.removeAttribute("aria-invalid");
  el.removeAttribute("title");
  const lab = el.closest("label");
  const wantStrength = el.type === "password" && !el.form.hasAttribute("data-login") && !/current|old|confirm|repeat|re-?enter/.test(labelOf(el).toLowerCase()) && el.value;
  const msg = res.level === "error" || res.level === "warn" ? res.msg : "";

  if (res.level === "error") {
    el.classList.add("fv-invalid");
    el.setAttribute("aria-invalid", "true");
  } else if (res.level === "warn") el.classList.add("fv-warn");
  else if (res.level === "ok" && showOk) el.classList.add("fv-valid");

  if (!lab) {
    if (msg) el.title = msg; // inline rows (e.g. purchase items) have no room for text
    return;
  }
  [...lab.querySelectorAll(":scope > .fv-hint")].forEach((h) => {
    if (h.dataset.for !== String(id)) h.remove();
  });
  let hint = lab.querySelector(`:scope > .fv-hint[data-for="${id}"]`);
  if (!msg && !wantStrength) return hint && hint.remove();
  if (!hint) {
    hint = document.createElement("span");
    hint.className = "fv-hint";
    hint.dataset.for = String(id);
    el.after(hint);
  }
  const score = wantStrength ? passwordScore(el.value) : 0;
  const names = ["", "Weak", "Fair", "Good", "Strong"];
  hint.innerHTML =
    (wantStrength ? `<span class="fv-strength s${score}"><i></i><i></i><i></i><i></i><b>${names[score]}</b></span>` : "") +
    (msg ? `<span class="fv-text ${res.level}" role="alert">${msg.replace(/</g, "&lt;")}</span>` : "");
}

function markRequired(el) {
  const lab = el.closest("label");
  if (!lab || !(el.required || el.dataset.required === "true") || lab.querySelector(":scope > .fv-star")) return;
  const s = document.createElement("span");
  s.className = "fv-star";
  s.textContent = "*";
  s.setAttribute("aria-hidden", "true");
  lab.prepend(s);
}

function run(el, touchedOnly = true) {
  if (!eligible(el)) return null;
  markRequired(el);
  if (touchedOnly && !el._fvtouched) return null;
  const res = check(el);
  render(el, res);
  return res;
}

export function LiveValidation({ onInvalid }) {
  useEffect(() => {
    /* browsers' own tooltips are replaced by our messages */
    let raf;
    const prep = () => {
      document.querySelectorAll("form").forEach((f) => {
        f.noValidate = true;
        f.querySelectorAll("input,select,textarea").forEach(markRequired);
      });
    };
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(prep);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    prep();

    const onInput = (e) => {
      const el = e.target;
      if (!eligible(el)) return;
      el._fvtouched = true;
      run(el);
      /* a password change also re-checks its confirm field */
      if (el.type === "password")
        el.form.querySelectorAll('input[type="password"]').forEach((p) => p !== el && p._fvtouched && run(p));
    };
    const onBlur = (e) => {
      const el = e.target;
      if (!eligible(el)) return;
      el._fvtouched = true;
      run(el);
    };
    const onKey = (e) => {
      const el = e.target;
      if (!eligible(el) || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const k = [labelOf(el), el.name, el.placeholder].join(" ").toLowerCase();
      if ((el.type === "tel" || /phone|mobile/.test(k)) && !/[\d+\-\s()]/.test(e.key)) e.preventDefault();
      if (el.type === "number" && /[eE+]/.test(e.key)) e.preventDefault();
      if (el.type === "number" && e.key === "-" && !(el.min !== "" && Number(el.min) < 0)) e.preventDefault();
    };
    const onSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement) || form.hasAttribute("data-novalidate")) return;
      const bad = [];
      form.querySelectorAll("input,select,textarea").forEach((el) => {
        if (!eligible(el)) return;
        el._fvtouched = true;
        const r = run(el, false);
        if (r && r.level === "error") bad.push(el);
      });
      if (bad.length) {
        e.preventDefault();
        e.stopImmediatePropagation();
        bad[0].focus();
        bad[0].scrollIntoView({ block: "center", behavior: "smooth" });
        form.classList.remove("fv-shake");
        void form.offsetWidth;
        form.classList.add("fv-shake");
        onInvalid?.(`${bad.length} field${bad.length > 1 ? "s" : ""} need${bad.length > 1 ? "" : "s"} attention: ${check(bad[0]).msg}`);
        return;
      }
      /* after a good submit the page usually clears the form: drop stale states */
      [700, 1600].forEach((ms) =>
        setTimeout(() => {
          form.querySelectorAll("input,select,textarea").forEach((el) => {
            if (eligible(el) && !String(el.value || "").trim()) {
              el._fvtouched = false;
              render(el, { level: "" });
            }
          });
        }, ms),
      );
    };

    document.addEventListener("input", onInput);
    document.addEventListener("change", onInput);
    document.addEventListener("focusout", onBlur);
    document.addEventListener("keydown", onKey);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("input", onInput);
      document.removeEventListener("change", onInput);
      document.removeEventListener("focusout", onBlur);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [onInvalid]);
  return null;
}
