<script setup lang="ts">
import { ref, watchEffect, computed, onUnmounted } from 'vue'
import { onLongPress, useEventListener, useMouseInElement } from '@vueuse/core'
import useGame, { type State } from './useGame'
import useTimer from './useTimer'

interface GridLabels {
  text: '💣' | '💥' | '🚩' | number | ''
  className?: string
}

const StateEmojiPresets: Record<State, string> = {
  ready: '🙂',
  play: '🤔',
  victory: '😎',
  defeat: '😵'
}

// @see https://tailwindcss.com/docs/customizing-colors
const TextColorPresets: Record<string, string> = {
  1: 'text-blue-500', // '#3b82f6'
  2: 'text-green-500', // '#22c55e'
  3: 'text-red-500', // '#ef4444'
  4: 'text-indigo-500', // '#6366f1'
  5: 'text-orange-500', // '#f97316'
  6: 'text-purple-500', // '#a855f7'
  7: 'text-teal-500', // '#14b8a6'
  8: 'text-pink-500' // '#ec4899'
}

const StorageKey = 'mine-sweeper'

/* -------------------------------------------------------------------------- */

const {
  state,
  board,
  grids,
  flags,
  init,
  load,
  openAll,
  openGrid,
  markGrid,
  posToUid
} = useGame()

const { rawTimer, timer, command, fixedTimer } = useTimer({
  format: (value: number) => (value / 1000).toFixed(0).padStart(3, '0')
})

const stateEmoji = computed(() => StateEmojiPresets[state.value])
const hiddenMine = computed(() => {
  const count = board.value.m - flags.value.length
  return count.toFixed(0).padStart(3, '0')
})

const gridLabels = computed(() => {
  return grids.value.map(grid => {
    let text: GridLabels['text']
    let className: string = ''
    if (grid.flag) {
      text = '🚩'
      className = 'bg-gray-500/10 hover:bg-gray-500/30'
    } else if (!grid.open) {
      text = ''
      className = 'bg-gray-500/10 hover:bg-gray-500/30'
    } else if (grid.boom) {
      text = '💥'
      className = 'bg-red-500/60'
    } else if (grid.mine) {
      text = '💣'
    } else if (grid.adjacentMines) {
      text = grid.adjacentMines
      className = TextColorPresets[grid.adjacentMines]
    } else {
      text = '' // adjacentMines is zero
    }
    return {
      text,
      className
    }
  })
})

watchEffect(() => {
  if (state.value === 'ready') {
    command.value = 'reset'
  } else if (state.value === 'play') {
    command.value = 'start'
  } else if (state.value === 'victory') {
    command.value = 'pause'
    onVictory()
  } else if (state.value === 'defeat') {
    command.value = 'pause'
    onDefeat()
  }
})

function onVictory() {
  // TODO:play animation
}

function onDefeat() {
  openAll()
}

/* -------------------------------------------------------------------------- */
let longPressedFlag = false
const boardDom = ref<HTMLElement>()

const { elementX, elementY } = useMouseInElement(boardDom)

function onClickRightHandler() {
  const position = getClickGridPosition(elementX.value, elementY.value)
  markGrid(position)
}

function onMouseUpHandler() {
  if (!longPressedFlag) {
    const position = getClickGridPosition(elementX.value, elementY.value)
    openGrid(position)
  }
  longPressedFlag = false
}

function onLongPressHandler() {
  if (!longPressedFlag) {
    longPressedFlag = true
    const position = getClickGridPosition(elementX.value, elementY.value)
    markGrid(position)
  }
}

// 移动端使用长按模拟右击事件
onLongPress(boardDom, onLongPressHandler, {
  modifiers: { stop: true },
  delay: 700
})

function getClickGridPosition(
  elementX: number,
  elementY: number,
  size = { w: 34, h: 34 } // FIXME:
) {
  const x = Math.floor(elementX / size.w)
  const y = Math.floor(elementY / size.h)
  return {
    x,
    y
  }
}

/* -------------------------------------------------------------------------- */
// TODO: open model to Request user comments
tryResumePrev()

onUnmounted(() => trySaveGame())

useEventListener('unload', trySaveGame)

function tryResumePrev() {
  const storageData = window.localStorage.getItem(StorageKey)
  if (storageData) {
    try {
      const { timer, board, grids } = JSON.parse(storageData)
      load(board, grids)
      fixedTimer(timer)
    } catch (error) {
      init()
    }
  }
}

function trySaveGame() {
  if (state.value === 'play') {
    try {
      window.localStorage.setItem(
        StorageKey,
        JSON.stringify({
          timer: rawTimer.value,
          grids: grids.value,
          board: board.value
        })
      )
    } catch (error) {}
  } else {
    window.localStorage.removeItem(StorageKey)
  }
}
</script>

<template>
  <div class="p-3">
    <div class="mb-6 flex">
      <div class="btn" @click="init('easy')">easy</div>
      <div class="btn mx-1" @click="init('medium')">medium</div>
      <div class="btn" @click="init('hard')">hard</div>
    </div>

    <div class="mb-3">
      <div class="mb-2 flex justify-center">
        <div class="btn">
          <span>💣</span>
          <span class="ml-0.5 text-red-500">{{ hiddenMine }}</span>
        </div>
        <div class="btn mx-2" @click="init()">{{ stateEmoji }}</div>
        <div class="btn">
          <span>⏱️</span>
          <span class="ml-0.5 text-red-500">{{ timer }}</span>
        </div>
      </div>

      <div class="flex flex-col items-center overflow-auto">
        <div
          v-if="board"
          class="inline-flex select-none flex-col"
          ref="boardDom"
          @mouseup="onMouseUpHandler"
          @click.right.prevent="onClickRightHandler"
        >
          <div v-for="y in board.h" :key="y" class="mx-auto flex items-center">
            <div
              v-for="x in board.w"
              :key="x"
              class="grid-item grid-mb"
              :class="gridLabels[posToUid({ x: x - 1, y: y - 1 })]['className']"
            >
              {{ gridLabels[posToUid({ x: x - 1, y: y - 1 })]['text'] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <!-- TODO: -->
      <div class="btn" @click="" title="重玩本局">again</div>
      <div class="btn mx-1" title="截图本局">snap</div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply flex w-24 cursor-pointer select-none items-center justify-center rounded border border-gray-500/20 py-1 px-2 font-bold dark:bg-gray-500/20;
}

.grid-item {
  @apply flex flex-shrink-0 cursor-pointer select-none items-center justify-center border border-gray-500/40 text-xl font-bold dark:border-gray-100/10;
}

.grid-mb {
  @apply mb-0.5 mr-0.5 h-8 w-8;
}
</style>
