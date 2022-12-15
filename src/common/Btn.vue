<template>
  <button class="btn">
    <slot />
  </button>
</template>

<style>
.btn {
  @apply flex min-w-[12px] select-none rounded border border-solid border-white/10 bg-white/5 px-3 py-1.5 text-center text-sm transition-colors hover:bg-white/10 dark:border-black/10 dark:bg-black/10 hover:dark:bg-black/20;
}
</style>
