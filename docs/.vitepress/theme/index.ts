import DefaultTheme from "vitepress/theme"
import "./main.css"

const defineTheme = (arg: typeof DefaultTheme) => arg

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app }) {},
})
