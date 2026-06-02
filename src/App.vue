<script setup lang="ts">

import { RouterLink, RouterView, useRouter} from 'vue-router'

</script>

<template>
  <!-- <h1>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/shortcuts">快捷键管理</router-link> 
    </nav>
  </h1> -->

  <RouterView />
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>


