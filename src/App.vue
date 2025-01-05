<script setup lang="ts">

import { RouterLink, RouterView, useRouter} from 'vue-router'

</script>

<template>

  <h1>
    <nav>
    <RouterLink to="/">Home</RouterLink>|
    <RouterLink to="/about">About</RouterLink>|
    <RouterLink to="/login">Login</RouterLink>
  </nav>
</h1>

  <RouterView />
</template>

