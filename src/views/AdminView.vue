<template>
  <AdminLogin v-if="!currentUser || (currentUser.role !== 'Administrador' && currentUser.role !== 'Estoquista')" />
  <div v-else class="admin-root">
    
    <!-- SIDEBAR -->
    <AdminSidebar 
      :tabs="tabs" 
      :active-tab="activeTab" 
      @change-tab="activeTab = $event" 
      @go-home="goHome"
    />

    <!-- MAIN CONTENT AREA -->
    <main class="admin-main">
      
      <!-- TOP STATUS BAR -->
      <AdminHeader 
        :tabs="tabs" 
        :active-tab="activeTab" 
        :current-user="currentUser" 
        @logout="handleLogout"
      />

      <!-- PANELS SWITCHER -->
      <div class="admin-panel-content">
        
        <!-- 1. OVERVIEW PANEL -->
        <div v-if="activeTab === 'overview'" class="panel-overview anim-fade-in">
          
          <!-- KPI GRID -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Faturamento Mensal</span>
                <span class="kpi-badge growth">+12.4%</span>
              </div>
              <p class="kpi-value">R$ 48.920,00</p>
              <p class="kpi-subtitle">Meta de R$ 50k quase atingida</p>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Total de Produtos</span>
                <span class="kpi-icon">◈</span>
              </div>
              <p class="kpi-value">{{ products.length }}</p>
              <p class="kpi-subtitle">{{ products.length }} itens visíveis no grid</p>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Usuários Cadastrados</span>
                <span class="kpi-badge info">Ativos</span>
              </div>
              <p class="kpi-value">{{ users.length }}</p>
              <p class="kpi-subtitle">Clientes & Admins</p>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-title">Taxa de Conversão</span>
                <span class="kpi-badge growth">+0.8%</span>
              </div>
              <p class="kpi-value">3.24%</p>
              <p class="kpi-subtitle">Média do e-commerce: 2.1%</p>
            </div>
          </div>

          <!-- ANALYTICS SECTION -->
          <div class="analytics-row">
            <!-- CHART CARD -->
            <div class="analytics-card chart-card">
              <h3 class="card-headline">Vendas por Mês (R$)</h3>
              
              <div class="custom-bar-chart">
                <div v-for="bar in chartData" :key="bar.month" class="chart-column">
                  <div class="column-bar-wrap">
                    <div class="column-bar" :style="{ height: `${bar.percentage}%` }">
                      <span class="bar-value">R$ {{ bar.val }}k</span>
                    </div>
                  </div>
                  <span class="column-label">{{ bar.month }}</span>
                </div>
              </div>
            </div>

            <!-- LOGS CARD -->
            <div class="analytics-card logs-card">
              <h3 class="card-headline">Atividade Recente</h3>
              <div class="activity-logs">
                <div v-for="log in activityLogs" :key="log.time" class="log-item">
                  <div class="log-dot" :class="log.type"></div>
                  <div class="log-info">
                    <p class="log-text">{{ log.text }}</p>
                    <span class="log-time">{{ log.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- 2. PRODUCTS PANEL -->
        <ProductsPanel 
          v-else-if="activeTab === 'products'" 
          @show-toast="showToast" 
          @add-log="activityLogs.unshift($event)" 
        />

        <!-- 3. USERS PANEL -->
        <UsersPanel 
          v-else-if="activeTab === 'users' && currentUser?.role === 'Administrador'" 
          @show-toast="showToast" 
          @add-log="activityLogs.unshift($event)" 
        />

      </div>
    </main>

    <!-- ── MODALS & DRAWER ── -->





    <!-- C. MOCK TOAST -->
    <transition name="toast">
      <div v-if="adminToast" class="admin-toast">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ adminToast }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { products, users, navigateTo, currentUser, logoutAdmin } from '../store'
import AdminLogin from '../components/Admin/AdminLogin.vue'
import AdminSidebar from '../components/Admin/AdminSidebar.vue'
import AdminHeader from '../components/Admin/AdminHeader.vue'
import ProductsPanel from '../components/Admin/ProductsPanel.vue'
import UsersPanel from '../components/Admin/UsersPanel.vue'

function handleLogout() {
  logoutAdmin()
}

const activeTab = ref('overview')




const formLoading = ref(false)
const adminToast = ref(null)

const tabs = computed(() => {
  const list = [
    { id: 'overview', label: 'Painel Geral' },
    { id: 'products', label: 'Gerenciar Produtos' }
  ]
  if (currentUser.value?.role === 'Administrador') {
    list.push({ id: 'users', label: 'Gerenciar Usuários' })
  }
  return list
})

const sizeOptions = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40', '42', '44']

// KPI Chart data
const chartData = [
  { month: 'Jan', val: 24, percentage: 48 },
  { month: 'Fev', val: 32, percentage: 64 },
  { month: 'Mar', val: 28, percentage: 56 },
  { month: 'Abr', val: 42, percentage: 84 },
  { month: 'Mai', val: 48.9, percentage: 98 },
]

// Mock logs
const activityLogs = ref([
  { text: 'Elizabeth D. alterou preço de Vestido Midi', time: 'Há 5 min', type: 'info' },
  { text: 'Ana Silva efetuou um cadastro pelo modal', time: 'Há 20 min', type: 'user' },
  { text: 'Produto Calça Wide Leg teve estoque atualizado', time: 'Há 1 hora', type: 'success' },
  { text: 'Carlos Santos cadastrado como novo cliente', time: 'Há 2 horas', type: 'user' }
])

// Filtered lists




// TOAST
function showToast(msg) {
  adminToast.value = msg
  setTimeout(() => adminToast.value = null, 2800)
}

function goHome() {
  navigateTo('#/')
}
</script>

<style scoped>
/* GENERAL STYLING (Premium Luxury Dark Theme) */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-root {
  display: flex;
  min-height: 100vh;
  background: #120d0a; /* Dark warm brown/black */
  color: #faf8f5;
  font-family: 'DM Sans', sans-serif;
}



/* MAIN CONTAINER */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}



