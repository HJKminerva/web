<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToShortcuts = () => {
  // 使用 Vue Router 内部无刷新跳转
  router.push('/shortcuts')
}
</script>

<template>
  <main class="container">
    <div class="shortcut-header">
      <h1 class="title">Shortcuts</h1>
      <!-- 方式 1: 绑定点击事件跳转 -->
      <button class="btn" @click="goToShortcuts">Go to Shortcuts</button>

      <!-- 方式 2: 也可以直接用 <router-link> 标签 -->
      <!-- <router-link to="/shortcuts" class="btn">Go to Shortcuts</router-link> -->
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
}

.shortcut-header {
  display: flex;
  align-items: center;
  gap: 16px; /* 标题和按钮之间的间距 */
}

.title {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.btn {
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  background-color: #4f46e5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none; /* 针对 router-link 的样式清除 */
}

.btn:hover {
  background-color: #4338ca;
}
</style>