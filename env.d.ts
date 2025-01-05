/// <reference types="vite/client" />
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
// 这个是为了解决vite中无法识别.vue文件的问题