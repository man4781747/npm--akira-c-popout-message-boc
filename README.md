# akira-c-popout-message-box

Version: 0.0.10

English | [繁體中文](README.zh-TW.md)

A Vue 3 popup message box component with multiple styles and 
auto-dismiss functionality.

# [Demo Page](https://man4781747.github.io/Vue3_Typescript__PopoutMessageBox__Demo/)

## Installation

```bash
npm install akira-c-popout-message-box
```

## Usage

### Global Registration

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import PopoutMessagePlugin from 'akira-c-popout-message-box'
import 'akira-c-popout-message-box/lib/popout-message-box.css'

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

> Note: The package publishes a `lib` directory. If you need styles, import `lib/popout-message-box.css`.

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
notify.setMaxItemNumber(6)

// Get current max number
const max = notify.getMaxItemNumber()

// Read status
// notify.status.count.value  -> current number of visible messages
// notify.status.maxItemNumber.value -> configured maximum
</script>
```

## Parameters

Each notification method accepts the following parameters:

- `mainString`: Main message text (required)
- `despString`: Description text (optional)
- `lifeTime`: Display duration in seconds, defaults to 5 seconds (optional)

## New in 0.0.10

- Added API: `setMaxItemNumber(max)` and `getMaxItemNumber()` to set/get the maximum concurrently shown messages.
- Exposed `status` object to read current count and max value.
- Improved DOM removal flow and added internal `popout-removed` event for synchronized cleanup.

## Styles

This component uses Bootstrap 5 styling system and supports the following message types:

- `success`: Success message (green)
- `error` / `fail`: Error message (red)
- `warning`: Warning message (yellow)
- `info`: Information message (blue)
- `primary`: Primary message (dark blue)
- `debug`: Debug message (gray)

## Features

- Auto-dismiss timer
- Pause timer on hover
- Click to dismiss
- Support for multiple simultaneous messages
- Responsive design
- Animation effects

## License

MIT License