<template>
  <div class="device-node" :class="{ 'is-running': running }">
    
    <div class="port port-left" magnet="true" port-id="in"></div>
    <div class="port port-right" magnet="true" port-id="out"></div>

    <span class="status-dot"></span>
    <div class="icon-wrapper">🌐</div>
    <div class="device-name">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  getNode?: () => any;
}>();

const label = ref('Router');
const running = ref(false);

onMounted(() => {
  if (props.getNode) {
    const node = props.getNode();
    label.value = node.getData()?.label || 'Router';
    running.value = node.getData()?.running || false;

    node.on('change:data', ({ current }: any) => {
      label.value = current?.label || 'Router';
      running.value = current?.running || false;
    });
  }
});
</script>

<style scoped>
/* 原有样式保持不变 */
.device-node {
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 8px;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
}
.device-node:hover {
  border-color: #1890ff;
  background: #fff;
}
.icon-wrapper {
  font-size: 32px;
  filter: grayscale(100%);
  transition: all 0.3s;
}
.is-running .icon-wrapper {
  filter: grayscale(0%);
}
.status-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4d4f;
}
.is-running .status-dot {
  background-color: #52c41a;
  box-shadow: 0 0 6px #52c41a;
}
.device-name {
  font-size: 12px;
  margin-top: 4px;
  color: #333;
}

/* 👉 新增：Vue HTML 网口样式 */
.port {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid #1890ff;
  border-radius: 50%;
  cursor: crosshair; /* 鼠标放上去变成十字星，提示用户可以拉线 */
  z-index: 10;       /* 确保网口层级最高，不会被拦截 */
  transition: all 0.2s;
}
.port:hover {
  background: #1890ff; /* 鼠标悬浮变实心，增强交互感 */
}
/* 左侧网口位置 */
.port-left {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}
/* 右侧网口位置 */
.port-right {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}
</style>