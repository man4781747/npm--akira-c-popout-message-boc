// 不依賴任何框架的通知核心：產生 DOM、動畫、計時、數量上限與狀態訂閱
// Framework-agnostic core: DOM, animation, timers, item limit and state subscription
import cssText from './popoutMessageBox.css?inline'

const CONTAINER_ID = 'popout-message-box-list'
const STYLE_ID = 'popout-message-box-style'
// 開始關閉後多久移除 DOM（需大於離場動畫時間）
const REMOVE_DELAY = 2000
// 進場後多久把卡片高度固定為實際高度（讓關閉時的高度收合有動畫）
const MEASURE_DELAY = 100

export type MessageType = 'success' | 'fail' | 'info' | 'warning' | 'primary' | 'debug'

export interface PopoutMessageState {
  /** 目前顯示中（尚未開始關閉）的訊息數 */
  count: number
  /** 同時顯示的訊息上限 */
  maxItemNumber: number
}

export type PopoutMessageListener = (state: PopoutMessageState) => void

export interface PopoutMessageCore {
  success: (mainString: string, despString?: string, lifeTime?: number) => void
  error: (mainString: string, despString?: string, lifeTime?: number) => void
  info: (mainString: string, despString?: string, lifeTime?: number) => void
  warning: (mainString: string, despString?: string, lifeTime?: number) => void
  debug: (mainString: string, despString?: string, lifeTime?: number) => void
  primary: (mainString: string, despString?: string, lifeTime?: number) => void
  setMaxItemNumber: (max: number) => void
  getMaxItemNumber: () => number
  getCount: () => number
  /** 狀態變化時呼叫 listener，回傳取消訂閱的函數 */
  subscribe: (listener: PopoutMessageListener) => () => void
}

interface MessageItem {
  close: () => void
}

// 顯示中（尚未開始關閉）的訊息，最舊的在前
const openItems: MessageItem[] = []
const listeners = new Set<PopoutMessageListener>()
let maxItemNumber = 10

function getState(): PopoutMessageState {
  return { count: openItems.length, maxItemNumber }
}

function emitChange() {
  const state = getState()
  listeners.forEach((listener) => listener(state))
}

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = cssText
  document.head.appendChild(style)
}

function ensureContainer(): HTMLElement {
  let container = document.getElementById(CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = CONTAINER_ID
    document.body.appendChild(container)
  }
  return container
}

function createElement(className: string, text?: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = className
  if (text !== undefined) el.textContent = text
  return el
}

// 與 Vue <Transition> 相同：等兩個 frame 再切換 class，確保起始狀態已被瀏覽器套用
function nextFrame(callback: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

// 依 Vue <Transition> 的 class 命名規則播放 popout-slide 進場/離場動畫
function playTransition(el: HTMLElement, phase: 'enter' | 'leave') {
  const from = `popout-slide-${phase}-from`
  const active = `popout-slide-${phase}-active`
  const to = `popout-slide-${phase}-to`
  el.classList.add(from, active)
  nextFrame(() => {
    el.classList.remove(from)
    el.classList.add(to)
    if (phase === 'enter') {
      el.addEventListener('transitionend', () => el.classList.remove(active, to), { once: true })
    }
  })
}

// 超過上限時，從最舊的開始關閉
function removeOverflowItems() {
  while (openItems.length > maxItemNumber) {
    openItems[0].close()
  }
}

function createMessage(
  messageType: MessageType,
  mainString: string,
  despString: string = '',
  lifeTime: number = 5
) {
  ensureStyle()
  const container = ensureContainer()

  const box = createElement('popout-message-box')
  const card = createElement(`popout-card popout-card--${messageType}`)
  const mask = createElement('popout-card__time-mask')
  mask.style.animation = `popout-time-mask ${lifeTime}s linear forwards`
  const body = createElement('popout-card__body')
  body.append(
    createElement('popout-card__title', mainString),
    createElement('popout-card__desp', despString)
  )
  card.append(mask, body)
  box.append(card)
  container.prepend(box) // 新通知出現在最上方

  let remaining = lifeTime * 1000
  let startTime = Date.now()
  let timer: number | null = null
  let closing = false

  const pause = () => {
    if (timer === null) return
    clearTimeout(timer)
    timer = null
    remaining -= Date.now() - startTime
    mask.classList.add('popout-card__time-mask--stop')
  }

  const resume = () => {
    // 已在關閉中就不再重新計時，避免重複關閉
    if (closing || timer !== null) return
    startTime = Date.now()
    timer = window.setTimeout(close, remaining)
    mask.classList.remove('popout-card__time-mask--stop')
  }

  const close = () => {
    if (closing) return
    closing = true
    pause()
    openItems.splice(openItems.indexOf(item), 1)
    card.style.height = '0px'
    playTransition(card, 'leave')
    emitChange()
    setTimeout(() => box.remove(), REMOVE_DELAY)
  }

  const item: MessageItem = { close }

  card.addEventListener('mouseenter', pause)
  card.addEventListener('mouseleave', resume)
  card.addEventListener('click', close)

  playTransition(card, 'enter')
  setTimeout(() => {
    if (!closing) card.style.height = `${box.offsetHeight}px`
  }, MEASURE_DELAY)
  timer = window.setTimeout(close, remaining)

  openItems.push(item)
  removeOverflowItems()
  emitChange()
}

/** 通知服務（單例），所有入口共用同一份狀態 */
export const notify: PopoutMessageCore = {
  success: (mainString, despString, lifeTime) =>
    createMessage('success', mainString, despString, lifeTime),
  error: (mainString, despString, lifeTime) =>
    createMessage('fail', mainString, despString, lifeTime),
  info: (mainString, despString, lifeTime) =>
    createMessage('info', mainString, despString, lifeTime),
  warning: (mainString, despString, lifeTime) =>
    createMessage('warning', mainString, despString, lifeTime),
  debug: (mainString, despString, lifeTime) =>
    createMessage('debug', mainString, despString, lifeTime),
  primary: (mainString, despString, lifeTime) =>
    createMessage('primary', mainString, despString, lifeTime),
  setMaxItemNumber: (max) => {
    if (!Number.isInteger(max) || max < 1) {
      throw new RangeError(`maxItemNumber 必須是大於等於 1 的整數，收到：${max}`)
    }
    maxItemNumber = max
    removeOverflowItems()
    emitChange()
  },
  getMaxItemNumber: () => maxItemNumber,
  getCount: () => openItems.length,
  subscribe: (listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
