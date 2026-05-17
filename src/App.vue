<script setup lang="ts">
import { currentRoute } from './store';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import Navbar from './Components/Navbar.vue';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import ProductGrid from './ProductGrid.vue';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import AdminView from './Components/AdminView.vue';
</script>

<template>
  <div class="app-container">
    <template v-if="currentRoute === '#/admin'">
      <AdminView />
    </template>
    <template v-else>
      <Navbar />
      <ProductGrid />
    </template>
  </div>
</template>

<style>
/* Reset and global styles */
body {
  margin: 0;
  padding: 0;
  background: #faf8f5;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