/* PANEL CONTENT */
.admin-panel-content {
  padding: 40px;
  overflow-y: auto;
  flex: 1;
}

/* 1. OVERVIEW PANEL */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.kpi-card {
  background: #1a1410;
  border: 1px solid #2d231b;
  border-radius: 4px;
  padding: 24px;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-size: 12px;
  font-weight: 500;
  color: #a89880;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kpi-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 2px;
}

.kpi-badge.growth {
  background: rgba(90, 122, 90, 0.15);
  color: #a3caa3;
}

.kpi-badge.info {
  background: rgba(139, 111, 71, 0.15);
  color: #d4b896;
}

.kpi-icon {
  color: #8b6f47;
  font-size: 12px;
}

.kpi-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 600;
  color: #faf8f5;
  line-height: 1.1;
  margin-bottom: 6px;
}

.kpi-subtitle {
  font-size: 11px;
  color: #6b5543;
}

/* ANALYTICS CARD GRID */
.analytics-row {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}

.analytics-card {
  background: #1a1410;
  border: 1px solid #2d231b;
  border-radius: 4px;
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.card-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 600;
  color: #faf8f5;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
}

/* RAW CSS BAR CHART */
.custom-bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  border-bottom: 1px solid #2d231b;
  padding-bottom: 8px;
  gap: 16px;
  margin-top: 16px;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.column-bar-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.column-bar {
  width: 24px;
  background: linear-gradient(to top, #3d2f1e 0%, #8b6f47 100%);
  border-radius: 2px 2px 0 0;
  position: relative;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.column-bar:hover {
  background: linear-gradient(to top, #8b6f47 0%, #faf8f5 100%);
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 10px;
  color: #faf8f5;
  font-weight: 600;
  white-space: nowrap;
}

.column-label {
  font-size: 11px;
  color: #a89880;
}

/* RECENT ACTIVITY LOGS */
.activity-logs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.log-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.log-dot.info { background: #8b6f47; }
.log-dot.user { background: #4a6080; }
.log-dot.success { background: #5a7a5a; }

.log-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.log-text {
  font-size: 12.5px;
  color: #faf8f5;
  line-height: 1.4;
}

.log-time {
  font-size: 10.5px;
  color: #6b5543;
}

/* 2. CRUD LAYOUTS (Products & Users) */
.table-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-box-wrap {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 13px;
  color: #a89880;
}

.admin-search-input {
  width: 100%;
  background: #1a1410;
  border: 1px solid #2d231b;
  border-radius: 2px;
  padding: 12px 12px 12px 42px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: #faf8f5;
  outline: none;
  transition: all 0.25s;
}

.admin-search-input:focus {
  border-color: #8b6f47;
  background: #251d17;
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
}

.admin-primary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #8b6f47;
  border: 1px solid #8b6f47;
  color: #faf8f5;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}

.admin-primary-btn:hover {
  background: transparent;
  color: #faf8f5;
}

.admin-primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-secondary-btn {
  background: none;
  border: 1px solid #2d231b;
  color: #a89880;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
}

.admin-secondary-btn:hover {
  border-color: #8b6f47;
  color: #faf8f5;
}

/* PREMIUM TABLE */
.table-wrapper {
  background: #1a1410;
  border: 1px solid #2d231b;
  border-radius: 4px;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  padding: 16px 24px;
  border-bottom: 1px solid #2d231b;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a89880;
}

.admin-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #2d231b;
  font-size: 13.5px;
  color: #faf8f5;
  vertical-align: middle;
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.admin-table tr:hover td {
  background: #251d17;
}

.text-secondary {
  color: #a89880;
}

.text-right {
  text-align: right;
}

/* Row elements */


.actions-cell {
  white-space: nowrap;
}

.table-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  margin-left: 6px;
  transition: all 0.2s;
}

.table-action-btn.edit {
  color: #a89880;
}
.table-action-btn.edit:hover {
  background: rgba(139, 111, 71, 0.15);
  color: #8b6f47;
}

.table-action-btn.delete {
  color: #c9938a;
}
.table-action-btn.delete:hover:not(:disabled) {
  background: rgba(234, 67, 53, 0.15);
  color: #ea4335;
}
.table-action-btn.delete:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.table-empty-row {
  text-align: center;
  padding: 48px !important;
  color: #a89880;
  font-size: 14px;
}

/* User avatar and cells */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3d2f1e;
  color: #d4b896;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.user-avatar.admin {
  background: #8b6f47;
  color: #fff;
}

.user-name {
  font-weight: 500;
}

.role-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}
.role-badge.administrador {
  background: rgba(139, 111, 71, 0.15);
  color: #d4b896;
  border: 1px solid rgba(139, 111, 71, 0.3);
}
.role-badge.estoquista {
  background: rgba(74, 144, 226, 0.15);
  color: #4a90e2;
  border: 1px solid rgba(74, 144, 226, 0.3);
}
.role-badge.cliente {
  background: rgba(255, 255, 255, 0.05);
  color: #a89880;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.status-badge.ativo {
  background: rgba(46, 117, 89, 0.15);
  color: #52c49b;
  border: 1px solid rgba(46, 117, 89, 0.3);
}
.status-badge.inativo {
  background: rgba(220, 100, 100, 0.15);
  color: #ff9999;
  border: 1px solid rgba(220, 100, 100, 0.3);
}

/* ── MODALS AND DRAWERS CSS ── */

/* SIDE DRAWER FOR PRODUCT CRUD */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.6);
  backdrop-filter: blur(8px);
  z-index: 1500;
  display: flex;
  justify-content: flex-end;
}

.drawer-card {
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background: #1a1410;
  border-left: 1px solid #2d231b;
  display: flex;
  flex-direction: column;
  box-shadow: -24px 0 64px rgba(0,0,0,0.5);
  animation: slideLeft 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 24px 32px;
  border-bottom: 1px solid #2d231b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: #faf8f5;
}

.drawer-close-btn {
  background: none;
  border: none;
  color: #a89880;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  transition: color 0.2s;
}
.drawer-close-btn:hover {
  color: #faf8f5;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.drawer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* REAL-TIME PREVIEW CONTAINER */


/* FORM FIELDS */
.admin-form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-form-group label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a89880;
}

.admin-form-group input[type="text"],
.admin-form-group input[type="email"],
.admin-form-group input[type="tel"],
.admin-form-group select {
  background: #120d0a;
  border: 1px solid #2d231b;
  border-radius: 2px;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: #faf8f5;
  outline: none;
  transition: all 0.25s;
}

.admin-form-group input:focus,
.admin-form-group select:focus {
  border-color: #8b6f47;
  background: #251d17;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.admin-form-group input[type="color"] {
  height: 42px;
  border: 1px solid #2d231b;
  background: none;
  cursor: pointer;
  width: 100%;
  padding: 2px;
  border-radius: 2px;
}

.sizes-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}

