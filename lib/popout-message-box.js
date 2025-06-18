import { inject as S, ref as b, createVNode as I, render as E, defineComponent as M, createBlock as P, openBlock as h, Transition as y, withCtx as f, createElementBlock as U, createCommentVNode as x, normalizeClass as w, createElementVNode as l, normalizeStyle as B, toDisplayString as v } from "vue";
const o = [];
for (let e = 0; e < 256; ++e)
  o.push((e + 256).toString(16).slice(1));
function C(e, t = 0) {
  return (o[e[t + 0]] + o[e[t + 1]] + o[e[t + 2]] + o[e[t + 3]] + "-" + o[e[t + 4]] + o[e[t + 5]] + "-" + o[e[t + 6]] + o[e[t + 7]] + "-" + o[e[t + 8]] + o[e[t + 9]] + "-" + o[e[t + 10]] + o[e[t + 11]] + o[e[t + 12]] + o[e[t + 13]] + o[e[t + 14]] + o[e[t + 15]]).toLowerCase();
}
let c;
const k = new Uint8Array(16);
function R() {
  if (!c) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    c = crypto.getRandomValues.bind(crypto);
  }
  return c(k);
}
const V = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), D = { randomUUID: V };
function $(e, t, n) {
  var r;
  if (D.randomUUID && !e)
    return D.randomUUID();
  e = e || {};
  const s = e.random ?? ((r = e.rng) == null ? void 0 : r.call(e)) ?? R();
  if (s.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, C(s);
}
const T = Symbol("PopoutMessage");
let m = null;
function H() {
  if (!m)
    throw new Error("Root App 尚未初始化，請確認已使用 app.use(PopoutMessagePlugin)");
  return m;
}
const N = {
  install: (e) => {
    e.provide(T, u), m = e;
  }
};
function W() {
  const e = S(T);
  if (!e)
    throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");
  return e;
}
const A = b(0);
function _() {
  let e = document.getElementById("popout-message-box-list");
  return e || (e = document.createElement("div"), e.id = "popout-message-box-list", document.body.appendChild(e)), e;
}
const a = (e, t, n, s = 5) => {
  const r = _(), d = $(), i = document.createElement("div");
  i.id = d, i.className = "popout-message-box";
  const g = I(p, {
    eleID: d,
    messageType: e,
    mainString: t,
    despString: n || "",
    // Ensure despString is not undefined
    lifeTime: s
  });
  g.appContext = H()._context, E(g, i), r.appendChild(i), r.prepend(i);
}, j = {
  count: A
}, u = {
  success: (e, t, n) => a("success", e, t, n),
  error: (e, t, n) => a("fail", e, t, n),
  // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (e, t, n) => a("info", e, t, n),
  warning: (e, t, n) => a("warning", e, t, n),
  debug: (e, t, n) => a("debug", e, t, n),
  primary: (e, t, n) => a("primary", e, t, n),
  status: j
}, q = M({
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
      !e || !e.children[0] || (e.children[0].style.height = "0px", this.create = !1, u.status.count.value > 0 && (u.status.count.value -= 1), setTimeout(() => {
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
    u.status.count.value += 1, console.log(u.status.count.value);
  },
  deactivated() {
    u.status.count.value > 0 && (u.status.count.value -= 1);
  }
}), z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, K = { class: "card-body" }, L = { class: "card-title" }, O = { class: "card-desp" };
function F(e, t, n, s, r, d) {
  return h(), P(y, { name: "when-create" }, {
    default: f(() => [
      e.create ? (h(), U("div", {
        key: 0,
        class: w(["card", e.messageType]),
        onMouseenter: t[0] || (t[0] = (...i) => e.stopDel && e.stopDel(...i)),
        onMouseleave: t[1] || (t[1] = (...i) => e.resumeDel && e.resumeDel(...i)),
        onClick: t[2] || (t[2] = (...i) => e.delThisWindow && e.delThisWindow(...i))
      }, [
        I(y, { name: "when-create" }, {
          default: f(() => [
            l("div", {
              class: w(["time-mask", e.isAnimeStop ? "stop" : ""]),
              style: B(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)
            }, null, 6)
          ]),
          _: 1
        }),
        l("div", K, [
          l("div", L, v(e.mainString), 1),
          l("div", O, v(e.despString), 1)
        ])
      ], 34)) : x("", !0)
    ]),
    _: 1
  });
}
const p = /* @__PURE__ */ z(q, [["render", F]]), G = [p], J = (e) => {
  G.forEach((t) => {
    e.component("PopoutMessageBox", p);
  }), e.use(N);
}, X = {
  install: J,
  usePopoutMessage: W
};
export {
  p as PopoutMessageBox,
  N as PopoutMessagePlugin,
  X as default,
  W as usePopoutMessage
};
