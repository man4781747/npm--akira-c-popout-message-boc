# akira-c-popout-message-box

Version: 0.1.0

English | [繁體中文](README.zh-TW.md)

A lightweight popup message box with multiple styles and auto-dismiss functionality. The core is framework-agnostic, so it works with plain JS or any framework, and a Vue 3 plugin is included.

# [Demo Page](https://man4781747.github.io/Vue3_Typescript__PopoutMessageBox__Demo/)

## Installation

```bash
npm install akira-c-popout-message-box
```

> Vue is not needed when you only use `/core`. The Vue plugin requires Vue 3 (`vue` is an optional peerDependency; the Vue already installed in your project is used).

Styles are bundled into the JS and injected automatically when the first message is shown. No separate CSS import is needed.

## Without Vue (plain JS / other frameworks)

```javascript
import { notify } from 'akira-c-popout-message-box/core'

notify.success('Operation Successful', 'Data has been saved')
notify.error('Operation Failed', 'Please check your network connection', 7)
```

### Via `<script>`

```html
<script src="https://unpkg.com/akira-c-popout-message-box@0.1.0/lib/popout-message-box-core.umd.cjs"></script>
<script>
  PopoutMessageBox.notify.success('Operation Successful', 'Data has been saved')
</script>
```

### Reading and subscribing to state

```javascript
notify.getCount()          // current number of visible messages
notify.getMaxItemNumber()  // maximum shown at the same time

// Called whenever the state changes (message created, closed, or limit set); returns an unsubscribe function
const unsubscribe = notify.subscribe(({ count, maxItemNumber }) => {
  badge.textContent = `${count}/${maxItemNumber}`
})
unsubscribe()
```

## With Vue 3

### Global Registration

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import PopoutMessagePlugin from 'akira-c-popout-message-box'

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

### Using in Components

```typescript
<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()

// Show success message (default 5 seconds)
notify.success('Operation Successful', 'Data has been saved')

// Show error message with custom lifetime (seconds)
notify.error('Operation Failed', 'Please check your network connection', 7)

// Other types
notify.warning('Warning', 'This action cannot be undone', 5)
notify.info('System Notice', 'System maintenance tonight', 5)
notify.primary('Important Notice', 'Please update your password', 5)
notify.debug('Debug Info', 'API response time: 200ms', 3)

// Set maximum number of messages displayed at the same time
// (must be an integer >= 1, otherwise a RangeError is thrown)
// If more messages are visible than the new maximum, the oldest ones are closed immediately
notify.setMaxItemNumber(6)

// Get current max number
const max = notify.getMaxItemNumber()

// Read reactive state (Vue refs, read-only use)
// notify.status.count.value  -> current number of visible messages
// notify.status.maxItemNumber.value -> configured maximum
</script>
```

### Using outside components

In places that are not inside `setup()` — axios interceptors, router guards, Pinia stores — import `notify` directly. It shares the same state as `usePopoutMessage()`:

```typescript
import { notify } from 'akira-c-popout-message-box'

axios.interceptors.response.use(undefined, (error) => {
  notify.error('Request failed', error.message)
  return Promise.reject(error)
})
```

### Via `<script>`

Load Vue first. The global variable is `PopoutMessageBoxVue`:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/akira-c-popout-message-box@0.1.0/lib/popout-message-box.umd.cjs"></script>
<script>
  Vue.createApp(App).use(PopoutMessageBoxVue.default).mount('#app')
</script>
```

## Configuration

You can configure the maximum number of messages, the default duration and the position. Only the fields you pass are applied:

```typescript
// Vue: pass options when installing
app.use(PopoutMessagePlugin, { max: 5, duration: 3, position: 'bottom-right' })

// Without Vue, or to change it at runtime
notify.configure({ position: 'top-center' })
notify.getConfig() // { max: 5, duration: 3, position: 'top-center' }
```

| Option | Default | Description |
|---|---|---|
| `max` | `10` | Maximum shown at the same time; must be an integer >= 1 (same as `setMaxItemNumber`) |
| `duration` | `5` | Seconds a message stays when `lifeTime` is not given; `0` means it never closes automatically |
| `position` | `'top-right'` | `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'` |

- At the top, new messages appear at the top; at the bottom, new messages appear at the bottom (always closest to the screen edge).
- Invalid values throw a `RangeError`, and none of the options are applied.
- Changing `position` while messages are visible moves them immediately.

## Controlling Messages

### Messages that don't close automatically

A message with `lifeTime` set to `0` never closes on its own (and shows no countdown). It closes only when clicked or when `close()` is called, which suits important errors:

```typescript
notify.error('Payment failed', 'Please contact support', 0)
```

### Message handle

Every message method returns a handle:

