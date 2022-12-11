import { onScopeDispose, reactive, ref, computed, watch } from 'vue'
import { useRafFn } from '@vueuse/core'

export type TimerCommand = 'reset' | 'start' | 'pause'

export interface UseTimerOptions {
  duration?: number
  immediate?: boolean
  format?: (value: number) => string
}

export default function useTimer(options: UseTimerOptions = {}) {
  const {
    duration = 0,
    immediate = false,
    format = (value: number) => value.toString()
  } = options

  const ms = reactive({
    start: 0,
    end: 0,
    duration: 0
  })

  const command = ref<TimerCommand>('reset')
  const timer = computed(() => format(ms.end - ms.start + ms.duration))
  const { pause, resume } = useRafFn(() => (ms.end = Date.now()), {
    immediate: false
  })

  const stop = watch(command, value => {
    if (value == 'reset') {
      ms.start = ms.end = ms.duration = 0
      pause()
    } else if (value == 'start') {
      ms.start = ms.end = Date.now()
      resume()
    } else if (value == 'pause') {
      pause()
      ms.duration = ms.end - ms.start
    } else {
      // @ts-ignore
      let invalidState: never = value
    }
  })

  onScopeDispose(() => stop())

  if (duration) {
    ms.duration = duration
  }
  if (immediate) {
    command.value = 'start'
  }

  return { timer, command }
}