.size-checkbox-lbl {
  cursor: pointer;
  position: relative;
}

.size-checkbox-lbl input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.size-box {
  display: block;
  text-align: center;
  padding: 6px;
  background: #120d0a;
  border: 1px solid #2d231b;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 500;
  color: #a89880;
  transition: all 0.2s;
}

.size-checkbox-lbl input:checked ~ .size-box {
  background: #8b6f47;
  border-color: #8b6f47;
  color: #fff;
}

.w-full {
  width: 100%;
}

.drawer-footer-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.drawer-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* USER CREATION MODAL */
.user-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.6);
  backdrop-filter: blur(8px);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.user-modal-card {
  width: 100%;
  max-width: 420px;
  background: #1a1410;
  border: 1px solid #2d231b;
  border-radius: 4px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
}

.user-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #2d231b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-modal-header h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 600;
  color: #faf8f5;
}

.user-modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

/* TOAST STYLING */
.admin-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #8b6f47;
  color: #faf8f5;
  padding: 12px 24px;
  border-radius: 2px;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 2500;
  white-space: nowrap;
}

/* TRANSITIONS */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.35s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-fade-enter-active .drawer-card { animation: slideLeft 0.35s ease; }
.drawer-fade-leave-active .drawer-card { animation: slideRight 0.3s ease; }

@keyframes slideRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

.modal-scale-enter-active, .modal-scale-leave-active { transition: opacity 0.25s ease; }
.modal-scale-enter-from, .modal-scale-leave-to { opacity: 0; }
.modal-scale-enter-active .user-modal-card { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes zoomIn {
  from { transform: scale(0.9) translateY(8px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }

.anim-fade-in {
  animation: fadeIn 0.4s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .analytics-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-root {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2d231b;
  }
  .sidebar-header {
    padding: 16px 24px;
  }
  .sidebar-nav {
    flex-direction: row;
    padding: 12px 24px;
    overflow-x: auto;
    gap: 8px;
  }
  .nav-item {
    padding: 8px 16px;
    font-size: 12.5px;
    white-space: nowrap;
  }
  .sidebar-footer {
    display: none;
  }
  .admin-header {
    height: 64px;
    padding: 0 24px;
  }
  .admin-panel-content {
    padding: 24px 16px;
  }
}


</style>
