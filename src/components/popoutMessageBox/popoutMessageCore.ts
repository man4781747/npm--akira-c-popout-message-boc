// 不依賴任何框架的通知核心：產生 DOM、動畫、計時、數量上限與狀態訂閱
// Framework-agnostic core: DOM, animation, timers, item limit and state subscription
import cssText from './popoutMessageBox.css?inline'

const CONTAINER_ID = 'popout-message-box-list'
const STYLE_ID = 'popout-message-box-style'
// 開始關閉後多久移除 DOM（需大於離場動畫時間）
const REMOVE_DELAY = 2000
// 進場後多久把卡片高度固定為實際高度（讓關閉時的高度收合有動畫）
const MEASURE_DELAY = 100

export type MessageType = 'success' | 'error' | 'info' | 'warning' | 'debug' | 'primary'

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface PopoutMessageOptions {
  /** 同時顯示的訊息上限，預設 10 */
  max?: number
  /** 未指定 lifeTime 時的顯示秒數，預設 5；0 代表不自動關閉 */
  duration?: number
  /** 顯示位置，預設 'top-right' */
  position?: Position
}

export interface MessageUpdate {
  mainString?: string
  despString?: string
  type?: MessageType
  /** 新的顯示秒數（0 代表不自動關閉）；不論是否指定，update 後都會重新計時 */
  lifeTime?: number
}

export interface MessageHandle {
  /** 立即開始關閉這則訊息 */
  close: () => void
  /** 修改這則訊息並重新計時；已開始關閉的訊息不會有任何變化 */
  update: (changes: MessageUpdate) => void
}

export interface PopoutMessageState {
  /** 目前顯示中（尚未開始關閉）的訊息數 */
  count: number
  /** 同時顯示的訊息上限 */
  maxItemNumber: number
}

export type PopoutMessageListener = (state: PopoutMessageState) => void

export interface PopoutMessageCore {
  /** lifeTime 單位為秒，省略時使用 duration 設定；0 代表不自動關閉 */
  success: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  error: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  info: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  warning: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  debug: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  primary: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle
  /** 關閉所有顯示中的訊息 */
  clear: () => void
  /** 修改設定，只套用有傳入的欄位；不合法的值拋出 RangeError */
  configure: (options: PopoutMessageOptions) => void
  getConfig: () => Required<PopoutMessageOptions>
  setMaxItemNumber: (max: number) => void
  getMaxItemNumber: () => number
  getCount: () => number
  /** 狀態變化時呼叫 listener，回傳取消訂閱的函數 */
  subscribe: (listener: PopoutMessageListener) => () => void
}

