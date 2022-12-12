import DefaultTheme from 'vitepress/theme'
import './main.css'
import { globals } from '../../../src/index'

const defineTheme = (arg: typeof DefaultTheme) => arg

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app }) {
    globals.forEach(([name, component]) => {
      app.component(name, component)
    })
  }
})
