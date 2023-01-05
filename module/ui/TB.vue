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
        class="transition-color inline-block cursor-pointer rounded border border-gray-400/40 px-4 py-1.5 text-center hover:shadow-sm hover:dark:bg-black/20"
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
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