```typescript
const msg = notify.info('Uploading…', 'Please wait', 0)

// Change it later; only the fields you pass are changed, and the countdown restarts with the new (or original) lifeTime
msg.update({ type: 'success', mainString: 'Upload complete', despString: '', lifeTime: 3 })

// Or close it directly
msg.close()
```

Fields accepted by `update()`:

| Field | Description |
|---|---|
| `mainString` | Main message text |
| `despString` | Description text |
| `type` | `'success'`, `'error'`, `'info'`, `'warning'`, `'debug'`, `'primary'` |
| `lifeTime` | New duration in seconds (`0` means it never closes automatically) |

- Calling `update()` on a message that has started closing does nothing, and calling `close()` again has no effect.
- An invalid `type` or `lifeTime` throws a `RangeError`.

### Closing all messages

```typescript
notify.clear()
```

## TypeScript

Type declarations are included, so you get type hints out of the box. You can also import the related types:

```typescript
// Vue
import { usePopoutMessage, type PopoutMessageMethods } from 'akira-c-popout-message-box'
const notify: PopoutMessageMethods = usePopoutMessage()

// Without Vue
import { notify, type PopoutMessageState, type PopoutMessageCore } from 'akira-c-popout-message-box/core'

// Other types: MessageHandle, MessageUpdate, MessageType, Position, PopoutMessageOptions
```

## API

### Message methods

`success` / `error` / `info` / `warning` / `debug` / `primary` all accept:

- `mainString`: Main message text (required)
- `despString`: Description text (optional)
- `lifeTime`: Display duration in seconds; defaults to the `duration` option (5 seconds). `0` means it never closes automatically; negative numbers or `NaN` throw a `RangeError` (optional)

