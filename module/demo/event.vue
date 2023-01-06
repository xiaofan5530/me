<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'

const mouseEventMap = [
  'mousedown',
  'mouseup',
  'click',
  'dblclick',
  'touchstart',
  'touchend',
  'touchcanel'
]

const container = ref<HTMLElement>()
const domR = ref<HTMLElement>()
const domG = ref<HTMLElement>()
const domB = ref<HTMLElement>()
const textarea = ref<HTMLTextAreaElement>()
const valueModel = ref<string>('')

let order = ref(1)
mouseEventMap.forEach(eventType => {
  const elements = [container, domR, domG, domB]
  elements.forEach(ele => {
    useEventListener(ele, eventType, () => {
      valueModel.value += `【${order.value++}】${ele.value!.id} ${eventType}\n`
      nextTick(() => {
        textarea.value?.scroll({
          top: textarea.value?.scrollHeight,
          behavior: 'smooth'
        })
      })
    })
  })
})

let timer: ReturnType<typeof setTimeout> | undefined
watch(order, () => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
  timer = setTimeout(() => {
    if (valueModel.value) {
      valueModel.value += '  ------\n'
    }
  }, 300)
})

function clearTextarea() {
  valueModel.value = ''
  order.value = 1
}
</script>

<template>
  <div class="flex flex-col overflow-auto p-2 md:flex-row">
    <div
      class="min-w-96 relative flex h-56 cursor-pointer select-none items-center justify-center rounded shadow dark:bg-gray-400/20"
      ref="container"
      id="A"
    >
      <div class="absolute left-2 top-2 text-2xl">A</div>
      <div class="circle bg-red-500/60" id="r" ref="domR">r</div>
      <div class="circle mx-3 bg-green-500/60" id="g" ref="domG">g</div>
      <div class="circle bg-blue-500/60" id="b" ref="domB">b</div>
    </div>
    <div class="relative my-1 flex-grow md:mx-1 md:my-0">
      <textarea
        ref="textarea"
        v-model="valueModel"
        cols="33"
        readonly
        class="h-56 w-full rounded font-mono shadow"
      />
      <div
        class="absolute top-1 right-4 cursor-pointer rounded border border-gray-400/40 px-2 hover:border-gray-600/60"
        @click="clearTextarea"
      >
        clear
      </div>
    </div>
  </div>
</template>

<style scoped>
.circle {
  @apply flex h-24 w-24 select-none items-center justify-center rounded-full text-2xl;
}
</style>
