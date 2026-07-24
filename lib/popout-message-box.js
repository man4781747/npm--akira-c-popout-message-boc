import { inject as T, ref as k, createVNode as v, render as E, defineComponent as S, openBlock as b, createBlock as M, Transition as h, withCtx as x, createElementBlock as P, normalizeClass as y, createElementVNode as l, normalizeStyle as C, toDisplayString as f, createCommentVNode as U } from "vue";
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
  const r = e.random ?? ((i = e.rng) == null ? void 0 : i.call(e)) ?? V();
  if (r.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, B(r);
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
const d = (e, t, o, r = 5) => {
  const i = A(), p = $(), n = document.createElement("div");
  n.id = p, n.className = "popout-message-box";
  const g = v(c, {
    eleID: p,
    messageType: e,
    mainString: t,
    despString: o || "",
    // Ensure despString is not undefined
    lifeTime: r
  });
  g.appContext = z()._context, E(g, n), i.appendChild(n), i.prepend(n);
}, j = {
  count: W
}, a = {
  success: (e, t, o) => d("success", e, t, o),
  error: (e, t, o) => d("fail", e, t, o),
  // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (e, t, o) => d("info", e, t, o),
  warning: (e, t, o) => d("warning", e, t, o),
  debug: (e, t, o) => d("debug", e, t, o),
  primary: (e, t, o) => d("primary", e, t, o),
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
}), X = (e, t) => {
  const o = e.__vccOpts || e;
  for (const [r, i] of t)
    o[r] = i;
  return o;
}, Y = { class: "card-body" }, K = { class: "card-title" }, L = { class: "card-desp" };
function O(e, t, o, r, i, p) {
  return b(), M(h, { name: "when-create" }, {
    default: x(() => [
      e.create ? (b(), P("div", {
        key: 0,
        class: y(["card", e.messageType]),
        onMouseenter: t[0] || (t[0] = (...n) => e.stopDel && e.stopDel(...n)),
        onMouseleave: t[1] || (t[1] = (...n) => e.resumeDel && e.resumeDel(...n)),
        onClick: t[2] || (t[2] = (...n) => e.delThisWindow && e.delThisWindow(...n))
      }, [
        v(h, { name: "when-create" }, {
          default: x(() => [
            l("div", {
              class: y(["time-mask", e.isAnimeStop ? "stop" : ""]),
              style: C(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)
            }, null, 6)
          ]),
          _: 1
        }),
        l("div", Y, [
          l("div", K, f(e.mainString), 1),
          l("div", L, f(e.despString), 1)
        ])
      ], 34)) : U("", !0)
    ]),
    _: 1
  });
}
const c = /* @__PURE__ */ X(q, [["render", O]]), F = [c], G = (e) => {
  F.forEach((t) => {
    e.component("PopoutMessageBox", c);
  }), e.use(H);
}, Q = {
  install: G,
  usePopoutMessage: N
}, I = document.createElement("style");
I.textContent = `:root {
  --bs-white: #fff;
  --bs-green: #198754;
  --bs-red: #dc3545;
  --bs-warning: #ffc107;
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-gray-500: #adb5bd;
}

#popout-message-box-list {
  position: fixed;
  top: 3rem;
  right: 0;
  z-index: 99999;
  margin: 0.5rem;
  max-width: 400px;
  max-height: calc(100vh - 3rem - 8px);
  overflow-x: hidden;
  overflow-y: auto;
}

#popout-message-box-list::-webkit-scrollbar {
  width: 4px;
}

#popout-message-box-list .popout-message-box {
  min-width: 10rem;
  max-width: 25vw;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.7s;
}

#popout-message-box-list .popout-message-box:first-child,
#popout-message-box-list .popout-message-box:hover {
  opacity: 1;
}

#popout-message-box-list .popout-message-box .card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.375rem;
  max-height: 100vh;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border: 0;
  border-style: solid;
  border-width: 0;
  border-left-width: 5px;
  margin-bottom: 8px;
  transition: all 0.5s;
}

#popout-message-box-list .popout-message-box .card.success {
  border-color: var(--bs-green);
}

#popout-message-box-list .popout-message-box .card.fail {
  border-color: var(--bs-red);
}

#popout-message-box-list .popout-message-box .card.info {
  border-color: #289dc9;
}

#popout-message-box-list .popout-message-box .card.warning {
  border-color: var(--bs-warning);
}

#popout-message-box-list .popout-message-box .card.primary {
  border-color: var(--bs-primary);
}

#popout-message-box-list .popout-message-box .card.debug {
  border-color: var(--bs-secondary);
}

#popout-message-box-list .popout-message-box .card .card-body {
  flex: 1 1 auto;
  padding: 1rem;
}

#popout-message-box-list .popout-message-box .card .card-body .card-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.0125em;
  border: 0;
  margin: 0;
}

#popout-message-box-list .popout-message-box .card .card-body .card-desp {
  font-size: 0.8rem;
  letter-spacing: 0.0125em;
  border: 0;
  color: var(--bs-gray-500);
}

#popout-message-box-list .when-create-leave-active,
#popout-message-box-list .when-create-enter-active {
  transition: all 0.5s ease;
  transform: translateX(0) translateY(0);
  margin-bottom: 8px;
}

#popout-message-box-list .when-create-enter-from {
  background-color: rgba(0, 0, 0, 0);
  transform: translateX(120%) translateY(0);
  height: 0;
  margin-bottom: 0;
}

#popout-message-box-list .when-create-leave-to {
  background-color: rgba(0, 0, 0, 0);
  transform: translateX(114%) translateY(-4px);
  height: 0;
  margin-bottom: 0;
}

#popout-message-box-list .time-mask {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 100%;
  background-color: rgba(0, 0, 0, 0.1);
}

#popout-message-box-list .time-mask.stop {
  animation-play-state: paused !important;
}

@keyframes time_mask_anime {
  from {
    right: 100%;
  }

  to {
    right: 0;
  }
}
`;
document.head.appendChild(I);
export {
  c as PopoutMessageBox,
  H as PopoutMessagePlugin,
  Q as default,
  N as usePopoutMessage
};
