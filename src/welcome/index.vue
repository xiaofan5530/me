<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useNow, useDateFormat } from '@vueuse/core'
import Wallpaper from './wallpaper.vue'
import SearchBox from './search-box.vue'

const dateFormat = reactive<{
  date?: string
  time?: string
  week?: string
  lunar?: string
}>({})

const now = useNow({ interval: 1000 })

watch(
  now,
  (value, oldValue) => {
    if (!oldValue || oldValue.getDay() != value.getDay()) {
      // TODO
      dateFormat.lunar = ''
    }
    if (!oldValue || oldValue.getMinutes() != value.getMinutes()) {
      const [date, time, week] = useDateFormat(now, 'MM月D日 HH:mm ddd', {
        locales: 'zh-CN'
      }).value.split(/\s/)
      dateFormat.date = date
      dateFormat.time = time
      dateFormat.week = week
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Wallpaper />
  <div class="absolute h-screen w-full">
    <div class="mt-28 flex flex-col items-center justify-center">
      <div class="mb-2 text-6xl">
        {{ dateFormat.time }}
      </div>
      <div class="mb-4 flex items-center justify-center">
        <div>{{ dateFormat.date }}</div>
        <div class="mx-2">{{ dateFormat.week }}</div>
        <div>{{ dateFormat.lunar }}</div>
      </div>
      <SearchBox />
    </div>
    <div class="absolute bottom-32 w-full">
      <div class="text-center text-sm">
        <span class="mx-1">乐观心态</span>
        <span class="mx-1">积极作为</span>
      </div>
      <div></div>
    </div>
  </div>
</template>
