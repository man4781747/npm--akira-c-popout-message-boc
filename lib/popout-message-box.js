import { ref as o, inject as u } from "vue";
import { notify as e } from "./popout-message-box-core.js";
const s = o(e.getCount()), r = o(e.getMaxItemNumber());
e.subscribe((t) => {
  s.value = t.count, r.value = t.maxItemNumber;
});
const a = {
  count: s,
  maxItemNumber: r
}, i = {
  success: e.success,
  error: e.error,
  info: e.info,
  warning: e.warning,
  debug: e.debug,
  primary: e.primary,
  setMaxItemNumber: e.setMaxItemNumber,
  getMaxItemNumber: e.getMaxItemNumber,
  status: a
}, n = Symbol("PopoutMessage"), m = {
  install: (t) => {
    t.provide(n, i);
  }
};
function c() {
  const t = u(n);
  if (!t)
    throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");
  return t;
}
const g = (t) => {
  t.use(m);
}, M = {
  install: g,
  usePopoutMessage: c
};
export {
  m as PopoutMessagePlugin,
  M as default,
  e as notify,
  c as usePopoutMessage
};
