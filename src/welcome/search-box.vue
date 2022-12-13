<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const Presets = [
  {
    text: 'Google',
    link: 'https://www.google.com/search?q=',
    icon: 'google'
  },
  {
    text: '百度',
    link: 'https://www.baidu.com/s?wd=',
    icon: 'baidu'
  },
  {
    text: 'GitHub',
    link: 'https://github.com/search?q=',
    icon: 'github'
  },
  {
    text: 'MDN',
    link: 'https://developer.mozilla.org/zh-CN/search?q=',
    icon: 'mdn'
  },
  {
    text: 'NPM',
    link: 'https://www.npmjs.com/search?q=',
    icon: 'npm'
  }
]

const input = ref('')
const index = useStorage('search-engine', 0)

const engine = computed(() => {
  const { text, icon, link } = Presets[index.value]
  return {
    text,
    link,
    icon: `/icons/${icon}.svg`,
    hint: `使用${text}搜索`
  }
})

function onSearch() {
  const link = encodeURI(engine.value['link'] + input.value)
  // window.open(link, "_blank")
  const a = document.createElement('a')
  a.setAttribute('href', link)
  a.setAttribute('style', 'display:none')
  a.setAttribute('target', '_blank')
  document.body.appendChild(a)
  a.click()
  a.parentNode!.removeChild(a)
}

function nextIndex() {
  const next = index.value + 1
  index.value = next < Presets.length ? next : 0
}
</script>

<template>
  <div class="search-outer">
    <div class="search-attach" @click="nextIndex">
      <img :src="engine.icon" :alt="engine.text" />
    </div>
    <input
      class="px-2 w-full h-full text-black"
      v-model="input"
      type="text"
      :placeholder="engine.hint"
      @keydown.enter="onSearch"
      @keydown.tab.stop.prevent="nextIndex"
    />
    <div class="search-attach font-bold" @click="onSearch">
      <img src="/icons/search.svg" alt="" />
    </div>
  </div>
</template>

<style scoped>
.search-outer {
  @apply max-w-[584px] mx-2 md:w-96 h-12 flex items-center bg-white dark:bg-white/90 border border-[#dfe1e5] dark:border-gray-200/20 rounded-3xl focus:shadow-lg hover:shadow;
}

.search-attach {
  @apply w-10 h-10 rounded-full m-2 p-1 flex justify-center items-center hover:cursor-pointer hover:bg-gray-300/40;
}
</style>
