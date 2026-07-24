import { inject as T, ref as k, createVNode as v, render as E, defineComponent as S, openBlock as b, createBlock as M, Transition as h, withCtx as x, createElementBlock as P, normalizeClass as y, createElementVNode as p, normalizeStyle as C, toDisplayString as f, createCommentVNode as U } from "vue";
const s = [];
for (let e = 0; e < 256; ++e)
  s.push((e + 256).toString(16).slice(1));
function B(e, t = 0) {
  return (s[e[t + 0]] + s[e[t + 1]] + s[e[t + 2]] + s[e[t + 3]] + "-" + s[e[t + 4]] + s[e[t + 5]] + "-" + s[e[t + 6]] + s[e[t + 7]] + "-" + s[e[t + 8]] + s[e[t + 9]] + "-" + s[e[t + 10]] + s[e[t + 11]] + s[e[t + 12]] + s[e[t + 13]] + s[e[t + 14]] + s[e[t + 15]]).toLowerCase();
}
let m;
const R = new Uint8Array(16);
function V() {
  if (!m) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    m = crypto.getRandomValues.bind(crypto);
  }
  return m(R);
}
const _ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), w = { randomUUID: _ };
function $(e, t, o) {
  var i;
  if (w.randomUUID && !e)
    return w.randomUUID();
  e = e || {};
  const n = e.random ?? ((i = e.rng) == null ? void 0 : i.call(e)) ?? V();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, B(n);
}
const D = Symbol("PopoutMessage");
let u = null;
function z() {
  if (!u)
    throw new Error("Root App 尚未初始化，請確認已使用 app.use(PopoutMessagePlugin)");
  return u;
}
const H = {
  install: (e) => {
    e.provide(D, a), u = e;
  }
};
function N() {
  const e = T(D);
  if (!e)
    throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");
  return e;
}
const W = k(0);
function A() {
  let e = document.getElementById("popout-message-box-list");
  return e || (e = document.createElement("div"), e.id = "popout-message-box-list", document.body.appendChild(e)), e;
}
const l = (e, t, o, n = 5) => {
  const i = A(), d = $(), r = document.createElement("div");
  r.id = d, r.className = "popout-message-box";
  const g = v(c, {
    eleID: d,
    messageType: e,
    mainString: t,
    despString: o || "",
    // Ensure despString is not undefined
    lifeTime: n
  });
  g.appContext = z()._context, E(g, r), i.appendChild(r), i.prepend(r);
}, j = {
  count: W
}, a = {
  success: (e, t, o) => l("success", e, t, o),
  error: (e, t, o) => l("fail", e, t, o),
  // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (e, t, o) => l("info", e, t, o),
  warning: (e, t, o) => l("warning", e, t, o),
  debug: (e, t, o) => l("debug", e, t, o),
  primary: (e, t, o) => l("primary", e, t, o),
  status: j
}, q = S({
  name: "PopoutMessageBox",
  props: {
    messageType: {
      type: String,
      required: !0
    },
    eleID: {
      type: String,
      required: !0
    },
    lifeTime: {
      type: Number,
      default: 5
    },
    mainString: {
      type: String,
      required: !0
    },
    despString: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      create: !1,
      delItem: null,
      startTime: -1,
      remaining: -1
    };
  },
  computed: {
    isAnimeStop() {
      return this.delItem === null;
    }
  },
  mounted() {
    this.create = !0, setTimeout(() => {
      this.getEleHeight();
    }, 100), this.remaining = this.lifeTime * 1e3, this.startTime = Date.now(), this.delItem = window.setTimeout(() => {
      this.delThisWindow();
    }, this.remaining);
  },
  methods: {
    getEleHeight() {
      const e = document.getElementById(this.eleID);
      return !e || !e.children[0] ? 0 : (e.children[0].style.height = `${e.offsetHeight}px`, e.offsetHeight);
    },
    delThisWindow() {
      this.stopDel();
      const e = document.getElementById(this.eleID);
      !e || !e.children[0] || (e.children[0].style.height = "0px", this.create = !1, a.status.count.value > 0 && (a.status.count.value -= 1), setTimeout(() => {
        e.remove();
      }, 2e3));
    },
    stopDel() {
      this.delItem !== null && (clearTimeout(this.delItem), this.delItem = null, this.remaining -= Date.now() - this.startTime);
    },
    resumeDel() {
      this.startTime = Date.now(), this.delItem = window.setTimeout(() => {
        this.delThisWindow();
      }, this.remaining);
    }
  },
  created() {
    a.status.count.value += 1, console.log(a.status.count.value);
  },
  deactivated() {
    a.status.count.value > 0 && (a.status.count.value -= 1);
  }
}), Y = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, i] of t)
    o[n] = i;
  return o;
}, K = { class: "card-body" }, L = { class: "card-title" }, O = { class: "card-desp" };
function F(e, t, o, n, i, d) {
  return b(), M(h, { name: "when-create" }, {
    default: x(() => [
      e.create ? (b(), P("div", {
        key: 0,
        class: y(["card", e.messageType]),
        onMouseenter: t[0] || (t[0] = (...r) => e.stopDel && e.stopDel(...r)),
        onMouseleave: t[1] || (t[1] = (...r) => e.resumeDel && e.resumeDel(...r)),
        onClick: t[2] || (t[2] = (...r) => e.delThisWindow && e.delThisWindow(...r))
      }, [
        v(h, { name: "when-create" }, {
          default: x(() => [
            p("div", {
              class: y(["time-mask", e.isAnimeStop ? "stop" : ""]),
              style: C(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)
            }, null, 6)
          ]),
          _: 1
        }),
        p("div", K, [
          p("div", L, f(e.mainString), 1),
          p("div", O, f(e.despString), 1)
        ])
      ], 34)) : U("", !0)
    ]),
    _: 1
  });
}
const c = /* @__PURE__ */ Y(q, [["render", F]]), G = [c], J = (e) => {
  G.forEach((t) => {
    e.component("PopoutMessageBox", c);
  }), e.use(H);
}, X = {
  install: J,
  usePopoutMessage: N
}, I = document.createElement("style");
I.textContent = `#popout-message-box-list{position:fixed;top:3rem;right:0;z-index:99999;margin:.5rem;max-width:400px;max-height:calc(100vh - 3rem - 8px);overflow-x:hidden;overflow-y:auto}#popout-message-box-list::-webkit-scrollbar{width:4px}#popout-message-box-list .popout-message-box{min-width:10rem;max-width:25vw;cursor:pointer;opacity:.3;transition:all .7s}#popout-message-box-list .popout-message-box:first-child,#popout-message-box-list .popout-message-box:hover{opacity:1}#popout-message-box-list .popout-message-box .card{position:relative;display:flex;flex-direction:column;min-width:0;background-color:#fff;background-clip:border-box;border-radius:.375rem;max-height:100vh;box-shadow:2px 2px 2px 1px #0000001a;border:0;border-style:solid;border-width:0px;border-left-width:5px;transition:all .5s}#popout-message-box-list .popout-message-box .card.success{border-color:var(--bs-green, #198754)}#popout-message-box-list .popout-message-box .card.fail{border-color:var(--bs-red, #dc3545)}#popout-message-box-list .popout-message-box .card.info{border-color:#289dc9}#popout-message-box-list .popout-message-box .card.warning{border-color:var(--bs-warning, #ffc107)}#popout-message-box-list .popout-message-box .card.primary{border-color:var(--bs-primary, #0d6efd)}#popout-message-box-list .popout-message-box .card.debug{border-color:var(--bs-secondary, #6c757d)}#popout-message-box-list .popout-message-box .card{margin-bottom:8px}#popout-message-box-list .popout-message-box .card .card-body{flex:1 1 auto;padding:1rem}#popout-message-box-list .popout-message-box .card .card-body .card-title{font-size:1rem;font-weight:700;letter-spacing:.0125em;border:0;margin:0}#popout-message-box-list .popout-message-box .card .card-body .card-desp{font-size:.8rem;letter-spacing:.0125em;border:0;color:var(--bs-gray-500, #adb5bd)}#popout-message-box-list .when-create-leave-active,#popout-message-box-list .when-create-enter-active{transition:all .5s ease;transform:translate(0) translateY(0);margin-bottom:8px}#popout-message-box-list .when-create-enter-from{background-color:#0000;transform:translate(120%) translateY(0);height:0px;margin-bottom:0}#popout-message-box-list .when-create-leave-to{background-color:#0000;transform:translate(114%) translateY(-4px);height:0px;margin-bottom:0}#popout-message-box-list .time-mask{position:absolute;left:0;top:0;bottom:0;right:100%;background-color:#0000001a}#popout-message-box-list .time-mask.stop{animation-play-state:paused!important}@keyframes time_mask_anime{0%{right:100%}to{right:0%}}
`;
document.head.appendChild(I);
export {
  c as PopoutMessageBox,
  H as PopoutMessagePlugin,
  X as default,
  N as usePopoutMessage
};
