<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  usePopoutMessage,
  notify as coreNotify,
  type MessageHandle,
  type MessageType,
  type Position,
} from 'akira-c-popout-message-box'
import pkg from '../package.json'

const notify = usePopoutMessage()

// ---------------------------------------------------------------------------
// 語言
// ---------------------------------------------------------------------------

type Lang = 'en' | 'zh'
const LANG_KEY = 'popout-demo-lang'

const messages = {
  en: {
    tagline: 'Lightweight popup notifications for plain JS and Vue 3.',
    badges: ['No runtime dependencies', 'Vue 3 optional', 'TypeScript types'],
    nav: { playground: 'Playground', usage: 'Install & usage', api: 'API' },
    playground: {
      title: 'Playground',
      intro: 'Every button calls the real package. The code for your last action is shown on the right.',
      message: 'Show a message',
      mainString: 'mainString',
      despString: 'despString',
      lifeTime: 'lifeTime (seconds)',
      lifeTimeHint: 'Leave empty to use duration. 0 = stays until clicked or closed.',
      settings: 'Settings — configure()',
      settingsHint: 'At the bottom, new messages appear at the bottom.',
      position: 'position',
      screen: 'screen',
      max: 'max',
      duration: 'duration (seconds)',
      task: 'Message handle — update() / close()',
      taskHint: 'Create a message that stays open, then update or close it.',
      start: 'Start upload',
      finish: 'update → success',
      fail: 'update → error',
      close: 'close()',
      clear: 'clear()',
      clearHint: 'Close every visible message.',
      status: 'Status',
      visible: 'Visible',
      limit: 'max',
      lastCode: 'Code for your last action',
      placeholder: '// Click any button on the left',
    },
    defaults: { main: 'Hello!', desp: 'This is a description' },
    taskText: {
      uploading: 'Uploading…',
      wait: 'Please wait',
      done: 'Upload complete',
      doneDesp: 'Closes in 3 seconds',
      failed: 'Upload failed',
      failedDesp: 'Please try again',
    },
    usage: {
      title: 'Install & usage',
      intro: 'One package, two entries: the Vue plugin, and /core for plain JS or any other framework. Both share the same state.',
      install: 'Install',
      tabs: { vue: 'Vue 3', core: 'Plain JS / other frameworks', script: '<script> tag' },
      setup: 'Register',
      use: 'Use',
      vueSetup: `import { createApp } from 'vue'
import PopoutMessagePlugin from 'akira-c-popout-message-box'

createApp(App)
  .use(PopoutMessagePlugin, { max: 5, duration: 3, position: 'top-right' }) // options are optional
  .mount('#app')`,
      vueUse: `<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()
notify.success('Saved', 'Your changes have been saved')

// Reactive state for templates
// notify.status.count.value / notify.status.maxItemNumber.value
<\/script>

// Outside components (axios interceptors, router guards…)
import { notify } from 'akira-c-popout-message-box'
notify.error('Request failed', error.message)`,
      coreUse: `import { notify } from 'akira-c-popout-message-box/core'

notify.configure({ position: 'bottom-right' })
notify.success('Saved', 'Your changes have been saved')

// Keep a handle to change the message later
const task = notify.info('Uploading…', '', 0) // 0 = stays until closed
task.update({ type: 'success', mainString: 'Upload complete', lifeTime: 3 })

// React to state changes
const off = notify.subscribe(({ count, maxItemNumber }) => {
  badge.textContent = count
})`,
      scriptUse: `<!-- Without Vue -->
<script src="https://unpkg.com/akira-c-popout-message-box@${pkg.version}/lib/popout-message-box-core.umd.cjs"><\/script>
<script>
  PopoutMessageBox.notify.success('Saved', 'Your changes have been saved')
<\/script>

<!-- With Vue (load Vue first) -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
<script src="https://unpkg.com/akira-c-popout-message-box@${pkg.version}/lib/popout-message-box.umd.cjs"><\/script>
<script>
  Vue.createApp(App).use(PopoutMessageBoxVue.default).mount('#app')
<\/script>`,
    },
    api: {
      title: 'API reference',
      intro: 'Available on both entries unless noted. Invalid values throw a RangeError.',
      methods: 'Methods',
      options: 'Options — configure() / app.use(plugin, options)',
      handle: 'Message handle',
      classes: 'CSS classes for custom styles',
      head: { name: 'Name', desc: 'Description', default: 'Default' },
      methodRows: [
        ['success / error / info / warning / debug / primary(mainString, despString?, lifeTime?)', 'Show a message. lifeTime is in seconds (defaults to duration; 0 = stays until closed). Returns a handle.'],
        ['configure(options)', 'Change max / duration / position. Only the given fields are applied.'],
        ['getConfig()', 'Current options (on notify).'],
        ['clear()', 'Close every visible message.'],
        ['setMaxItemNumber(max) / getMaxItemNumber()', 'Same as configure({ max }) / read max.'],
        ['getCount()', 'Number of visible messages (on notify).'],
        ['subscribe(listener)', 'Called with { count, maxItemNumber } on every change; returns an unsubscribe function (on notify).'],
        ['status.count / status.maxItemNumber', 'Vue refs for templates (from usePopoutMessage()).'],
      ],
      optionRows: [
        ['max', '10', 'Maximum shown at the same time; the oldest close first.'],
        ['duration', '5', 'Seconds a message stays when lifeTime is not given. 0 = stays until closed.'],
        ['position', "'top-right'", "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'"],
      ],
      handleRows: [
        ['close()', 'Start closing this message. Calling it again does nothing.'],
        ['update({ mainString?, despString?, type?, lifeTime? })', 'Change the given fields and restart the countdown. Does nothing once the message is closing.'],
      ],
      classRows: [
        ['#popout-message-box-list', 'Container; also has .popout-position--{position}'],
        ['.popout-message-box', 'Wrapper of one message'],
        ['.popout-card', 'Message card'],
        ['.popout-card--success / --fail / --info / --warning / --primary / --debug', 'Message type (error uses --fail)'],
        ['.popout-card__body / __title / __desp', 'Content area / main text / description'],
        ['.popout-card__time-mask(--stop)', 'Countdown mask (paused while hovered)'],
      ],
    },
    footer: 'MIT License',
  },
  zh: {
    tagline: '輕量的彈出訊息通知，原生 JS 與 Vue 3 都能用。',
    badges: ['無執行期依賴', 'Vue 3 可選', '附 TypeScript 型別'],
    nav: { playground: '互動示範', usage: '安裝與用法', api: 'API' },
    playground: {
      title: '互動示範',
      intro: '每個按鈕都呼叫真正的套件，右側會顯示最後一次操作對應的程式碼。',
      message: '顯示訊息',
      mainString: 'mainString（主要文字）',
      despString: 'despString（說明）',
      lifeTime: 'lifeTime（秒）',
      lifeTimeHint: '留空則使用 duration；0 代表不自動關閉，點擊或 close() 才關閉。',
      settings: '設定 — configure()',
      settingsHint: '放在下方時，新訊息出現在最下面。',
      position: 'position',
      screen: '畫面',
      max: 'max（上限）',
      duration: 'duration（秒）',
      task: '控制物件 — update() / close()',
      taskHint: '建立一則不自動關閉的訊息，之後再修改或關閉它。',
      start: '開始上傳',
      finish: 'update → 成功',
      fail: 'update → 失敗',
      close: 'close()',
      clear: 'clear()',
      clearHint: '關閉所有顯示中的訊息。',
      status: '狀態',
      visible: '顯示中',
      limit: '上限',
      lastCode: '最後一次操作的程式碼',
      placeholder: '// 點左側任一按鈕',
    },
    defaults: { main: '哈囉！', desp: '這是說明文字' },
    taskText: {
      uploading: '上傳中…',
      wait: '請稍候',
      done: '上傳完成',
      doneDesp: '3 秒後關閉',
      failed: '上傳失敗',
      failedDesp: '請再試一次',
    },
    usage: {
      title: '安裝與用法',
      intro: '同一個套件有兩個入口：Vue plugin，以及給原生 JS 或其他框架用的 /core，兩者共用同一份狀態。',
      install: '安裝',
      tabs: { vue: 'Vue 3', core: '原生 JS／其他框架', script: '<script> 標籤' },
      setup: '註冊',
      use: '使用',
      vueSetup: `import { createApp } from 'vue'
import PopoutMessagePlugin from 'akira-c-popout-message-box'

createApp(App)
  .use(PopoutMessagePlugin, { max: 5, duration: 3, position: 'top-right' }) // 設定可省略
  .mount('#app')`,
      vueUse: `<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()
notify.success('儲存成功', '資料已更新')

// 模板中可用的響應式狀態
// notify.status.count.value / notify.status.maxItemNumber.value
<\/script>

// 在元件以外（axios 攔截器、router guard…）
import { notify } from 'akira-c-popout-message-box'
notify.error('請求失敗', error.message)`,
      coreUse: `import { notify } from 'akira-c-popout-message-box/core'

notify.configure({ position: 'bottom-right' })
notify.success('儲存成功', '資料已更新')

// 保留控制物件，之後修改訊息
const task = notify.info('上傳中…', '', 0) // 0 = 不自動關閉
task.update({ type: 'success', mainString: '上傳完成', lifeTime: 3 })

// 訂閱狀態變化
const off = notify.subscribe(({ count, maxItemNumber }) => {
  badge.textContent = count
})`,
      scriptUse: `<!-- 不使用 Vue -->
<script src="https://unpkg.com/akira-c-popout-message-box@${pkg.version}/lib/popout-message-box-core.umd.cjs"><\/script>
<script>
  PopoutMessageBox.notify.success('儲存成功', '資料已更新')
<\/script>

<!-- 使用 Vue（需先載入 Vue） -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
<script src="https://unpkg.com/akira-c-popout-message-box@${pkg.version}/lib/popout-message-box.umd.cjs"><\/script>
<script>
  Vue.createApp(App).use(PopoutMessageBoxVue.default).mount('#app')
<\/script>`,
    },
    api: {
      title: 'API 速查',
      intro: '除特別註明外，兩個入口都可使用。不合法的值會拋出 RangeError。',
      methods: '方法',
      options: '設定 — configure() / app.use(plugin, options)',
      handle: '控制物件',
      classes: '自訂樣式用的 CSS class',
      head: { name: '名稱', desc: '說明', default: '預設' },
      methodRows: [
        ['success / error / info / warning / debug / primary(mainString, despString?, lifeTime?)', '顯示訊息。lifeTime 單位為秒（省略時用 duration；0 為不自動關閉），回傳控制物件。'],
        ['configure(options)', '修改 max / duration / position，只套用有傳入的欄位。'],
        ['getConfig()', '取得目前設定（notify 上）。'],
        ['clear()', '關閉所有顯示中的訊息。'],
        ['setMaxItemNumber(max) / getMaxItemNumber()', '等同 configure({ max }) / 讀取上限。'],
        ['getCount()', '顯示中的訊息數（notify 上）。'],
        ['subscribe(listener)', '每次變化時以 { count, maxItemNumber } 呼叫，回傳取消訂閱的函數（notify 上）。'],
        ['status.count / status.maxItemNumber', '可在模板中使用的 Vue ref（usePopoutMessage() 上）。'],
      ],
      optionRows: [
        ['max', '10', '同時顯示的上限，超過時從最舊的開始關閉。'],
        ['duration', '5', '未指定 lifeTime 時的顯示秒數；0 為不自動關閉。'],
        ['position', "'top-right'", "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'"],
      ],
      handleRows: [
        ['close()', '開始關閉這則訊息，重複呼叫沒有影響。'],
        ['update({ mainString?, despString?, type?, lifeTime? })', '修改有傳入的欄位並重新計時；訊息開始關閉後不會有變化。'],
      ],
      classRows: [
        ['#popout-message-box-list', '容器，另有 .popout-position--{position}'],
        ['.popout-message-box', '單則訊息的外層'],
        ['.popout-card', '訊息卡片'],
        ['.popout-card--success / --fail / --info / --warning / --primary / --debug', '訊息類型（error 使用 --fail）'],
        ['.popout-card__body / __title / __desp', '內容區 / 主要文字 / 說明文字'],
        ['.popout-card__time-mask(--stop)', '倒數遮罩（懸停時暫停）'],
      ],
    },
    footer: 'MIT 授權',
  },
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    // 無法使用 localStorage 時改用瀏覽器語言
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const lang = ref<Lang>(initialLang())
const t = computed(() => messages[lang.value])

watch(
  lang,
  (value, oldValue) => {
    try {
      localStorage.setItem(LANG_KEY, value)
    } catch {
      // 不記住語言也不影響使用
    }
    document.documentElement.lang = value === 'zh' ? 'zh-Hant-TW' : 'en'
    // 使用者沒改過預設文字時，跟著切換語言
    if (oldValue) {
      if (mainString.value === messages[oldValue].defaults.main) mainString.value = t.value.defaults.main
      if (despString.value === messages[oldValue].defaults.desp) despString.value = t.value.defaults.desp
    }
  },
  { immediate: true }
)

// ---------------------------------------------------------------------------
// 程式碼上色（Prism 由 main.ts 以手動模式載入）
// ---------------------------------------------------------------------------

function escapeHtml(code: string) {
  return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlight(code: string, language: 'javascript' | 'markup' = 'javascript') {
  const prism = (window as any).Prism
  if (!prism?.languages?.[language]) return escapeHtml(code)
  return prism.highlight(code, prism.languages[language], language)
}

// 產生程式碼中的字串常值
function quote(value: string) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

// ---------------------------------------------------------------------------
// 互動示範
// ---------------------------------------------------------------------------

const TYPES: MessageType[] = ['success', 'error', 'info', 'warning', 'debug', 'primary']
const POSITIONS: Position[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

const mainString = ref(t.value.defaults.main)
const despString = ref(t.value.defaults.desp)
const lifeTime = ref<number | ''>('')

const config = ref(coreNotify.getConfig())
const maxInput = ref<number | ''>(config.value.max)
const durationInput = ref<number | ''>(config.value.duration)

const lastCode = ref('')
const error = ref('')
let task: MessageHandle | null = null
const taskActive = ref(false)

const shownCode = computed(() => lastCode.value || t.value.playground.placeholder)

// 執行一個操作，並把對應的程式碼顯示在右側；拋出錯誤時顯示錯誤訊息
function run(code: string, action: () => void) {
  error.value = ''
  lastCode.value = code
  try {
    action()
  } catch (e) {
    const err = e as Error
    error.value = `${err.name}: ${err.message}`
  }
  config.value = coreNotify.getConfig()
}

function show(type: MessageType) {
  const main = mainString.value
  const desp = despString.value
  const hasLifeTime = lifeTime.value !== ''
  const args = [quote(main)]
  if (desp || hasLifeTime) args.push(quote(desp))
  if (hasLifeTime) args.push(String(lifeTime.value))
  run(`notify.${type}(${args.join(', ')})`, () => {
    notify[type](main, desp, hasLifeTime ? Number(lifeTime.value) : undefined)
  })
}

function setPosition(position: Position) {
  run(`notify.configure({ position: ${quote(position)} })`, () => notify.configure({ position }))
}

function applyNumberOption(key: 'max' | 'duration') {
  const input = key === 'max' ? maxInput : durationInput
  const value = input.value === '' ? NaN : Number(input.value)
  run(`notify.configure({ ${key}: ${input.value === '' ? 'NaN' : value} })`, () => notify.configure({ [key]: value }))
  // 不合法時把輸入框還原成目前的設定
  if (error.value) input.value = config.value[key]
}

function startTask() {
  const text = t.value.taskText
  run(`const task = notify.info(${quote(text.uploading)}, ${quote(text.wait)}, 0)`, () => {
    task = notify.info(text.uploading, text.wait, 0)
    taskActive.value = true
  })
}

function finishTask(success: boolean) {
  if (!task) return
  const text = t.value.taskText
  const changes = success
    ? { type: 'success' as const, mainString: text.done, despString: text.doneDesp, lifeTime: 3 }
    : { type: 'error' as const, mainString: text.failed, despString: text.failedDesp, lifeTime: 5 }
  const handle = task
  run(
    `task.update({ type: ${quote(changes.type)}, mainString: ${quote(changes.mainString)}, despString: ${quote(changes.despString)}, lifeTime: ${changes.lifeTime} })`,
    () => handle.update(changes)
  )
  task = null
  taskActive.value = false
}

function closeTask() {
  if (!task) return
  const handle = task
  run('task.close()', () => handle.close())
  task = null
  taskActive.value = false
}

function clearAll() {
  run('notify.clear()', () => notify.clear())
  task = null
  taskActive.value = false
}

// ---------------------------------------------------------------------------
// 用法分頁
// ---------------------------------------------------------------------------

type UsageTab = 'vue' | 'core' | 'script'
const usageTab = ref<UsageTab>('vue')
const usageTabs: UsageTab[] = ['vue', 'core', 'script']
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div>
        <h1>akira-c-popout-message-box</h1>
        <p class="tagline">{{ t.tagline }}</p>
        <ul class="badges">
          <li>v{{ pkg.version }}</li>
          <li v-for="badge in t.badges" :key="badge">{{ badge }}</li>
        </ul>
      </div>
      <div class="lang-switch" role="group" aria-label="Language / 語言">
        <button type="button" :aria-pressed="lang === 'en'" data-testid="lang-en" @click="lang = 'en'">EN</button>
        <button type="button" :aria-pressed="lang === 'zh'" data-testid="lang-zh" @click="lang = 'zh'">中文</button>
      </div>
    </header>

    <nav class="page-nav">
      <a href="#playground">{{ t.nav.playground }}</a>
      <a href="#usage">{{ t.nav.usage }}</a>
      <a href="#api">{{ t.nav.api }}</a>
    </nav>

    <!-- 互動示範 -->
    <section id="playground">
      <h2>{{ t.playground.title }}</h2>
      <p class="section-intro">{{ t.playground.intro }}</p>

      <div class="playground">
        <div>
          <div class="card">
            <h3>{{ t.playground.message }}</h3>
            <div class="field-grid">
              <div class="field">
                <label for="main-string">{{ t.playground.mainString }}</label>
                <input id="main-string" v-model="mainString" type="text" data-testid="main-string">
              </div>
              <div class="field">
                <label for="desp-string">{{ t.playground.despString }}</label>
                <input id="desp-string" v-model="despString" type="text" data-testid="desp-string">
              </div>
              <div class="field">
                <label for="life-time">{{ t.playground.lifeTime }}</label>
                <input id="life-time" v-model.number="lifeTime" type="number" min="0" step="0.5" :placeholder="String(config.duration)" data-testid="life-time">
              </div>
            </div>
            <p class="hint">{{ t.playground.lifeTimeHint }}</p>
            <div class="btn-row">
              <button
                v-for="type in TYPES"
                :key="type"
                type="button"
                class="btn btn-type"
                :class="type"
                :data-testid="`show-${type}`"
                @click="show(type)"
              >{{ type }}</button>
            </div>
          </div>

          <div class="card">
            <h3>{{ t.playground.settings }}</h3>
            <p class="code-label">{{ t.playground.position }}</p>
            <div class="position-picker" role="group" :aria-label="t.playground.position">
              <template v-for="(position, index) in POSITIONS" :key="position">
                <div v-if="index === 3" class="screen-gap" aria-hidden="true">{{ t.playground.screen }}</div>
                <button
                  type="button"
                  :aria-pressed="config.position === position"
                  :data-testid="`position-${position}`"
                  @click="setPosition(position)"
                >{{ position }}</button>
              </template>
            </div>
            <p class="hint">{{ t.playground.settingsHint }}</p>
            <div class="field-grid" style="margin-top: 12px">
              <div class="field">
                <label for="max-input">{{ t.playground.max }}</label>
                <input id="max-input" v-model.number="maxInput" type="number" min="1" step="1" data-testid="max-input" @change="applyNumberOption('max')">
              </div>
              <div class="field">
                <label for="duration-input">{{ t.playground.duration }}</label>
                <input id="duration-input" v-model.number="durationInput" type="number" min="0" step="0.5" data-testid="duration-input" @change="applyNumberOption('duration')">
              </div>
            </div>
          </div>

          <div class="card">
            <h3>{{ t.playground.task }}</h3>
            <p class="hint" style="margin-top: 0">{{ t.playground.taskHint }}</p>
            <div class="btn-row">
              <button type="button" class="btn btn-type info" :disabled="taskActive" data-testid="task-start" @click="startTask">{{ t.playground.start }}</button>
              <button type="button" class="btn btn-type success" :disabled="!taskActive" data-testid="task-finish" @click="finishTask(true)">{{ t.playground.finish }}</button>
              <button type="button" class="btn btn-type error" :disabled="!taskActive" data-testid="task-fail" @click="finishTask(false)">{{ t.playground.fail }}</button>
              <button type="button" class="btn" :disabled="!taskActive" data-testid="task-close" @click="closeTask">{{ t.playground.close }}</button>
            </div>
          </div>

          <div class="card">
            <h3>{{ t.playground.clear }}</h3>
            <p class="hint" style="margin-top: 0">{{ t.playground.clearHint }}</p>
            <div class="btn-row">
              <button type="button" class="btn" data-testid="clear" @click="clearAll">notify.clear()</button>
            </div>
          </div>
        </div>

        <div class="playground-side">
          <div class="card">
            <h3>{{ t.playground.status }}</h3>
            <dl class="status">
              <div>
                <dt>{{ t.playground.visible }}</dt>
                <dd data-testid="status-count">{{ notify.status.count.value }}</dd>
              </div>
              <div>
                <dt>{{ t.playground.limit }}</dt>
                <dd data-testid="status-max">{{ notify.status.maxItemNumber.value }}</dd>
              </div>
              <div>
                <dt>position</dt>
                <dd style="font-size: 1rem; padding-top: 6px" data-testid="status-position">{{ config.position }}</dd>
              </div>
            </dl>
          </div>
          <div class="card">
            <h3>{{ t.playground.lastCode }}</h3>
            <pre class="language-javascript"><code class="language-javascript" data-testid="last-code" v-html="highlight(shownCode)"></code></pre>
            <p v-if="error" class="error-text" role="alert" data-testid="error">{{ error }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 安裝與用法 -->
    <section id="usage">
      <h2>{{ t.usage.title }}</h2>
      <p class="section-intro">{{ t.usage.intro }}</p>

      <div class="card">
        <p class="code-label">{{ t.usage.install }}</p>
        <pre class="language-none"><code>npm install akira-c-popout-message-box</code></pre>
      </div>

      <div class="card">
        <div class="tabs" role="tablist">
          <button
            v-for="tab in usageTabs"
            :key="tab"
            type="button"
            role="tab"
            :aria-selected="usageTab === tab"
            :data-testid="`tab-${tab}`"
            @click="usageTab = tab"
          >{{ t.usage.tabs[tab] }}</button>
        </div>

        <div v-if="usageTab === 'vue'" class="code-stack" role="tabpanel">
          <div>
            <p class="code-label">{{ t.usage.setup }} — main.ts</p>
            <pre class="language-javascript"><code class="language-javascript" v-html="highlight(t.usage.vueSetup)"></code></pre>
          </div>
          <div>
            <p class="code-label">{{ t.usage.use }}</p>
            <pre class="language-javascript"><code class="language-javascript" v-html="highlight(t.usage.vueUse)"></code></pre>
          </div>
        </div>
        <div v-else-if="usageTab === 'core'" class="code-stack" role="tabpanel">
          <pre class="language-javascript"><code class="language-javascript" v-html="highlight(t.usage.coreUse)"></code></pre>
        </div>
        <div v-else class="code-stack" role="tabpanel">
          <pre class="language-markup"><code class="language-markup" v-html="highlight(t.usage.scriptUse, 'markup')"></code></pre>
        </div>
      </div>
    </section>

    <!-- API -->
    <section id="api">
      <h2>{{ t.api.title }}</h2>
      <p class="section-intro">{{ t.api.intro }}</p>

      <div class="card">
        <div class="api-group">
          <h3>{{ t.api.methods }}</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.api.head.name }}</th><th>{{ t.api.head.desc }}</th></tr></thead>
              <tbody>
                <tr v-for="row in t.api.methodRows" :key="row[0]"><td><code>{{ row[0] }}</code></td><td>{{ row[1] }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="api-group">
          <h3>{{ t.api.options }}</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.api.head.name }}</th><th>{{ t.api.head.default }}</th><th>{{ t.api.head.desc }}</th></tr></thead>
              <tbody>
                <tr v-for="row in t.api.optionRows" :key="row[0]"><td><code>{{ row[0] }}</code></td><td><code>{{ row[1] }}</code></td><td>{{ row[2] }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="api-group">
          <h3>{{ t.api.handle }}</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.api.head.name }}</th><th>{{ t.api.head.desc }}</th></tr></thead>
              <tbody>
                <tr v-for="row in t.api.handleRows" :key="row[0]"><td><code>{{ row[0] }}</code></td><td>{{ row[1] }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="api-group">
          <h3>{{ t.api.classes }}</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>{{ t.api.head.name }}</th><th>{{ t.api.head.desc }}</th></tr></thead>
              <tbody>
                <tr v-for="row in t.api.classRows" :key="row[0]"><td><code>{{ row[0] }}</code></td><td>{{ row[1] }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      akira-c-popout-message-box v{{ pkg.version }} ·
      <a href="https://www.npmjs.com/package/akira-c-popout-message-box">npm</a> ·
      {{ t.footer }}
    </footer>
  </div>
</template>
