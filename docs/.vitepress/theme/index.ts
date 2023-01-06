import DefaultTheme from 'vitepress/theme'
import './main.css'
import { globals } from '../../../module/index'
import nprogress from 'nprogress'
import './nprogress.css'

const defineTheme = (theme: typeof DefaultTheme) => theme

export default defineTheme({
  ...DefaultTheme,

  enhanceApp({ app, router }) {
    globals.forEach(([name, component]) => {
      app.component(name, component)
    })

    // nprogress
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        nprogress.configure({ showSpinner: false })

        const cacheBeforeRouteChange = router.onBeforeRouteChange
        const cacheAfterRouteChange = router.onAfterRouteChanged
        router.onBeforeRouteChange = to => {
          nprogress.start()
          cacheBeforeRouteChange?.(to)
        }
        router.onAfterRouteChanged = to => {
          nprogress.done()
          cacheAfterRouteChange?.(to)
        }
      })
    }
  }
})