Each returns a handle `{ close(), update(changes) }`; see [Controlling Messages](#controlling-messages).

### Other methods

| Method | core | Vue | Description |
|---|---|---|---|
| `configure(options)` | ✓ | ✓ | Changes the configuration; see [Configuration](#configuration) |
| `getConfig()` | ✓ | (via `notify`) | Gets the current configuration |
| `clear()` | ✓ | ✓ | Closes all visible messages |
| `setMaxItemNumber(max)` | ✓ | ✓ | Sets the maximum shown at the same time (default 10); same as `configure({ max })`. Must be an integer >= 1, otherwise a `RangeError` is thrown |
| `getMaxItemNumber()` | ✓ | ✓ | Gets the maximum |
| `getCount()` | ✓ | | Gets the current number of visible messages |
| `subscribe(listener)` | ✓ | | Calls `listener({ count, maxItemNumber })` on every state change; returns an unsubscribe function |
| `status.count` / `status.maxItemNumber` | | ✓ | Vue refs, usable directly in templates |

> The `notify` exported from `akira-c-popout-message-box` is the core `notify`, so Vue projects can use `getConfig()`, `getCount()` and `subscribe()` as well.

## Changelog

### 0.1.0

**⚠️ Breaking changes**

- The core no longer depends on Vue, and messages are no longer rendered as Vue components:
  - The `PopoutMessageBox` component is no longer exported, and `app.use()` no longer registers `<PopoutMessageBox>` globally.
  - Styles are injected into `<head>` when the **first message is shown** (previously when the package was loaded).
  - Message wrapper divs no longer have a random `id`, and the internal `removed` / `popout-removed` events have been removed.
- UMD global names fixed: the Vue build changed from the misspelled `PopoutMwessageBox` to `PopoutMessageBoxVue`; the new core build is `PopoutMessageBox`.
- Internal class names now follow BEM naming with a `popout-` prefix, so they no longer clash with other styles on the page (such as Bootstrap's `.card`). If you overrode styles using the old names, update them as follows:

  | Old name | New name |
  |---|---|
  | `.card` | `.popout-card` |
  | `.card-body` | `.popout-card__body` |
  | `.card-title` | `.popout-card__title` |
  | `.card-desp` | `.popout-card__desp` |
  | `.success` `.fail` `.info` `.warning` `.primary` `.debug` | `.popout-card--success` `.popout-card--fail` `.popout-card--info` `.popout-card--warning` `.popout-card--primary` `.popout-card--debug` |
  | `.time-mask` | `.popout-card__time-mask` |
  | `.stop` | `.popout-card__time-mask--stop` |
  | Transition `when-create-*` | `popout-slide-*` |
  | `@keyframes time_mask_anime` | `@keyframes popout-time-mask` |

- `setMaxItemNumber` now throws a `RangeError` when given anything other than an integer >= 1 (e.g. `0`, negative numbers, `NaN`, decimals). Previously such values were accepted.
- A negative or `NaN` `lifeTime` now throws a `RangeError` (previously the message closed immediately), and a `lifeTime` of `0` now means the message never closes automatically.
- Message methods now return a handle (previously they returned nothing).
- `vue` moved from `dependencies` to an optional `peerDependency`, so your project no longer risks installing a second copy of Vue. Vue is not needed when only `/core` is used.

**Added**

- Framework-agnostic entry `akira-c-popout-message-box/core`, providing `notify` with `getCount()` and `subscribe()`.
- Configuration: `notify.configure({ max, duration, position })` and `notify.getConfig()`; in Vue, pass options with `app.use(PopoutMessagePlugin, options)`.
- Positions: six positions (left, center and right, at the top or bottom); at the bottom, new messages appear at the bottom.
- Messages with a `lifeTime` (or `duration`) of `0` never close automatically.
- Message handles: message methods return `{ close(), update() }`; `update()` changes the text, type and duration and restarts the countdown.
- `notify.clear()` closes all messages.
- The Vue entry exports `notify` for use outside components.
- TypeScript declarations (`.d.ts`) are now included, exporting `PopoutMessageMethods`, `PopoutMessageCore`, `PopoutMessageState` and related types.
- Lowering the limit with `setMaxItemNumber` now closes the oldest messages over the limit immediately (previously this only took effect when the next message was created).

**Fixed**

- `status.count` was decremented twice when a message was closed by clicking and the mouse then left it.
- Messages pushed out by the limit were not closed when several messages were created in the same tick.
- Removed a leftover `console.log` that ran every time a message was created.
- The package no longer touches `document` when it is imported, so it can be imported in SSR environments.

**Other**

- Removed the `uuid` dependency; the package now has no runtime dependencies.

### 0.0.10

- Added API: `setMaxItemNumber(max)` and `getMaxItemNumber()` to set/get the maximum concurrently shown messages.
- Exposed `status` object to read current count and max value.
- Improved DOM removal flow and added internal `popout-removed` event for synchronized cleanup.

## Styles

Bootstrap is not required. If the page defines Bootstrap 5 CSS variables (such as `--bs-green`), their colors are used; otherwise built-in fallback colors apply. The following message types are supported:

- `success`: Success message (green)
- `error`: Error message (red, class `popout-card--fail`)
- `warning`: Warning message (yellow)
- `info`: Information message (blue)
- `primary`: Primary message (dark blue)
- `debug`: Debug message (gray)

### Customizing Styles

You can override styles using these classes:

| Selector | Description |
|---|---|
| `#popout-message-box-list` | Container for all messages (fixed on screen; placed according to `position`) |
| `.popout-position--top-right`, etc. | The container's current position (set on the container) |
| `.popout-message-box` | Outer wrapper of a single message |
| `.popout-card` | Message card |
| `.popout-card--success` / `--fail` / `--info` / `--warning` / `--primary` / `--debug` | Message types (left border color) |
| `.popout-card__body` | Card content area (padding) |
| `.popout-card__title` | Main message text |
| `.popout-card__desp` | Description text |
| `.popout-card__time-mask` | Countdown mask |
| `.popout-card__time-mask--stop` | Mask while hovered (animation paused) |

The built-in styles are injected into `<head>` when the first message is shown, usually after your own CSS, so overrides need **higher** specificity (for example, prefix the built-in selector with `body`):

```css
body #popout-message-box-list .popout-message-box .popout-card.popout-card--success {
  border-color: #00b894;
}

body #popout-message-box-list .popout-message-box .popout-card .popout-card__body {
  padding: 0.75rem;
}
```

To change colors only, you can also set the CSS variables (except for `info`, which uses a fixed color):

```css
:root {
  --bs-green: #00b894;     /* success */
  --bs-red: #d63031;       /* error */
  --bs-warning: #fdcb6e;   /* warning */
  --bs-primary: #0984e3;   /* primary */
  --bs-secondary: #636e72; /* debug */
  --bs-gray-500: #999;     /* description text */
}
```

## Features

- Framework-agnostic core, plus a Vue 3 plugin
- Auto-dismiss timer
- Pause timer on hover
- Click to dismiss
- Multiple simultaneous messages with a configurable limit
- Six display positions
- Messages that stay until closed, and handles to update or close them later
- Responsive design
- Animation effects
- TypeScript types included
- No runtime dependencies

## Development

```bash
# Install dependencies
pnpm install

# Dev mode (uses the src source code directly)
pnpm run dev:local

# Dev mode (builds lib first, then runs against the build output to simulate real usage)
pnpm run dev:built

# Build the library (ESM, core UMD and Vue UMD, in that order)
pnpm run build:lib

# Build the demo page
pnpm run build:demo
```

> `dev:local` and `dev:built` set environment variables with the Windows `set` syntax, so they currently only work on Windows.

## License

MIT License
