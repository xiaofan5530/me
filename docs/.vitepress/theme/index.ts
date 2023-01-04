import DefaultTheme from 'vitepress/theme'
import './main.css'
import { globals } from '../../../module/index'

const defineTheme = (theme: typeof DefaultTheme) => theme

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app }) {
    globals.forEach(([name, component]) => {
      app.component(name, component)
    })
  }
})
