# akira-c-popout-message-box

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

const app = createApp(App)
app.use(PopoutMessagePlugin)
app.mount('#app')
```

### Using in Components

```typescript
<script setup>
import { usePopoutMessage } from 'akira-c-popout-message-box'

const notify = usePopoutMessage()

// Show success message
notify.success('Operation Successful', 'Data has been saved', 5)

// Show error message
notify.error('Operation Failed', 'Please check your network connection', 7)

// Show warning message
notify.warning('Warning', 'This action cannot be undone', 5)

// Show info message
notify.info('System Notice', 'System maintenance tonight', 5)

// Show primary message
notify.primary('Important Notice', 'Please update your password', 5)

// Show debug message
notify.debug('Debug Info', 'API response time: 200ms', 3)
</script>
```

## Parameters

Each notification method accepts the following parameters:

- `mainString`: Main message text (required)
- `despString`: Description text (optional)
- `lifeTime`: Display duration in seconds, defaults to 5 seconds (optional)

## Styles

This component uses Bootstrap 5 styling system and supports the following message types:

- `success`: Success message (green)
- `error`: Error message (red)
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