<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useNow, useDateFormat } from '@vueuse/core'
import SearchBox from './search-box.vue'
import Wallpaper from './wallpaper.vue'

const dateObject = reactive<{
  date?: string
  time?: string
  week?: string
  lunar?: string
  format?: string
}>({
  format: 'MM月D日 HH:mm ddd'
})

const now = useNow({ interval: 1000 })

watch(
  now,
  (value, oldValue) => {
    if (!oldValue || oldValue.getDay() != value.getDate()) {
      // TODO:
      dateObject.lunar = ''
    }
    if (!oldValue || oldValue.getMinutes() != value.getMinutes()) {
      const [date, time, week] = useDateFormat(now, dateObject.format, {
        locales: 'zh-CN'
      }).value.split(/\s/)
      dateObject.date = date
      dateObject.time = time
      dateObject.week = week
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Wallpaper />
  <div class="relative">
    <div class="absolute h-screen w-full">
      <div class="mt-28 flex flex-col items-center justify-center">
        <div class="mb-2 text-6xl">
          {{ dateObject.time }}
        </div>
        <div class="mb-4 flex items-center justify-center">
          <div>{{ dateObject.date }}</div>
          <div class="mx-2">{{ dateObject.week }}</div>
          <div>{{ dateObject.lunar }}</div>
        </div>
        <SearchBox />
      </div>
    </div>
  </div>
</template>
