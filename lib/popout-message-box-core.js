const A = "#popout-message-box-list{position:fixed;top:3rem;right:0;z-index:99999;margin:.5rem;max-width:400px;max-height:calc(100vh - 3rem - 8px);overflow-x:hidden;overflow-y:auto}#popout-message-box-list::-webkit-scrollbar{width:4px}#popout-message-box-list .popout-message-box{min-width:10rem;max-width:25vw;cursor:pointer;opacity:.3;transition:all .7s}#popout-message-box-list .popout-message-box:first-child,#popout-message-box-list .popout-message-box:hover{opacity:1}#popout-message-box-list .popout-message-box .popout-card{position:relative;display:flex;flex-direction:column;min-width:0;background-color:#fff;background-clip:border-box;border-radius:.375rem;max-height:100vh;box-shadow:2px 2px 2px 1px #0000001a;border:0;border-style:solid;border-width:0px;border-left-width:5px;transition:all .5s}#popout-message-box-list .popout-message-box .popout-card.popout-card--success{border-color:var(--bs-green, #198754)}#popout-message-box-list .popout-message-box .popout-card.popout-card--fail{border-color:var(--bs-red, #dc3545)}#popout-message-box-list .popout-message-box .popout-card.popout-card--info{border-color:#289dc9}#popout-message-box-list .popout-message-box .popout-card.popout-card--warning{border-color:var(--bs-warning, #ffc107)}#popout-message-box-list .popout-message-box .popout-card.popout-card--primary{border-color:var(--bs-primary, #0d6efd)}#popout-message-box-list .popout-message-box .popout-card.popout-card--debug{border-color:var(--bs-secondary, #6c757d)}#popout-message-box-list .popout-message-box .popout-card{margin-bottom:8px}#popout-message-box-list .popout-message-box .popout-card .popout-card__body{flex:1 1 auto;padding:1rem}#popout-message-box-list .popout-message-box .popout-card .popout-card__body .popout-card__title{font-size:1rem;font-weight:700;letter-spacing:.0125em;border:0;margin:0}#popout-message-box-list .popout-message-box .popout-card .popout-card__body .popout-card__desp{font-size:.8rem;letter-spacing:.0125em;border:0;color:var(--bs-gray-500, #adb5bd)}#popout-message-box-list .popout-slide-leave-active,#popout-message-box-list .popout-slide-enter-active{transition:all .5s ease;transform:translate(0) translateY(0);margin-bottom:8px}#popout-message-box-list .popout-slide-enter-from{background-color:#0000;transform:translate(120%) translateY(0);height:0px;margin-bottom:0}#popout-message-box-list .popout-slide-leave-to{background-color:#0000;transform:translate(114%) translateY(-4px);height:0px;margin-bottom:0}#popout-message-box-list .popout-card__time-mask{position:absolute;left:0;top:0;bottom:0;right:100%;background-color:#0000001a}#popout-message-box-list .popout-card__time-mask.popout-card__time-mask--stop{animation-play-state:paused!important}@keyframes popout-time-mask{0%{right:100%}to{right:0%}}", y = "popout-message-box-list", E = "popout-message-box-style";
const r = [], x = /* @__PURE__ */ new Set();
let b = 10;
function D() {
  return { count: r.length, maxItemNumber: b };
}
function f() {
  const o = D();
  x.forEach((e) => e(o));
}
function T() {
  if (document.getElementById(E)) return;
  const o = document.createElement("style");
  o.id = E, o.textContent = A, document.head.appendChild(o);
}
function C() {
  let o = document.getElementById(y);
  return o || (o = document.createElement("div"), o.id = y, document.body.appendChild(o)), o;
}
function p(o, e) {
  const t = document.createElement("div");
  return t.className = o, e !== void 0 && (t.textContent = e), t;
}
function N(o) {
  requestAnimationFrame(() => requestAnimationFrame(o));
}
function k(o, e) {
  const t = `popout-slide-${e}-from`, i = `popout-slide-${e}-active`, u = `popout-slide-${e}-to`;
  o.classList.add(t, i), N(() => {
    o.classList.remove(t), o.classList.add(u), e === "enter" && o.addEventListener("transitionend", () => o.classList.remove(i, u), { once: !0 });
  });
}
function L() {
  for (; r.length > b; )
    r[0].close();
}
function n(o, e, t = "", i = 5) {
  T();
  const u = C(), d = p("popout-message-box"), s = p(`popout-card popout-card--${o}`), m = p("popout-card__time-mask");
  m.style.animation = `popout-time-mask ${i}s linear forwards`;
  const h = p("popout-card__body");
  h.append(
    p("popout-card__title", e),
    p("popout-card__desp", t)
  ), s.append(m, h), d.append(s), u.prepend(d);
  let g = i * 1e3, v = Date.now(), a = null, c = !1;
  const _ = () => {
    a !== null && (clearTimeout(a), a = null, g -= Date.now() - v, m.classList.add("popout-card__time-mask--stop"));
  }, I = () => {
    c || a !== null || (v = Date.now(), a = window.setTimeout(l, g), m.classList.remove("popout-card__time-mask--stop"));
  }, l = () => {
    c || (c = !0, _(), r.splice(r.indexOf(w), 1), s.style.height = "0px", k(s, "leave"), f(), setTimeout(() => d.remove(), 2e3));
  }, w = { close: l };
  s.addEventListener("mouseenter", _), s.addEventListener("mouseleave", I), s.addEventListener("click", l), k(s, "enter"), setTimeout(() => {
    c || (s.style.height = `${d.offsetHeight}px`);
  }, 100), a = window.setTimeout(l, g), r.push(w), L(), f();
}
const Y = {
  success: (o, e, t) => n("success", o, e, t),
  error: (o, e, t) => n("fail", o, e, t),
  info: (o, e, t) => n("info", o, e, t),
  warning: (o, e, t) => n("warning", o, e, t),
  debug: (o, e, t) => n("debug", o, e, t),
  primary: (o, e, t) => n("primary", o, e, t),
  setMaxItemNumber: (o) => {
    if (!Number.isInteger(o) || o < 1)
      throw new RangeError(`maxItemNumber 必須是大於等於 1 的整數，收到：${o}`);
    b = o, L(), f();
  },
  getMaxItemNumber: () => b,
  getCount: () => r.length,
  subscribe: (o) => (x.add(o), () => {
    x.delete(o);
  })
};
export {
  Y as notify
};
