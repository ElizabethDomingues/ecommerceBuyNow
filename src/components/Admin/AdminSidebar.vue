<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <span class="logo-icon">◈</span>
      <span class="logo-text">AURÊ <span class="logo-badge">ADMIN</span></span>
    </div>

    <nav class="sidebar-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="nav-item"
        :class="{ active: activeTab === tab.id }"
        @click="$emit('change-tab', tab.id)"
      >
        <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="tab.id === 'overview'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path v-if="tab.id === 'products'" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <path v-if="tab.id === 'users'" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle v-if="tab.id === 'users'" cx="9" cy="7" r="4"/>
        </svg>
        {{ tab.label }}
      </button>
    </nav>

    <div class="sidebar-footer">
      <button class="back-store-btn" @click="$emit('go-home')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar para a Loja
      </button>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  activeTab: String
})
const emit = defineEmits(['change-tab', 'go-home'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

.admin-sidebar {
  width: 260px;
  background: #1a1410;
  border-right: 1px solid #2d231b;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #2d231b;
}

.logo-icon {
  font-size: 20px;
  color: #8b6f47;
}

.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #faf8f5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-badge {
  font-family: 'DM Sans', sans-serif;
  font-size: 8px;
  background: #8b6f47;
  color: #faf8f5;
  padding: 2px 4px;
  border-radius: 2px;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.sidebar-nav {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: #a89880;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: #251d17;
  color: #faf8f5;
}

.nav-item.active {
  background: #8b6f47;
  color: #faf8f5;
}

.nav-icon {
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 24px 16px;
  border-top: 1px solid #2d231b;
}

.back-store-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #251d17;
  border: 1px solid #2d231b;
  color: #d4b896;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.25s;
}

.back-store-btn:hover {
  background: #faf8f5;
  color: #1a1410;
}
</style>
