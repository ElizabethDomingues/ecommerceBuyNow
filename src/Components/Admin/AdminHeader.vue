<template>
  <header class="admin-header">
    <div class="header-left">
      <h1 class="page-title">{{ tabs.find(t => t.id === activeTab)?.label }}</h1>
    </div>
    <div class="header-right" style="display: flex; align-items: center; gap: 20px;">
      <div class="admin-user-profile">
        <div class="profile-avatar">
          {{ currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'E' }}
        </div>
        <div class="profile-info">
          <p class="profile-name">{{ currentUser?.name || 'Elizabeth D.' }}</p>
          <p class="profile-role">
            {{ currentUser?.role === 'Administrador' ? 'Administradora' : (currentUser?.role === 'Estoquista' ? 'Estoquista' : currentUser?.role || 'Administradora') }}
          </p>
        </div>
      </div>
      <button class="logout-admin-btn" @click="$emit('logout')" title="Sair do Painel">
        <svg class="logout-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  activeTab: String,
  currentUser: Object
})

defineEmits(['logout'])
</script>

<style scoped>
.admin-header {
  height: 80px;
  border-bottom: 1px solid #2d231b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 500;
  color: #faf8f5;
}

.admin-user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #8b6f47;
  color: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 13px;
  font-weight: 600;
}

.profile-role {
  font-size: 10px;
  color: #a89880;
  letter-spacing: 0.05em;
}

.logout-admin-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #a89880;
  border: 1px solid rgba(168, 152, 128, 0.2);
  padding: 8px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.25s ease;
}

.logout-admin-btn:hover {
  color: #faf8f5;
  border-color: #8b6f47;
  background: rgba(139, 111, 71, 0.1);
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.08);
}

.logout-icon {
  transition: transform 0.2s ease;
}

.logout-admin-btn:hover .logout-icon {
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .admin-header {
    height: 64px;
    padding: 0 24px;
  }
}
</style>
