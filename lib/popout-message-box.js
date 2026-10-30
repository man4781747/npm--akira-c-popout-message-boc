import { ref as s, inject as i } from "vue";
import { notify as e } from "./popout-message-box-core.js";
const n = s(e.getCount()), u = s(e.getMaxItemNumber());
e.subscribe((o) => {
  n.value = o.count, u.value = o.maxItemNumber;
});
const c = {
  count: n,
  maxItemNumber: u
}, r = {
  success: e.success,
  error: e.error,
  info: e.info,
  warning: e.warning,
  debug: e.debug,
  primary: e.primary,
  clear: e.clear,
  configure: e.configure,
  setMaxItemNumber: e.setMaxItemNumber,
  getMaxItemNumber: e.getMaxItemNumber,
  status: c
}, a = Symbol("PopoutMessage"), m = {
  install: (o, t) => {
    t && r.configure(t), o.provide(a, r);
  }
};
function g() {
  const o = i(a);
  if (!o)
    throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");
  return o;
}
const f = (o, t) => {
  o.use(m, t);
}, l = {
  install: f,
  usePopoutMessage: g
};
export {
  m as PopoutMessagePlugin,
  l as default,
  e as notify,
  g as usePopoutMessage
};
