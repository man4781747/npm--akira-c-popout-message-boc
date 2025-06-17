import { ref as T, createVNode as I, render as S, defineComponent as b, createBlock as E, openBlock as h, Transition as y, withCtx as w, createElementBlock as M, createCommentVNode as U, normalizeClass as f, createElementVNode as l, normalizeStyle as x, toDisplayString as v } from "vue";
const o = [];
for (let e = 0; e < 256; ++e)
  o.push((e + 256).toString(16).slice(1));
function B(e, t = 0) {
  return (o[e[t + 0]] + o[e[t + 1]] + o[e[t + 2]] + o[e[t + 3]] + "-" + o[e[t + 4]] + o[e[t + 5]] + "-" + o[e[t + 6]] + o[e[t + 7]] + "-" + o[e[t + 8]] + o[e[t + 9]] + "-" + o[e[t + 10]] + o[e[t + 11]] + o[e[t + 12]] + o[e[t + 13]] + o[e[t + 14]] + o[e[t + 15]]).toLowerCase();
}
let m;
const C = new Uint8Array(16);
function P() {
  if (!m) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    m = crypto.getRandomValues.bind(crypto);
  }
  return m(C);
}
const k = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), D = { randomUUID: k };
function R(e, t, n) {
  var r;
  if (D.randomUUID && !e)
    return D.randomUUID();
  e = e || {};
  const s = e.random ?? ((r = e.rng) == null ? void 0 : r.call(e)) ?? P();
  if (s.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, B(s);
}
const V = Symbol("PopoutMessage");
let c = null;
function $() {
  if (!c)
    throw new Error("Root App 尚未初始化，請確認已使用 app.use(PopoutMessagePlugin)");
  return c;
}
const H = {
  install: (e) => {
    e.provide(V, a), c = e;
  }
}, N = T(0);
function W() {
  let e = document.getElementById("popout-message-box-list");
  return e || (e = document.createElement("div"), e.id = "popout-message-box-list", document.body.appendChild(e)), e;
}
const u = (e, t, n, s = 5) => {
  const r = W(), d = R(), i = document.createElement("div");
  i.id = d, i.className = "popout-message-box";
  const g = I(p, {
    eleID: d,
    messageType: e,
    mainString: t,
    despString: n || "",
    // Ensure despString is not undefined
    lifeTime: s
  });
  g.appContext = $()._context, S(g, i), r.appendChild(i), r.prepend(i);
}, A = {
  count: N
}, a = {
  success: (e, t, n) => u("success", e, t, n),
  error: (e, t, n) => u("fail", e, t, n),
  // 'fail' was used in popoutMessageBox.vue styling & old index.ts
  info: (e, t, n) => u("info", e, t, n),
  warning: (e, t, n) => u("warning", e, t, n),
  debug: (e, t, n) => u("debug", e, t, n),
  primary: (e, t, n) => u("primary", e, t, n),
  status: A
}, _ = b({
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
}), q = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, j = { class: "card-body" }, z = { class: "card-title" }, K = { class: "card-desp" };
function L(e, t, n, s, r, d) {
  return h(), E(y, { name: "when-create" }, {
    default: w(() => [
      e.create ? (h(), M("div", {
        key: 0,
        class: f(["card", e.messageType]),
        onMouseenter: t[0] || (t[0] = (...i) => e.stopDel && e.stopDel(...i)),
        onMouseleave: t[1] || (t[1] = (...i) => e.resumeDel && e.resumeDel(...i)),
        onClick: t[2] || (t[2] = (...i) => e.delThisWindow && e.delThisWindow(...i))
      }, [
        I(y, { name: "when-create" }, {
          default: w(() => [
            l("div", {
              class: f(["time-mask", e.isAnimeStop ? "stop" : ""]),
              style: x(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)
            }, null, 6)
          ]),
          _: 1
        }),
        l("div", j, [
          l("div", z, v(e.mainString), 1),
          l("div", K, v(e.despString), 1)
        ])
      ], 34)) : U("", !0)
    ]),
    _: 1
  });
}
const p = /* @__PURE__ */ q(_, [["render", L]]), O = [p], F = (e) => {
  O.forEach((t) => {
    e.component("PopoutMessageBox", p);
  }), e.use(H);
}, J = {
  install: F
};
export {
  p as PopoutMessageBox,
  H as PopoutMessagePlugin,
  J as default
};
