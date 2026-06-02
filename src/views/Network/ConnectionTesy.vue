<template>
  <div class="test-container">
    <div class="toolbar">
      <h3>🔌 X6 连线功能独立验证环境</h3>
      <p>操作说明：鼠标放在左侧节点的“右小蓝点”上，按住左键拖拽至右侧节点的“左小蓝点”上。</p>
    </div>
    
    <div ref="canvasRef" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Graph, Shape } from '@antv/x6';

const canvasRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  // 1. 初始化极简画布
  const graph = new Graph({
    container: canvasRef.value!,
    grid: { size: 10, visible: true, type: 'dot' },
    panning: true,
    
    // 💡 核心连线规则测试区域
    connecting: {
      snap: { radius: 20 }, // 靠近 20px 时自动吸附
      allowBlank: false,    // 禁止连到空白处
      allowLoop: false,     // 禁止节点连自己
      allowNode: false,     // 禁止直接连到节点主体
      allowPort: true,      // 必须连到具有 magnet: true 的端口上
      
      // 创建连线实例（严格类型兼容）
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#1890ff',  // 连线颜色
              strokeWidth: 2,
              targetMarker: 'classic', // 经典箭头
            },
          },
        });
      },
      
      // 校验目标是否合法
      validateConnection({ targetMagnet }) {
        // 只有目标是带有磁性的端口时，才允许吸附并连线成功
        return !!targetMagnet;
      },
    },
  });

  // 2. 准备端口的复用样式
  const portConfig = {
    groups: {
      // 定义出端口（在节点右侧）
      out: {
        position: 'right',
        attrs: {
          circle: { r: 6, magnet: true, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' },
        },
      },
      // 定义入端口（在节点左侧）
      in: {
        position: 'left',
        attrs: {
          circle: { r: 6, magnet: true, stroke: '#52c41a', strokeWidth: 2, fill: '#fff' },
        },
      },
    },
  };

  // 3. 直接在画布上硬编码添加两个最基础的内置矩形节点
  graph.addNode({
    id: 'node-A',
    shape: 'rect',
    x: 100,
    y: 150,
    width: 120,
    height: 50,
    label: '设备 A (起点)',
    attrs: {
      body: { stroke: '#8f8f8f', rx: 5, ry: 5 },
    },
    ports: {
      ...portConfig,
      items: [{ id: 'port-out-1', group: 'out' }], // 给 A 节点添加一个右侧的出端口
    },
  });

  graph.addNode({
    id: 'node-B',
    shape: 'rect',
    x: 400,
    y: 150,
    width: 120,
    height: 50,
    label: '设备 B (终点)',
    attrs: {
      body: { stroke: '#8f8f8f', rx: 5, ry: 5 },
    },
    ports: {
      ...portConfig,
      items: [{ id: 'port-in-1', group: 'in' }], // 给 B 节点添加一个左侧的入端口
    },
  });
});
</script>

<style scoped>
.test-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #f5f5f5;
}

.toolbar {
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 10px 20px;
  box-sizing: border-box;
}

.toolbar h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.toolbar p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>