const B = "#popout-message-box-list{position:fixed;top:3rem;right:0;z-index:99999;display:flex;flex-direction:column;margin:.5rem;max-width:400px;max-height:calc(100vh - 3rem - 8px);overflow-x:hidden;overflow-y:auto}#popout-message-box-list::-webkit-scrollbar{width:4px}#popout-message-box-list.popout-position--top-left{right:auto;left:0}#popout-message-box-list.popout-position--top-center{right:auto;left:50%;margin-left:0;margin-right:0;transform:translate(-50%)}#popout-message-box-list.popout-position--bottom-left,#popout-message-box-list.popout-position--bottom-center,#popout-message-box-list.popout-position--bottom-right{top:auto;bottom:0;flex-direction:column-reverse}#popout-message-box-list.popout-position--bottom-left{right:auto;left:0}#popout-message-box-list.popout-position--bottom-center{right:auto;left:50%;margin-left:0;margin-right:0;transform:translate(-50%)}#popout-message-box-list .popout-message-box{min-width:10rem;max-width:25vw;cursor:pointer;opacity:.3;transition:all .7s}#popout-message-box-list .popout-message-box:first-child,#popout-message-box-list .popout-message-box:hover{opacity:1}#popout-message-box-list .popout-message-box .popout-card{position:relative;display:flex;flex-direction:column;min-width:0;background-color:#fff;background-clip:border-box;border-radius:.375rem;max-height:100vh;box-shadow:2px 2px 2px 1px #0000001a;border:0;border-style:solid;border-width:0px;border-left-width:5px;transition:all .5s}#popout-message-box-list .popout-message-box .popout-card.popout-card--success{border-color:var(--bs-green, #198754)}#popout-message-box-list .popout-message-box .popout-card.popout-card--fail{border-color:var(--bs-red, #dc3545)}#popout-message-box-list .popout-message-box .popout-card.popout-card--info{border-color:#289dc9}#popout-message-box-list .popout-message-box .popout-card.popout-card--warning{border-color:var(--bs-warning, #ffc107)}#popout-message-box-list .popout-message-box .popout-card.popout-card--primary{border-color:var(--bs-primary, #0d6efd)}#popout-message-box-list .popout-message-box .popout-card.popout-card--debug{border-color:var(--bs-secondary, #6c757d)}#popout-message-box-list .popout-message-box .popout-card{margin-bottom:8px}#popout-message-box-list .popout-message-box .popout-card .popout-card__body{flex:1 1 auto;padding:1rem}#popout-message-box-list .popout-message-box .popout-card .popout-card__body .popout-card__title{font-size:1rem;font-weight:700;letter-spacing:.0125em;border:0;margin:0}#popout-message-box-list .popout-message-box .popout-card .popout-card__body .popout-card__desp{font-size:.8rem;letter-spacing:.0125em;border:0;color:var(--bs-gray-500, #adb5bd)}#popout-message-box-list .popout-slide-leave-active,#popout-message-box-list .popout-slide-enter-active{transition:all .5s ease;transform:translate(0) translateY(0);margin-bottom:8px}#popout-message-box-list .popout-slide-enter-from{background-color:#0000;transform:translate(120%) translateY(0);height:0px;margin-bottom:0}#popout-message-box-list .popout-slide-leave-to{background-color:#0000;transform:translate(114%) translateY(-4px);height:0px;margin-bottom:0}#popout-message-box-list.popout-position--top-left .popout-slide-enter-from,#popout-message-box-list.popout-position--bottom-left .popout-slide-enter-from{transform:translate(-120%) translateY(0)}#popout-message-box-list.popout-position--top-left .popout-slide-leave-to,#popout-message-box-list.popout-position--bottom-left .popout-slide-leave-to{transform:translate(-114%) translateY(-4px)}#popout-message-box-list.popout-position--top-center .popout-slide-enter-from,#popout-message-box-list.popout-position--bottom-center .popout-slide-enter-from,#popout-message-box-list.popout-position--top-center .popout-slide-leave-to,#popout-message-box-list.popout-position--bottom-center .popout-slide-leave-to{transform:none;opacity:0}#popout-message-box-list .popout-card__time-mask{position:absolute;left:0;top:0;bottom:0;right:100%;background-color:#0000001a}#popout-message-box-list .popout-card__time-mask.popout-card__time-mask--stop{animation-play-state:paused!important}@keyframes popout-time-mask{0%{right:100%}to{right:0%}}", w = "popout-message-box-list", R = "popout-message-box-style";
const D = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
], b = {
  success: "popout-card--success",
  error: "popout-card--fail",
  info: "popout-card--info",
  warning: "popout-card--warning",
  debug: "popout-card--debug",
  primary: "popout-card--primary"
}, n = [], _ = /* @__PURE__ */ new Set(), r = {
  max: 10,
  duration: 5,
  position: "top-right"
};
function q(o) {
  if (!Number.isInteger(o) || o < 1)
    throw new RangeError(`maxItemNumber 必須是大於等於 1 的整數，收到：${o}`);
}
function E(o, t) {
  if (typeof o != "number" || !Number.isFinite(o) || o < 0)
    throw new RangeError(`${t} 必須是大於等於 0 的數字，收到：${o}`);
}
function U(o) {
  if (!D.includes(o))
    throw new RangeError(`position 必須是 ${D.join(" / ")} 其中之一，收到：${o}`);
}
function V(o) {
  if (!Object.prototype.hasOwnProperty.call(b, o))
    throw new RangeError(`type 必須是 ${Object.keys(b).join(" / ")} 其中之一，收到：${o}`);
}
function H() {
  return { count: n.length, maxItemNumber: r.max };
}
function k() {
  const o = H();
  _.forEach((t) => t(o));
}
function W() {
  if (document.getElementById(R)) return;
  const o = document.createElement("style");
  o.id = R, o.textContent = B, document.head.appendChild(o);
}
function P(o) {
  o.className = `popout-position--${r.position}`;
}
function G() {
  let o = document.getElementById(w);
  return o || (o = document.createElement("div"), o.id = w, document.body.appendChild(o)), P(o), o;
}
function l(o, t) {
  const e = document.createElement("div");
  return e.className = o, t !== void 0 && (e.textContent = t), e;
}
function J(o) {
  requestAnimationFrame(() => requestAnimationFrame(o));
}
function M(o, t) {
  const e = `popout-slide-${t}-from`, u = `popout-slide-${t}-active`, f = `popout-slide-${t}-to`;
  o.classList.add(e, u), J(() => {
    o.classList.remove(e), o.classList.add(f), t === "enter" && o.addEventListener("transitionend", () => o.classList.remove(u, f), { once: !0 });
  });
}
function j() {
  for (; n.length > r.max; )
    n[0].close();
}
function m(o, t, e = "", u = r.duration) {
  E(u, "lifeTime"), W();
  const f = G(), x = l("popout-message-box"), i = l(`popout-card ${b[o]}`), a = l("popout-card__time-mask"), L = l("popout-card__title", t), T = l("popout-card__desp", e), I = l("popout-card__body");
  I.append(L, T), i.append(a, I), x.append(i), f.prepend(x);
  let S = o, v = 0, C = 0, p = null, d = !0, g = !1, $ = !1, c = !1;
  const N = () => {
    p !== null && (clearTimeout(p), p = null, v -= Date.now() - C);
  }, Y = () => {
    C = Date.now(), p = window.setTimeout(y, v);
  }, A = (s) => {
    p !== null && clearTimeout(p), p = null, d = s > 0, v = s * 1e3, a.hidden = !d, a.style.animation = "none", a.offsetWidth, a.style.animation = d ? `popout-time-mask ${s}s linear forwards` : "", a.classList.toggle("popout-card__time-mask--stop", g), d && !g && Y();
  }, O = () => {
    i.style.height = "", i.style.height = `${i.offsetHeight}px`, $ = !0;
  }, F = () => {
    g = !0, p !== null && (N(), a.classList.add("popout-card__time-mask--stop"));
  }, z = () => {
    g = !1, !(c || p !== null || !d) && (Y(), a.classList.remove("popout-card__time-mask--stop"));
  }, y = () => {
    c || (c = !0, N(), n.splice(n.indexOf(h), 1), i.style.height = "0px", M(i, "leave"), k(), setTimeout(() => x.remove(), 2e3));
  }, h = { close: y, update: (s) => {
    c || (s.type !== void 0 && V(s.type), s.lifeTime !== void 0 && E(s.lifeTime, "lifeTime"), s.mainString !== void 0 && (L.textContent = s.mainString), s.despString !== void 0 && (T.textContent = s.despString), s.type !== void 0 && (i.classList.replace(b[S], b[s.type]), S = s.type), s.lifeTime !== void 0 && (u = s.lifeTime), $ && O(), A(u));
  } };
  return i.addEventListener("mouseenter", F), i.addEventListener("mouseleave", z), i.addEventListener("click", y), M(i, "enter"), setTimeout(() => {
    c || O();
  }, 100), A(u), n.push(h), j(), k(), h;
}
const K = {
  success: (o, t, e) => m("success", o, t, e),
  error: (o, t, e) => m("error", o, t, e),
  info: (o, t, e) => m("info", o, t, e),
  warning: (o, t, e) => m("warning", o, t, e),
  debug: (o, t, e) => m("debug", o, t, e),
  primary: (o, t, e) => m("primary", o, t, e),
  clear: () => {
    [...n].forEach((o) => o.close());
  },
  configure: (o) => {
    if (o.max !== void 0 && q(o.max), o.duration !== void 0 && E(o.duration, "duration"), o.position !== void 0 && U(o.position), o.duration !== void 0 && (r.duration = o.duration), o.position !== void 0) {
      r.position = o.position;
      const t = typeof document < "u" ? document.getElementById(w) : null;
      t && P(t);
    }
    o.max !== void 0 && (r.max = o.max, j()), k();
  },
  getConfig: () => ({ ...r }),
  setMaxItemNumber: (o) => K.configure({ max: o }),
  getMaxItemNumber: () => r.max,
  getCount: () => n.length,
  subscribe: (o) => (_.add(o), () => {
    _.delete(o);
  })
};
export {
  K as notify
};
