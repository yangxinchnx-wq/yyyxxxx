export const mockFileContents: Record<string, string> = {
  'BlogSystem/src/App.vue': `<template>
  <div id="app">
    <Header />
    <RouterView />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>`,

  'BlogSystem/src/main.js': `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')`,

  'BlogSystem/.gitignore': `node_modules
.DS_Store
dist
dist-ssr
*.local
.env
.env.*
.vscode`,

  'BlogSystem/package.json': `{
  "name": "vite-blog-system",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.2.0"
  }
}`,

  'BlogSystem/README.md': `# Vue3 Blog System

An elegant developer personal blog built with Vue 3, Vite, and custom theme layouts.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\``,

  'BlogSystem/vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})`
};
