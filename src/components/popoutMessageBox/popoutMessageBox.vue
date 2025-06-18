<template>
  <transition name="when-create">
    <div
      v-if="create"
      class="card"
      :class="messageType"
      @mouseenter="stopDel"
      @mouseleave="resumeDel"
      @click="delThisWindow"
    >
      <transition name="when-create">
        <div
          class="time-mask"
          :class="isAnimeStop ? 'stop' : ''"
          :style="`animation: time_mask_anime ${lifeTime}s linear forwards;`"
        ></div>
      </transition>
      <div class="card-body">
        <div class="card-title">{{ mainString }}</div>
        <div class="card-desp">{{ despString }}</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { popoutMessage } from './popoutMessageService'
import './popoutMessageBox.css'

export default defineComponent({
  name: 'PopoutMessageBox',
  props: {
    messageType: {
      type: String as () => string,
      required: true,
    },
    eleID: {
      type: String as () => string,
      required: true,
    },
    lifeTime: {
      type: Number as () => number,
      default: 5,
    },
    mainString: {
      type: String as () => string,
      required: true,
    },
    despString: {
      type: String as () => string,
      default: '',
    },
  },
  data() {
    return {
      create: false,
      delItem: null as number | null,
      startTime: -1,
      remaining: -1,
    }
  },
  computed: {
    isAnimeStop(): boolean {
      return this.delItem === null
    },
  },
  mounted() {
    this.create = true
    setTimeout(() => {
      this.getEleHeight()
    }, 100)
    this.remaining = this.lifeTime * 1000
    this.startTime = Date.now()
    this.delItem = window.setTimeout(() => {
      this.delThisWindow()
    }, this.remaining)
  },
  methods: {
    getEleHeight(): number {
      const thisEle = document.getElementById(this.eleID)
      if (!thisEle || !thisEle.children[0]) return 0
      ;(thisEle.children[0] as HTMLElement).style.height = `${thisEle.offsetHeight}px`
      return thisEle.offsetHeight
    },
    delThisWindow(): void {
      this.stopDel()
      const thisEle = document.getElementById(this.eleID)
      if (!thisEle || !thisEle.children[0]) return
      ;(thisEle.children[0] as HTMLElement).style.height = '0px'
      this.create = false
      if (popoutMessage.status.count.value > 0) {
        popoutMessage.status.count.value -= 1
      }
      setTimeout(() => {
        thisEle.remove()
      }, 2000)
    },
    stopDel(): void {
      if (this.delItem !== null) {
        clearTimeout(this.delItem)
        this.delItem = null
        this.remaining -= Date.now() - this.startTime
      }
    },
    resumeDel(): void {
      this.startTime = Date.now()
      this.delItem = window.setTimeout(() => {
        this.delThisWindow()
      }, this.remaining)
    },
  },
  created() {
    // ✅ 將 store 設定到 this
    // this.popoutMessageStores = usePopoutMessageStores()
    popoutMessage.status.count.value += 1
    console.log(popoutMessage.status.count.value)
  },
  deactivated() {
    if (popoutMessage.status.count.value > 0) {
      popoutMessage.status.count.value -= 1
    }
  },
})



</script>

<style lang="postcss">
</style>