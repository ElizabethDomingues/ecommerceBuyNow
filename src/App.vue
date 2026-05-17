<script setup lang="ts">
import { currentRoute } from './store/index';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import Navbar from './components/Store/Navbar.vue';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import StoreView from './views/StoreView.vue';

// @ts-ignore: Vue SFC type declaration is not available in current setup
import AdminView from './views/AdminView.vue';
</script>

<template>
  <div class="app-container">
    <template v-if="currentRoute === '#/admin'">
      <AdminView />
    </template>
    <template v-else>
      <Navbar />
      <StoreView />
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
