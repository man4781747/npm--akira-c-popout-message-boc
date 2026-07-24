(function(a,o){typeof exports=="object"&&typeof module<"u"?o(exports,require("vue")):typeof define=="function"&&define.amd?define(["exports","vue"],o):(a=typeof globalThis<"u"?globalThis:a||self,o(a.PopoutMwessageBox={},a.Vue))})(this,(function(a,o){"use strict";const n=[];for(let e=0;e<256;++e)n.push((e+256).toString(16).slice(1));function v(e,t=0){return(n[e[t+0]]+n[e[t+1]]+n[e[t+2]]+n[e[t+3]]+"-"+n[e[t+4]]+n[e[t+5]]+"-"+n[e[t+6]]+n[e[t+7]]+"-"+n[e[t+8]]+n[e[t+9]]+"-"+n[e[t+10]]+n[e[t+11]]+n[e[t+12]]+n[e[t+13]]+n[e[t+14]]+n[e[t+15]]).toLowerCase()}let u;const T=new Uint8Array(16);function D(){if(!u){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");u=crypto.getRandomValues.bind(crypto)}return u(T)}const b={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function I(e,t,s){var d;if(b.randomUUID&&!e)return b.randomUUID();e=e||{};const i=e.random??((d=e.rng)==null?void 0:d.call(e))??D();if(i.length<16)throw new Error("Random bytes length must be >= 16");return i[6]=i[6]&15|64,i[8]=i[8]&63|128,v(i)}const h=Symbol("PopoutMessage");let c=null;function M(){if(!c)throw new Error("Root App 尚未初始化，請確認已使用 app.use(PopoutMessagePlugin)");return c}const x={install:e=>{e.provide(h,l),c=e}};function f(){const e=o.inject(h);if(!e)throw new Error("PopoutMessage service not provided via PopoutMessagePlugin.");return e}const E=o.ref(0);function P(){let e=document.getElementById("popout-message-box-list");return e||(e=document.createElement("div"),e.id="popout-message-box-list",document.body.appendChild(e)),e}const p=(e,t,s,i=5)=>{const d=P(),g=I(),r=document.createElement("div");r.id=g,r.className="popout-message-box";const w=o.createVNode(m,{eleID:g,messageType:e,mainString:t,despString:s||"",lifeTime:i});w.appContext=M()._context,o.render(w,r),d.appendChild(r),d.prepend(r)},l={success:(e,t,s)=>p("success",e,t,s),error:(e,t,s)=>p("fail",e,t,s),info:(e,t,s)=>p("info",e,t,s),warning:(e,t,s)=>p("warning",e,t,s),debug:(e,t,s)=>p("debug",e,t,s),primary:(e,t,s)=>p("primary",e,t,s),status:{count:E}},S=o.defineComponent({name:"PopoutMessageBox",props:{messageType:{type:String,required:!0},eleID:{type:String,required:!0},lifeTime:{type:Number,default:5},mainString:{type:String,required:!0},despString:{type:String,default:""}},data(){return{create:!1,delItem:null,startTime:-1,remaining:-1}},computed:{isAnimeStop(){return this.delItem===null}},mounted(){this.create=!0,setTimeout(()=>{this.getEleHeight()},100),this.remaining=this.lifeTime*1e3,this.startTime=Date.now(),this.delItem=window.setTimeout(()=>{this.delThisWindow()},this.remaining)},methods:{getEleHeight(){const e=document.getElementById(this.eleID);return!e||!e.children[0]?0:(e.children[0].style.height=`${e.offsetHeight}px`,e.offsetHeight)},delThisWindow(){this.stopDel();const e=document.getElementById(this.eleID);!e||!e.children[0]||(e.children[0].style.height="0px",this.create=!1,l.status.count.value>0&&(l.status.count.value-=1),setTimeout(()=>{e.remove()},2e3))},stopDel(){this.delItem!==null&&(clearTimeout(this.delItem),this.delItem=null,this.remaining-=Date.now()-this.startTime)},resumeDel(){this.startTime=Date.now(),this.delItem=window.setTimeout(()=>{this.delThisWindow()},this.remaining)}},created(){l.status.count.value+=1,console.log(l.status.count.value)},deactivated(){l.status.count.value>0&&(l.status.count.value-=1)}}),k=(e,t)=>{const s=e.__vccOpts||e;for(const[i,d]of t)s[i]=d;return s},C={class:"card-body"},B={class:"card-title"},U={class:"card-desp"};function V(e,t,s,i,d,g){return o.openBlock(),o.createBlock(o.Transition,{name:"when-create"},{default:o.withCtx(()=>[e.create?(o.openBlock(),o.createElementBlock("div",{key:0,class:o.normalizeClass(["card",e.messageType]),onMouseenter:t[0]||(t[0]=(...r)=>e.stopDel&&e.stopDel(...r)),onMouseleave:t[1]||(t[1]=(...r)=>e.resumeDel&&e.resumeDel(...r)),onClick:t[2]||(t[2]=(...r)=>e.delThisWindow&&e.delThisWindow(...r))},[o.createVNode(o.Transition,{name:"when-create"},{default:o.withCtx(()=>[o.createElementVNode("div",{class:o.normalizeClass(["time-mask",e.isAnimeStop?"stop":""]),style:o.normalizeStyle(`animation: time_mask_anime ${e.lifeTime}s linear forwards;`)},null,6)]),_:1}),o.createElementVNode("div",C,[o.createElementVNode("div",B,o.toDisplayString(e.mainString),1),o.createElementVNode("div",U,o.toDisplayString(e.despString),1)])],34)):o.createCommentVNode("",!0)]),_:1})}const m=k(S,[["render",V]]),N=[m],_={install:e=>{N.forEach(t=>{e.component("PopoutMessageBox",m)}),e.use(x)},usePopoutMessage:f},y=document.createElement("style");y.textContent=`:root {
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
`,document.head.appendChild(y),a.PopoutMessageBox=m,a.PopoutMessagePlugin=x,a.default=_,a.usePopoutMessage=f,Object.defineProperties(a,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
