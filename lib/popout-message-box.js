import { inject as S, ref as b, createVNode as T, render as C, defineComponent as P, nextTick as B, openBlock as f, createBlock as U, Transition as y, withCtx as w, createElementBlock as R, normalizeClass as I, createElementVNode as m, normalizeStyle as N, toDisplayString as D, createCommentVNode as V } from "vue";
const s = [];
for (let e = 0; e < 256; ++e)
  s.push((e + 256).toString(16).slice(1));
function L(e, t = 0) {
  return (s[e[t + 0]] + s[e[t + 1]] + s[e[t + 2]] + s[e[t + 3]] + "-" + s[e[t + 4]] + s[e[t + 5]] + "-" + s[e[t + 6]] + s[e[t + 7]] + "-" + s[e[t + 8]] + s[e[t + 9]] + "-" + s[e[t + 10]] + s[e[t + 11]] + s[e[t + 12]] + s[e[t + 13]] + s[e[t + 14]] + s[e[t + 15]]).toLowerCase();
}
let g;
const W = new Uint8Array(16);
function _() {
  if (!g) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    g = crypto.getRandomValues.bind(crypto);
  }
  return g(W);
}
const $ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), E = { randomUUID: $ };
function z(e, t, o) {
  var r;
  if (E.randomUUID && !e)
    return E.randomUUID();
  e = e || {};
  const n = e.random ?? ((r = e.rng) == null ? void 0 : r.call(e)) ?? _();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, L(n);
}
const k = Symbol("PopoutMessage");
let h = null;
function H() {
  if (!h)
    throw new Error("Root App 尚未初始化，請確認已使用 app.use(PopoutMessagePlugin)");
  return h;
}
const A = {
  install: (e) => {
    e.provide(k, a), h = e;
  }
};
function j() {
  const e = S(k);
  if (!e)
    throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");
  return e;
}
const q = b(0), p = b(10), l = b([]);
function Y() {
  let e = document.getElementById("popout-message-box-list");
  return e || (e = document.createElement("div"), e.id = "popout-message-box-list", document.body.appendChild(e)), e;
}
document.addEventListener("popout-removed", (e) => {
  const o = e.detail.id, n = l.value.findIndex((r) => r.id === o);
  n !== -1 && l.value.splice(n, 1);
});
const d = (e, t, o, n = 5) => {
  const r = Y(), u = z(), i = document.createElement("div");
  i.id = u, i.className = "popout-message-box";
  const v = T(x, {
    eleID: u,
    messageType: e,
    mainString: t,
    despString: o || "",
    // Ensure despString is not undefined
    lifeTime: n
  });
  for (v.appContext = H()._context, C(v, i), r.appendChild(i), r.prepend(i), l.value.push(i); l.value.length > p.value; ) {
    const c = l.value.shift();
    c == null || c.dispatchEvent(new CustomEvent("removed"));
  }
}, K = {
  count: q,
  maxItemNumber: p
}, a = {
  success: (e, t, o) => d("success", e, t, o),
  error: (e, t, o) => d("fail", e, t, o),
  // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (e, t, o) => d("info", e, t, o),
  warning: (e, t, o) => d("warning", e, t, o),
  debug: (e, t, o) => d("debug", e, t, o),
  primary: (e, t, o) => d("primary", e, t, o),
  setMaxItemNumber: (e) => {
    p.value = e;
  },
  getMaxItemNumber: () => p.value,
  status: K
}, O = P({
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
    }, this.remaining), B(() => {
      this.addRemoveListener();
    });
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
        document.dispatchEvent(new CustomEvent("popout-removed", { detail: { id: this.eleID } })), e.remove();
      }, 2e3));
    },
    stopDel() {
      this.delItem !== null && (clearTimeout(this.delItem), this.delItem = null, this.remaining -= Date.now() - this.startTime);
    },
    resumeDel() {
      this.startTime = Date.now(), this.delItem = window.setTimeout(() => {
        this.delThisWindow();
      }, this.remaining);
    },
    addRemoveListener() {
      const e = document.getElementById(this.eleID);
      e == null || e.addEventListener("removed", (t) => {
        this.delThisWindow();
      });
    }
  },
  created() {
    a.status.count.value += 1, console.log(a.status.count.value);
  },
  deactivated() {
    a.status.count.value > 0 && (a.status.count.value -= 1);
  }
}), F = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [n, r] of t)
    o[n] = r;
  return o;
}, G = { class: "card-body" }, J = { class: "card-title" }, Q = { class: "card-desp" };
function X(e, t, o, n, r, u) {
  return f(), U(y, { name: "when-create" }, {
    default: w(() => [
      e.create ? (f(), R("div", {
        key: 0,
        class: I(["card", e.messageType]),
        onMouseenter: t[0] || (t[0] = (...i) => e.stopDel && e.stopDel(...i)),
        onMouseleave: t[1] || (t[1] = (...i) => e.resumeDel && e.resumeDel(...i)),
        onClick: t[2] || (t[2] = (...i) => e.delThisWindow && e.delThisWindow(...i))
      }, [
        T(y, { name: "when-create" }, {
          default: w(() => [
            m("div", {
              class: I(["time-mask", e.isAnimeStop ? "stop" : ""]),
              style: N(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)
            }, null, 6)
          ]),
          _: 1
        }),
        m("div", G, [
          m("div", J, D(e.mainString), 1),
          m("div", Q, D(e.despString), 1)
        ])
      ], 34)) : V("", !0)
    ]),
    _: 1
  });
}
const x = /* @__PURE__ */ F(O, [["render", X]]), Z = [x], ee = (e) => {
  Z.forEach((t) => {
    e.component("PopoutMessageBox", x);
  }), e.use(A);
}, oe = {
  install: ee,
  usePopoutMessage: j
}, M = document.createElement("style");
M.textContent = `#popout-message-box-list{position:fixed;top:3rem;right:0;z-index:99999;margin:.5rem;max-width:400px;max-height:calc(100vh - 3rem - 8px);overflow-x:hidden;overflow-y:auto}#popout-message-box-list::-webkit-scrollbar{width:4px}#popout-message-box-list .popout-message-box{min-width:10rem;max-width:25vw;cursor:pointer;opacity:.3;transition:all .7s}#popout-message-box-list .popout-message-box:first-child,#popout-message-box-list .popout-message-box:hover{opacity:1}#popout-message-box-list .popout-message-box .card{position:relative;display:flex;flex-direction:column;min-width:0;background-color:#fff;background-clip:border-box;border-radius:.375rem;max-height:100vh;box-shadow:2px 2px 2px 1px #0000001a;border:0;border-style:solid;border-width:0px;border-left-width:5px;transition:all .5s}#popout-message-box-list .popout-message-box .card.success{border-color:var(--bs-green, #198754)}#popout-message-box-list .popout-message-box .card.fail{border-color:var(--bs-red, #dc3545)}#popout-message-box-list .popout-message-box .card.info{border-color:#289dc9}#popout-message-box-list .popout-message-box .card.warning{border-color:var(--bs-warning, #ffc107)}#popout-message-box-list .popout-message-box .card.primary{border-color:var(--bs-primary, #0d6efd)}#popout-message-box-list .popout-message-box .card.debug{border-color:var(--bs-secondary, #6c757d)}#popout-message-box-list .popout-message-box .card{margin-bottom:8px}#popout-message-box-list .popout-message-box .card .card-body{flex:1 1 auto;padding:1rem}#popout-message-box-list .popout-message-box .card .card-body .card-title{font-size:1rem;font-weight:700;letter-spacing:.0125em;border:0;margin:0}#popout-message-box-list .popout-message-box .card .card-body .card-desp{font-size:.8rem;letter-spacing:.0125em;border:0;color:var(--bs-gray-500, #adb5bd)}#popout-message-box-list .when-create-leave-active,#popout-message-box-list .when-create-enter-active{transition:all .5s ease;transform:translate(0) translateY(0);margin-bottom:8px}#popout-message-box-list .when-create-enter-from{background-color:#0000;transform:translate(120%) translateY(0);height:0px;margin-bottom:0}#popout-message-box-list .when-create-leave-to{background-color:#0000;transform:translate(114%) translateY(-4px);height:0px;margin-bottom:0}#popout-message-box-list .time-mask{position:absolute;left:0;top:0;bottom:0;right:100%;background-color:#0000001a}#popout-message-box-list .time-mask.stop{animation-play-state:paused!important}@keyframes time_mask_anime{0%{right:100%}to{right:0%}}
`;
document.head.appendChild(M);
export {
  x as PopoutMessageBox,
  A as PopoutMessagePlugin,
  oe as default,
  j as usePopoutMessage
};
