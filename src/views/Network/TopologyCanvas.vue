<template>
  <div class="topology-container">
    <div class="toolbar">
      <button @click="addDevice('Router')">添加路由器</button>
      <button @click="addDevice('Switch')">添加交换机</button>
    </div>
    
    <div ref="canvasRef" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Graph, Shape } from '@antv/x6';
import { register } from '@antv/x6-vue-shape';
import DeviceNode from './DeviceNode.vue';
// import { Graph, Shape } from '@antv/x6'; // 👈 加上 Shape

const canvasRef = ref<HTMLDivElement | null>(null);
let graph: Graph;

// 1. 定义网络接口的统一视觉样式
const EVE_PORT_MARKUP = {
  tagName: 'circle',
  selector: 'portBody',
};

const EVE_PORT_ATTRS = {
  portBody: {
    r: 6,                 // 端口圆圈大小
    magnet: true,         // 👈 核心：允许从这里拉出网线
    stroke: '#1890ff',    // 蓝色边框
    strokeWidth: 2,
    fill: '#fff',         // 白色实心
    style: { display: 'block' }, // 先常驻显示，方便测试连线
  },
};

// 2. 生成带样式的 4 个标准网口
const getDevicePorts = () => [
  { id: 'e0/0', group: 'connecting', args: { x: 40, y: 0 }, markup: [EVE_PORT_MARKUP], attrs: EVE_PORT_ATTRS },   // Top
  { id: 'e0/1', group: 'connecting', args: { x: 80, y: 40 }, markup: [EVE_PORT_MARKUP], attrs: EVE_PORT_ATTRS },  // Right
  { id: 'e0/2', group: 'connecting', args: { x: 40, y: 80 }, markup: [EVE_PORT_MARKUP], attrs: EVE_PORT_ATTRS },  // Bottom
  { id: 'e0/3', group: 'connecting', args: { x: 0, y: 40 }, markup: [EVE_PORT_MARKUP], attrs: EVE_PORT_ATTRS },   // Left
];

// 👇 把所有需要 DOM 的操作都放进 onMounted 里
onMounted(() => {
  // 核心：注册你的 Vue 自定义节点
  register({
    shape: 'eve-device-node',
    width: 80,
    height: 80,
    component: DeviceNode,
  });

  // 3. 初始化画布
  graph = new Graph({
    container: canvasRef.value!, // 现在安全了，DOM 已经存在
    
    autoResize: true,
    grid: { size: 10, visible: true, type: 'dot' },
    panning: true,
    mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'] },
    
    // // 连线配置
    // connecting: {
    //   snap: { radius: 20 },
    //   allowBlank: false,
    //   allowLoop: false,
    //   createEdge() {
    //     return this.createEdge({
    //       shape: 'edge',
    //       attrs: {
    //         line: { stroke: '#a0a0a0', strokeWidth: 2 }
    //       }
    //     });
    //   }
    // }
// 连线配置
    connecting: {
      snap: { radius: 20 }, // 靠近 20px 时自动吸附
      allowBlank: false,    // 禁止连到空白处
      allowLoop: false,     // 禁止节点连自己
      allowNode: false,     // 禁止直接连到节点主体
      allowPort: true,      // 必须连到具有 magnet: true 的端口上
      router: 'manhattan',  

      createEdge() {
        // 👉 终极修复：直接 new 一个标准的 Edge 实例，既没有 this 问题，也完美符合 TS 类型！
        return new Shape.Edge({
          attrs: {
            line: { 
              stroke: '#a0a0a0', 
              strokeWidth: 2,
              targetMarker: 'classic', // 加上终点箭头
            }
          }
        });
      },
      
      validateConnection({ targetMagnet }) {
        if (!targetMagnet) {
          return false;
        }
        return true;
      }
    }



  });

  // 4. 监听事件：鼠标移入节点显示网口
  graph.on('node:mouseenter', ({ node }) => {
    const ports = node.getPorts();
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/portBody/style/display', 'block');
    });
  });

  // 鼠标移出隐藏
  graph.on('node:mouseleave', ({ node }) => {
    const ports = node.getPorts();
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/portBody/style/display', 'none');
    });
  });

  // 6. 监听连线事件：自动为连线两端加上“网口标签”
  graph.on('edge:connected', ({ edge }) => {
    const sourcePort = edge.getSourcePortId();
    const targetPort = edge.getTargetPortId();
    
    edge.setLabels([
      { attrs: { text: { text: sourcePort } }, position: 0.1 }, // 起点标签
      { attrs: { text: { text: targetPort } }, position: 0.9 }, // 终点标签
    ]);
  });
});

// 添加设备的函数（必须放在 onMounted 外面，不然模板里的按钮访问不到它）
let deviceCount = 0;
const addDevice = (type: string) => {
  deviceCount++;
  // 注意：确保 graph 已经初始化后再调用 addNode
  if (graph) {
    graph.addNode({
      shape: 'eve-device-node',
      x: 100 + (deviceCount * 20),
      y: 150,
      data: {
        label: `${type}-${deviceCount}`,
        running: false,
      },
      ports: getDevicePorts(),
    });
  }
};
</script>

<style scoped>
.topology-container {
  /* 👇 关键修改：改用 fixed 定位，彻底无视任何外层干扰，强行铺满屏幕 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.toolbar {
  height: 50px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-bottom: 1px solid #d9d9d9;
  z-index: 10;
  box-sizing: border-box;
}

.canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
  background: #fafafa;
  overflow: hidden;
}
</style>