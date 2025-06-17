<script setup lang="ts">
  import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutMessage()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row">
      <h1>Popout Logs Show (count: {{ $notify.status.count  }})</h1>
      <div class="col">
        <div class="input-group mb-3">
          <input type="text" class="form-control" v-model="logMsg" placeholder="you can type some message">
          <button class="btn btn-success" @click="$notify.success(logMsg, 'Success log', 10)">Success log</button>
          <button class="btn btn-danger" @click="$notify.error(logMsg, 'Error log', 10)">Error/Fail log</button>
          <button class="btn btn-info" @click="$notify.info(logMsg, 'Info log', 10)">Info log</button>
          <button class="btn btn-warning" @click="$notify.warning(logMsg, 'Waring log', 10)">Warning log</button>
          <button class="btn btn-secondary" @click="$notify.debug(logMsg, 'Debug log', 10)">Debug log</button>
          <button class="btn btn-primary" @click="$notify.primary(logMsg, 'Primary log', 10)">Primary log</button>
        </div>
      </div>

      <h4># main.js</h4>
          <pre><code class="language-js">import { createApp } from 'vue'
import App from '@/App.vue'
import PopoutMessagePlugin from '@/components/popoutMessageBox/PopoutMessagePlugin'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).use(PopoutMessagePlugin).mount('#app')</code></pre>
          <h4># App.vue</h4>
        <pre><code class="language-html">&lt;script setup lang="ts">
  import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
  const $notify = usePopoutMessage()
&lt;/script>

&lt;template>
  &lt;div class="d-flex justify-content-center align-items-center">
    &lt;div class="container">
      &lt;div class="row">
      &lt;h1>Popout Logs Show (count: {{ $notify.status.count  }})&lt;/h1>
      &lt;div class="col">
        &lt;div class="input-group mb-3">
          &lt;input type="text" class="form-control" v-model="logMsg" placeholder="you can type some message">
          &lt;button class="btn btn-success" @click="$notify.success(logMsg, 'Success log', 10)">Success log&lt;/button>
          &lt;button class="btn btn-danger" @click="$notify.error(logMsg, 'Error log', 10)">Error/Fail log&lt;/button>
          &lt;button class="btn btn-info" @click="$notify.info(logMsg, 'Info log', 10)">Info log&lt;/button>
          &lt;button class="btn btn-warning" @click="$notify.warning(logMsg, 'Waring log', 10)">Warning log&lt;/button>
          &lt;button class="btn btn-secondary" @click="$notify.debug(logMsg, 'Debug log', 10)">Debug log&lt;/button>
          &lt;button class="btn btn-primary" @click="$notify.primary(logMsg, 'Primary log', 10)">Primary log&lt;/button>
        &lt;/div>
      &lt;/div>
    &lt;/div>
    &lt;/div>
  &lt;/div>
&lt;/template>

&lt;script lang="ts">
export default {
  name: 'App',
  data() {
    return {
      logMsg: ""
    };
  },
}
&lt;/script>
</code></pre>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  components: {}, // PopoutCard is registered globally or locally if this were a real app build
  data() {
    return {
      logMsg: ""
    };
  },
}
</script>

<style scoped>
</style>
