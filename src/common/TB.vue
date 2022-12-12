<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)

const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '解'
  }
)
</script>

<template>
  <div>
    <slot name="label">
      <div
        class="inline-block px-4 py-1.5 rounded text-center cursor-pointer border border-black/10 hover:border-black/20 dark:border-white/20"
        @click="visible = !visible"
      >
        {{ props.title }}
      </div>
    </slot>
  </div>
  <Transition name="fade">
    <div v-if="visible">
      <slot />
    </div>
  </Transition>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
