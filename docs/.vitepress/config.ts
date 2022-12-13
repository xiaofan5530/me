import { defineConfig } from 'vitepress'
import sidebar from './sidebar.json'

export default defineConfig({
  title: 'Digital Garden',
  description: 'a personal blogs powered by vitepress',
  lastUpdated: true,
  // cleanUrls: 'without-subfolders',

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
    nav: [
      { text: '日常', link: '/posts/', activeMatch: '/posts' },
      { text: '笔记', link: '/notes/', activeMatch: '/notes' },
      { text: '练习', link: '/demos/', activeMatch: '/demos' }
    ],
    sidebar
  }
})
