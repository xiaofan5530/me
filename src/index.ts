import { type Component } from 'vue'
import TB from './common/TB.vue'
import Btn from './common/Btn.vue'
import Pane from './common/Pane.vue'

export const globals: Array<[string, Component]> = [
  ['TB', TB],
  ['Btn', Btn],
  ['Pane', Pane]
]