const POSITIONS: Position[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

// error() 對應的 class 沿用 popout-card--fail
const TYPE_CLASS: Record<MessageType, string> = {
  success: 'popout-card--success',
  error: 'popout-card--fail',
  info: 'popout-card--info',
  warning: 'popout-card--warning',
  debug: 'popout-card--debug',
  primary: 'popout-card--primary',
}

// 顯示中（尚未開始關閉）的訊息，最舊的在前
const openItems: MessageHandle[] = []
const listeners = new Set<PopoutMessageListener>()
const config: Required<PopoutMessageOptions> = {
  max: 10,
  duration: 5,
  position: 'top-right',
}

function assertMax(max: unknown) {
  if (!Number.isInteger(max) || (max as number) < 1) {
    throw new RangeError(`maxItemNumber 必須是大於等於 1 的整數，收到：${max}`)
  }
}

function assertSeconds(value: unknown, name: string) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} 必須是大於等於 0 的數字，收到：${value}`)
  }
}

function assertPosition(position: unknown) {
  if (!POSITIONS.includes(position as Position)) {
    throw new RangeError(`position 必須是 ${POSITIONS.join(' / ')} 其中之一，收到：${position}`)
  }
}

function assertType(type: unknown) {
  if (!Object.prototype.hasOwnProperty.call(TYPE_CLASS, type as string)) {
    throw new RangeError(`type 必須是 ${Object.keys(TYPE_CLASS).join(' / ')} 其中之一，收到：${type}`)
  }
}

function getState(): PopoutMessageState {
  return { count: openItems.length, maxItemNumber: config.max }
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

function applyPosition(container: HTMLElement) {
  container.className = `popout-position--${config.position}`
}

function ensureContainer(): HTMLElement {
  let container = document.getElementById(CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = CONTAINER_ID
    document.body.appendChild(container)
  }
  applyPosition(container)
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
  while (openItems.length > config.max) {
    openItems[0].close()
  }
}

function createMessage(
  messageType: MessageType,
  mainString: string,
  despString: string = '',
  lifeTime: number = config.duration
): MessageHandle {
  assertSeconds(lifeTime, 'lifeTime')
  ensureStyle()
  const container = ensureContainer()

  const box = createElement('popout-message-box')
  const card = createElement(`popout-card ${TYPE_CLASS[messageType]}`)
  const mask = createElement('popout-card__time-mask')
  const title = createElement('popout-card__title', mainString)
  const desp = createElement('popout-card__desp', despString)
  const body = createElement('popout-card__body')
  body.append(title, desp)
  card.append(mask, body)
  box.append(card)
  container.prepend(box) // DOM 中新通知在最前面（下方位置時由 CSS 反轉成顯示在最下面）

  let currentType = messageType
  let remaining = 0
  let startTime = 0
  let timer: number | null = null
  let autoClose = true
  let hovering = false
  let measured = false
  let closing = false

  const stopTimer = () => {
    if (timer === null) return
    clearTimeout(timer)
    timer = null
    remaining -= Date.now() - startTime
  }

  const startTimer = () => {
    startTime = Date.now()
    timer = window.setTimeout(close, remaining)
  }

  // 以 seconds 秒重新開始倒數（0 代表不自動關閉），並重播倒數遮罩動畫
  const restartCountdown = (seconds: number) => {
    if (timer !== null) clearTimeout(timer)
    timer = null
    autoClose = seconds > 0
    remaining = seconds * 1000
    mask.hidden = !autoClose
    mask.style.animation = 'none'
    void mask.offsetWidth // 強制 reflow，讓同名動畫能重新開始
    mask.style.animation = autoClose ? `popout-time-mask ${seconds}s linear forwards` : ''
    mask.classList.toggle('popout-card__time-mask--stop', hovering)
    if (autoClose && !hovering) startTimer()
  }

  // 把卡片高度固定為實際高度，讓關閉時的高度收合有動畫
  const measure = () => {
    card.style.height = ''
    card.style.height = `${card.offsetHeight}px`
    measured = true
  }

  const pause = () => {
    hovering = true
    if (timer === null) return
    stopTimer()
    mask.classList.add('popout-card__time-mask--stop')
  }

  const resume = () => {
    hovering = false
    // 已在關閉中、已在計時、或不自動關閉時都不重新計時
    if (closing || timer !== null || !autoClose) return
    startTimer()
    mask.classList.remove('popout-card__time-mask--stop')
  }

  const close = () => {
    if (closing) return
    closing = true
    stopTimer()
    openItems.splice(openItems.indexOf(handle), 1)
    card.style.height = '0px'
    playTransition(card, 'leave')
    emitChange()
    setTimeout(() => box.remove(), REMOVE_DELAY)
  }

  const update = (changes: MessageUpdate) => {
    if (closing) return
    if (changes.type !== undefined) assertType(changes.type)
    if (changes.lifeTime !== undefined) assertSeconds(changes.lifeTime, 'lifeTime')

    if (changes.mainString !== undefined) title.textContent = changes.mainString
    if (changes.despString !== undefined) desp.textContent = changes.despString
    if (changes.type !== undefined) {
      card.classList.replace(TYPE_CLASS[currentType], TYPE_CLASS[changes.type])
      currentType = changes.type
    }
    if (changes.lifeTime !== undefined) lifeTime = changes.lifeTime
    // 進場量測前不量（進場動畫中高度為 0），之後內容變動需重新量測
    if (measured) measure()
    restartCountdown(lifeTime)
  }

  const handle: MessageHandle = { close, update }

  card.addEventListener('mouseenter', pause)
  card.addEventListener('mouseleave', resume)
  card.addEventListener('click', close)

  playTransition(card, 'enter')
  setTimeout(() => {
    if (!closing) measure()
  }, MEASURE_DELAY)
  restartCountdown(lifeTime)

  openItems.push(handle)
  removeOverflowItems()
  emitChange()
  return handle
}

/** 通知服務（單例），所有入口共用同一份狀態 */
export const notify: PopoutMessageCore = {
  success: (mainString, despString, lifeTime) =>
    createMessage('success', mainString, despString, lifeTime),
  error: (mainString, despString, lifeTime) =>
    createMessage('error', mainString, despString, lifeTime),
  info: (mainString, despString, lifeTime) =>
    createMessage('info', mainString, despString, lifeTime),
  warning: (mainString, despString, lifeTime) =>
    createMessage('warning', mainString, despString, lifeTime),
  debug: (mainString, despString, lifeTime) =>
    createMessage('debug', mainString, despString, lifeTime),
  primary: (mainString, despString, lifeTime) =>
    createMessage('primary', mainString, despString, lifeTime),
  clear: () => {
    ;[...openItems].forEach((item) => item.close())
  },
  configure: (options) => {
    // 全部驗證通過才套用，避免只套用一部分
    if (options.max !== undefined) assertMax(options.max)
    if (options.duration !== undefined) assertSeconds(options.duration, 'duration')
    if (options.position !== undefined) assertPosition(options.position)

    if (options.duration !== undefined) config.duration = options.duration
    if (options.position !== undefined) {
      config.position = options.position
      // 容器尚未建立（或在 SSR 中）時，等第一次顯示訊息才套用
      const container = typeof document !== 'undefined' ? document.getElementById(CONTAINER_ID) : null
      if (container) applyPosition(container)
    }
    if (options.max !== undefined) {
      config.max = options.max
      removeOverflowItems()
    }
    emitChange()
  },
  getConfig: () => ({ ...config }),
  setMaxItemNumber: (max) => notify.configure({ max }),
  getMaxItemNumber: () => config.max,
  getCount: () => openItems.length,
  subscribe: (listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
