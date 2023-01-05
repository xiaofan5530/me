<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
const input = ref<string>()
const index = useStorage('search-index', 0)

// patch
if (index.value >= Presets.length || index.value < 0) {
  index.value = 0
}

const searchEngine = computed(() => {
  const { text, icon, link } = Presets[index.value]
  return {
    text,
    link,
    icon: `/icons/${icon}.svg`,
    hint: `使用${text}搜索`
  }
})

function onSearch() {
  const link = encodeURI(searchEngine.value['link'] + input.value)
  // window.open(link, "_blank")
  const a = document.createElement('a')
  a.setAttribute('href', link)
  a.setAttribute('style', 'display:none')
  a.setAttribute('target', '_blank')
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function nextIndex() {
  const next = index.value + 1
  index.value = next >= Presets.length ? 0 : next
}
</script>

<template>
  <div class="search-outer">
    <div class="search-attach" @click="nextIndex">
      <img :src="searchEngine.icon" :alt="searchEngine.text" />
    </div>

    <input
      class="h-full w-full px-2"
      v-model="input"
      :placeholder="searchEngine.hint"
      @keydown.enter="onSearch"
      @keydown.tab.stop.prevent="nextIndex"
    />
    <div class="search-attach" @click="onSearch">
      <img src="/icons/search.svg" alt="" />
    </div>
  </div>
</template>

<style scoped>
.search-outer {
  @apply mx-2 flex h-12 max-w-[584px] items-center rounded-3xl border border-[#dfe1e5] bg-white hover:shadow focus:shadow-lg dark:border-gray-200/20 dark:bg-black/40 md:w-96;
}

.search-attach {
  @apply m-2 flex h-10 w-10 items-center justify-center rounded-full p-1 hover:cursor-pointer hover:bg-gray-300/40;
}
</style>
