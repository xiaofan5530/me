<script setup lang="ts">
import { watchEffect, computed, onUnmounted } from 'vue'
import { useEventListener } from '@vueuse/core'
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
const TextColorPresets: Record<string, string> = {
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-indigo-500',
  5: 'text-orange-500',
  6: 'text-purple-500',
  7: 'text-teal-500',
  8: 'text-pink-500'
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
  openGrid,
  markGrid,
  openAll,
  posToUid
} = useGame()
const { timer, command } = useTimer({
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

tryResumePrev()

useEventListener('unload', trySaveGame)

onUnmounted(() => trySaveGame())

function tryResumePrev() {
  const storageData = window.localStorage.getItem(StorageKey)
  if (storageData) {
    try {
      const { board, grids } = JSON.parse(storageData)
      load(board, grids)
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
          stamp: Date.now(),
          grids: grids.value,
          board: board.value
        })
      )
    } catch (error) {}
  } else {
    window.localStorage.removeItem(StorageKey)
  }
}

function onVictory() {}

function onDefeat() {
  openAll()
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-3">
    <div class="mb-3 flex text-xl">
      <div class="btn">
        <span>💣</span>
        <span class="ml-0.5 text-red-500">{{ hiddenMine }}</span>
      </div>
      <div class="btn mx-2" @click="init()">
        {{ stateEmoji }}
      </div>
      <div class="btn">
        <span>⏱️</span>
        <span class="ml-0.5 text-red-500">{{ timer }}</span>
      </div>
    </div>

    <div v-if="board" class="mb-3">
      <div v-for="y in board.h" :key="y" class="flex">
        <div
          v-for="x in board.w"
          :key="x"
          class="grid-item grid-mb"
          :class="gridLabels[posToUid({ x: x - 1, y: y - 1 })]['className']"
          @click="openGrid({ x: x - 1, y: y - 1 })"
          @click.right.prevent="markGrid({ x: x - 1, y: y - 1 })"
        >
          {{ gridLabels[posToUid({ x: x - 1, y: y - 1 })]['text'] }}
        </div>
      </div>
    </div>

    <div class="mb-3 flex">
      <div class="btn" @click="init('easy')">easy</div>
      <div class="btn mx-2" @click="init('medium')">medium</div>
      <div class="btn" @click="init('hard')">hard</div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply flex w-24 cursor-pointer select-none items-center justify-center rounded border border-gray-500/20 px-2 py-1 font-mono font-bold dark:bg-gray-500/20;
}

.grid-item {
  @apply flex cursor-pointer select-none items-center justify-center border border-gray-500/40 font-mono text-xl font-bold dark:border-gray-100/10;
}

.grid-mb {
  @apply mb-0.5 mr-0.5 h-8 w-8;
}
</style>
