import { defineConfig } from 'vitepress'
import sidebar from './sidebar.json'

export default defineConfig({
  title: 'Digital Garden',
  description: 'a personal blogs powered by vitepress',

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'vitesse-dark'
    }
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
    nav: [
      {
        text: '练习',
        link: '/play/',
        activeMatch: '/play'
      }
    ],
    sidebar
  }
})
