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
  &::-webkit-scrollbar {
    width: 4px;
  }
  & .popout-message-box {
    min-width: 10rem;
    max-width: 25vw;
    cursor: pointer;
    opacity: 0.3;
    transition: all 0.7s;
    &:first-child {
      opacity: 1;
    }
    &:hover {
      opacity: 1;
    }
    & .card {
      max-height: 100vh;
      box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
      border: 0;
      border-style: solid;
      border-width: 0px;
      border-left-width: 5px;
      transition: all 0.5s;
      &.success {
        border-color: var(--bs-green);
      }
      &.fail {
        border-color: var(--bs-red);
      }
      &.info {
        border-color: #289dc9;
      }
      &.warning {
        border-color: var(--bs-warning);
      }
      &.primary {
        border-color: var(--bs-primary);
      }
      &.debug {
        border-color: var(--bs-secondary);
      }
      margin-bottom: 8px;

      & .card-body {
        & .card-title {
          font-size: 1rem;
          font-weight: bold;
          letter-spacing: 0.0125em;
          border: 0;
          margin: 0;
        }
        & .card-desp {
          font-size: 0.8rem;
          letter-spacing: 0.0125em;
          border: 0;
          color: var(--bs-gray-500);
        }
      }
    }
  }

  .when-create-leave-active,
  .when-create-enter-active {
    transition: all 0.5s ease;
    transform: translateX(0%) translateY(0px);
    margin-bottom: 8px;
  }

  .when-create-enter-from {
    background-color: rgba(0, 0, 0, 0);
    transform: translateX(120%) translateY(0px);
    height: 0px;
    margin-bottom: 0px;
  }

  .when-create-leave-to {
    background-color: rgba(0, 0, 0, 0);
    transform: translateX(114%) translateY(-4px);
    height: 0px;
    margin-bottom: 0px;
  }

  .time-mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    &.stop {
      animation-play-state: paused !important;
    }
  }
}

@keyframes time_mask_anime {
  from {
    right: 100%;
  }
  to {
    right: 0%;
  }
}
</style>