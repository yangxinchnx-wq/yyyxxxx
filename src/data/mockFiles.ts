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
})`,

  // Mode rules markdown files
  'BlogSystem/rules/normal_rules.md': `# 普通模式控制规则 (Normal Mode Rules)

## 📌 基础定义与权限沙盒
普通模式是 SoloForge 平台预设的基础运行模式。此状态下的一切代码执行、AI 生成都以「安全、合规」为绝对优先级。

## 🔒 核心控制限制
1. **指令阻断**：所有涉敏、可能修改系统内核、注册表的脚本会在底层自动丢弃。
2. **沙盒防御**：网络端口、外部链接请求需要用户确认或由虚拟代理接管。
3. **用户手动确认**：自动执行开关关闭，所有命令均需点击确认，确保完全受控。`,

  'BlogSystem/rules/performance_rules.md': `# 性能模式控制规则 (Performance Mode Rules)

## 📌 基础定义与性能对齐
性能模式致力于通过低时延开销、增量式解析来满足极高强度的开发体验。

## ⚡ 核心控制限制
1. **流式缓存**：启用全流式输入/输出过滤，去除冗余的上下文留痕与全量标记校验。
2. **多线程并发**：在后台线程中预处理文件更改，对常规静态资源开启惰性加载机制。
3. **内存压缩**：对 10 轮前的历史交互信息执行有损向量切片压缩，节省内存开销。`,

  'BlogSystem/rules/expert_rules.md': `# 专家模式控制规则 (Expert Mode Rules)

## 📌 基础定义与自动化赋能
专家模式下，IDE 具备中等强度的全自动处理指令权限，专门用于深度代码解构、重构。

## 🧠 核心控制限制
1. **自动前置验证**：编辑代码后，后台静默执行 AST 树检验、接口对齐以及未引用变量扫描。
2. **智能合并与拆分**：主动重构组件结构，对高耦合的 Vue/React 模块推荐或自动应用微服务化重塑。
3. **静默依赖修补**：当遇到依赖缺失时，IDE 可静默调用本地加速源包补全，避免构建阻断。`,

  'BlogSystem/rules/ultimate_rules.md': `# 极致模式控制规则 (Ultimate Mode Rules)

## 📌 基础定义与火力无限
解开全部 CPU、GPU 算力限制，实现 100% 全自动专家决策与重试回路。

## 🔥 核心控制限制
1. **全力并发计算**：开启 CPU 超线程任务管线与本地并行 GPU 加速渲染对齐。
2. **自我纠错重试**：当后台编译报错或测试未通过时，允许 AI 在不干扰前台的前提下自主回溯并重试最多 5 次。
3. **无缝混合大上下文**：开启跨多向量库全量召回检索，提供 100% RAG 全景记忆注入。
4. **极致发烧狂热**：针对编写的所有基础文件施加最优算法，极光代码即刻生成。`,

  // Sample local font files (Represented as Base64/mock text)
  'BlogSystem/assets/fonts/Custom-GeekFont.ttf': `data:font/ttf;base64,AAEAAAASAQAABAAgRkZUTVbXF0UAAAEsAAAAHEdERUYAFQAKAAABTAAAAB5HUE9TCoIKpAAAAWwAAAAYR1NVQgALAAEAAAFsAAAADk9TLzIeGg8RAAABgAAAAGBjbWFwA7QDvAAAAuAAAABoZ2FzcAAAABAAAALgAAAACGdseWYpXN2MAAAC8AAAAKhoZWFkAhX1pQAAAMgAAAA2aGhoYQUFAbUAAAD4AAAAJGhtdHghYAAAAAEEAAAAFGxvY2FsAAYAAAAAAtAAAAAMbWF4cAAXAA0AAAE8AAAAIG5hbWUAvZ97AAADFAAAAFhwb3N0AAMAAAADCAAAACAAAwGAAfAABQADApQC9gAAAFMC9AL2AAACsgBtA8gAAAIAAgIAAAAAAAbAA`,
  'BlogSystem/assets/fonts/TechMono-Retro.woff2': `data:font/woff2;base64,d09GMgABAAAAAAQwAAoAAAAADAAAAOwAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYGYABQAicb0D0bHAZgAIAYCAgBCg0KDAgSLAoEABQgA0AABHAGGwwHAG46OnNfAAAAAA==`
};
