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
    icon: `/icons/${icon}/.svg`,
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
    <div class="w-10"></div>
    <input
      class="px-2 w-full h-full"
      v-model="input"
      type="text"
      placeholder="搜索"
      @keydown.enter="onSearch"
    />
    <div class="w-10"></div>
  </div>
</template>

<style scoped>
.search-outer {
  @apply max-w-[584px] flex h-12 bg-white border border-[#dfe1e5] rounded-3xl focus:shadow-lg hover:shadow;
}
</style>
