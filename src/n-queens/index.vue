<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { NQueen } from './solutions'

const NMax = 12

const N = ref(8)
const index = ref(1)
const realIndex = ref(0)
const solutions = ref<ReturnType<typeof NQueen>>([])
const current = computed(() => {
  return solutions.value[realIndex.value]
})

watchEffect(() => {
  if (N.value > NMax) {
    N.value = NMax
  } else if (N.value < 1) {
    N.value = 1
  }
  solutions.value = NQueen(N.value)
})

watchEffect(() => {
  if (index.value > solutions.value.length) {
    realIndex.value = 0
  } else if (index.value < 1) {
    realIndex.value = solutions.value.length - 1
  } else {
    realIndex.value = index.value - 1
  }
  index.value = realIndex.value + 1
})

const { resume, pause, isActive } = useIntervalFn(
  () => toggleIndex(index.value + 1),
  1000,
  {
    immediate: false
  }
)

function toggleIndex(value: number) {
  if (value > solutions.value.length) {
    value = 1
  } else if (value < 1) {
    value = solutions.value.length
  }
  index.value = value
}
</script>

<template>
  <div class="p-3 flex flex-col">
    <div class="mb-3 flex items-center font-bold text-2xl">
      <div class="text-3xl">N</div>
      <div class="mx-2">=</div>
      <div class="w-16 p-2 border dark:border-gray-200/20 rounded">
        <input v-model.lazy="N" type="number" class="w-full text-center" />
      </div>
      <div class="text-base mx-3">(N不超过{{ NMax }})</div>
      <button v-if="!isActive" @click="resume" title="自动播放">▶️</button>
      <button v-else @click="pause" title="暂停播放">⏸️</button>
    </div>

    <div class="mb-2" v-if="solutions.length">
      <div v-for="column in N" class="flex">
        <template v-for="row in N">
          <div
            v-if="current[row - 1][column - 1] == 'Q'"
            class="grid-item text-2xl"
            :class="[
              (row + column) % 2 ? 'bg-amber-600/90' : 'bg-orange-300/90'
            ]"
          >
            &#9813;
          </div>
          <div
            v-else
            class="grid-item"
            :class="[
              (row + column) % 2 ? 'bg-amber-600/90' : 'bg-orange-300/90'
            ]"
          ></div>
        </template>
      </div>
    </div>

    <div class="mb-2 text-sm">
      找到<span class="font-mono text-lg mx-2 underline">{{
        solutions.length
      }}</span
      >种摆法
    </div>
    <div class="flex items-center">
      <div class="text-sm">当前展示第</div>
      <div
        class="mx-2 overflow-hidden rounded border border-gray-200 dark:border-gray-200/20 select-none"
      >
        <div class="flex h-8">
          <div class="ctrl-btn" @click="toggleIndex(index - 1)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m13.3 17.3l-4.6-4.6q-.15-.15-.212-.325q-.063-.175-.063-.375t.063-.375q.062-.175.212-.325l4.6-4.6q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L10.8 12l3.9 3.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275Z"
              />
            </svg>
          </div>
          <div class="w-20 h-full p-3 flex items-center">
            <input
              v-model.lazy="index"
              type="number"
              class="w-full text-lg font-mono"
            />
          </div>
          <div class="ctrl-btn" @click="toggleIndex(index + 1)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8.7 17.3q-.275-.275-.275-.7q0-.425.275-.7l3.9-3.9l-3.9-3.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l4.6 4.6q.15.15.213.325q.062.175.062.375t-.062.375q-.063.175-.213.325l-4.6 4.6q-.275.275-.7.275q-.425 0-.7-.275Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="text-sm">种摆法</div>
    </div>
  </div>
</template>

<style scoped>
.ctrl-btn {
  @apply w-12 h-full bg-gray-200 dark:bg-gray-200/20 flex items-center justify-center cursor-pointer;
}

.grid-item {
  @apply w-9 h-9 flex justify-center items-center select-none;
}
</style>
