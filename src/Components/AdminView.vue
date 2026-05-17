<template>
  <div class="admin-root">
    
    <!-- SIDEBAR -->
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
          @click="activeTab = tab.id"
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
        <button class="back-store-btn" @click="goHome">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar para a Loja
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="admin-main">
      
      <!-- TOP STATUS BAR -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="page-title">{{ tabs.find(t => t.id === activeTab)?.label }}</h1>
        </div>
        <div class="header-right">
          <div class="admin-user-profile">
            <div class="profile-avatar">E</div>
            <div class="profile-info">
              <p class="profile-name">Elizabeth D.</p>
              <p class="profile-role">Administradora</p>
            </div>
          </div>
        </div>
      </header>

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
        <div v-else-if="activeTab === 'products'" class="panel-products anim-fade-in">
          
          <div class="table-actions-row">
            <div class="search-box-wrap">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar produtos..." 
                v-model="productSearch" 
                class="admin-search-input"
              />
            </div>
            
            <button class="admin-primary-btn" @click="openProductDrawer(null)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo Produto
            </button>
          </div>

          <!-- TABLE -->
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Visual</th>
                  <th>Produto</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prod in filteredProducts" :key="prod.id">
                  <td>
                    <div class="table-prod-preview" :style="{ background: prod.color }">
                      <svg width="24" height="36" viewBox="0 0 120 180" fill="none">
                        <path :d="prod.shape" :fill="prod.shapeColor || '#8b6f47'" opacity="0.8"/>
                      </svg>
                    </div>
                  </td>
                  <td>
                    <div class="table-prod-name-wrap">
                      <p class="table-prod-name">{{ prod.name }}</p>
                      <span v-if="prod.badge" class="badge-pill" :class="prod.badge.type">
                        {{ prod.badge.label }}
                      </span>
                    </div>
                  </td>
                  <td><span class="text-secondary">{{ prod.brand }}</span></td>
                  <td><span class="category-chip">{{ prod.categoria }}</span></td>
                  <td><span class="table-price">{{ prod.price }}</span></td>
                  <td class="text-right actions-cell">
                    <button class="table-action-btn edit" @click="openProductDrawer(prod)" title="Editar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/>
                      </svg>
                    </button>
                    <button class="table-action-btn delete" @click="confirmDeleteProduct(prod)" title="Excluir">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="6" class="table-empty-row">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- 3. USERS PANEL -->
        <div v-else-if="activeTab === 'users'" class="panel-users anim-fade-in">
          
          <div class="table-actions-row">
            <div class="search-box-wrap">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar usuários..." 
                v-model="userSearch" 
                class="admin-search-input"
              />
            </div>
            
            <button class="admin-primary-btn" @click="showUserModal = true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo Usuário
            </button>
          </div>

          <!-- TABLE -->
          <div class="table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Perfil</th>
                  <th>Data de Cadastro</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar" :class="{ admin: user.role === 'Administrador' }">
                        {{ user.name.charAt(0) }}
                      </div>
                      <span class="user-name">{{ user.name }}</span>
                    </div>
                  </td>
                  <td><span class="text-secondary">{{ user.email }}</span></td>
                  <td><span class="text-secondary">{{ user.phone || 'N/A' }}</span></td>
                  <td>
                    <span class="role-badge" :class="user.role.toLowerCase()">
                      {{ user.role }}
                    </span>
                  </td>
                  <td><span class="text-secondary">{{ user.date }}</span></td>
                  <td class="text-right actions-cell">
                    <button 
                      class="table-action-btn delete" 
                      @click="confirmDeleteUser(user)" 
                      :disabled="user.id === 1"
                      :title="user.id === 1 ? 'Não é possível remover o administrador principal' : 'Excluir'"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="table-empty-row">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </main>

    <!-- ── MODALS & DRAWER ── -->

    <!-- A. PRODUCT DRAWER (Create/Edit) -->
    <transition name="drawer-fade">
      <div v-if="showProductDrawer" class="drawer-overlay" @click.self="closeProductDrawer">
        <div class="drawer-card">
          
          <div class="drawer-header">
            <h2 class="drawer-title">
              {{ editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto' }}
            </h2>
            <button class="drawer-close-btn" @click="closeProductDrawer">✕</button>
          </div>

          <div class="drawer-body">
            <form @submit.prevent="saveProduct" class="drawer-form">
              
              <!-- real-time silhouette preview -->
              <div class="silhouette-preview-box">
                <div class="preview-stage" :style="{ background: productForm.color }">
                  <div class="preview-shadow" :style="{ background: productForm.color2 }"></div>
                  <svg class="preview-svg" viewBox="0 0 120 180" fill="none">
                    <path :d="SHAPES[productForm.shape]" :fill="productForm.shapeColor" opacity="0.8"/>
                  </svg>
                </div>
                <div class="preview-labels">
                  <p class="preview-brand-lbl">{{ productForm.brand || 'Marca' }}</p>
                  <p class="preview-name-lbl">{{ productForm.name || 'Nome do Produto' }}</p>
                  <p class="preview-price-lbl">R$ {{ productForm.price || '0,00' }}</p>
                </div>
              </div>

              <!-- Form inputs -->
              <div class="admin-form-group">
                <label>Nome do Produto</label>
                <input type="text" v-model="productForm.name" required placeholder="Ex: Vestido Midi Floral Lux" />
              </div>

              <div class="form-row-2">
                <div class="admin-form-group">
                  <label>Marca</label>
                  <input type="text" v-model="productForm.brand" required placeholder="Ex: AURÊ, Farm Rio..." />
                </div>
                <div class="admin-form-group">
                  <label>Categoria</label>
                  <select v-model="productForm.categoria" required>
                    <option value="Vestidos">Vestidos</option>
                    <option value="Blusas">Blusas</option>
                    <option value="Calças">Calças</option>
                    <option value="Saias">Saias</option>
                    <option value="Macacões">Macacões</option>
                    <option value="Casacos">Casacos</option>
                  </select>
                </div>
              </div>

              <div class="form-row-2">
                <div class="admin-form-group">
                  <label>Preço (R$)</label>
                  <input type="text" v-model="productForm.price" required placeholder="Ex: 389,90" />
                </div>
                <div class="admin-form-group">
                  <label>Preço Original (opcional)</label>
                  <input type="text" v-model="productForm.originalPrice" placeholder="Ex: 489,90" />
                </div>
              </div>

              <div class="form-row-2">
                <div class="admin-form-group">
                  <label>Silhouette (Molde Visual)</label>
                  <select v-model="productForm.shape" required>
                    <option value="dress">Vestido</option>
                    <option value="blouse">Blusa</option>
                    <option value="pants">Calça</option>
                    <option value="skirt">Saia</option>
                  </select>
                </div>
                <div class="admin-form-group">
                  <label>Cor do Molde</label>
                  <input type="color" v-model="productForm.shapeColor" />
                </div>
              </div>

              <div class="form-row-2">
                <div class="admin-form-group">
                  <label>Cor Principal (Fundo)</label>
                  <input type="color" v-model="productForm.color" />
                </div>
                <div class="admin-form-group">
                  <label>Cor de Destaque</label>
                  <input type="color" v-model="productForm.color2" />
                </div>
              </div>

              <div class="admin-form-group">
                <label>Selos do Produto (Badge)</label>
                <div class="form-row-2">
                  <input type="text" v-model="productForm.badgeLabel" placeholder="Texto (Ex: -20%, Novo)" />
                  <select v-model="productForm.badgeType">
                    <option value="new">Novo (Preto)</option>
                    <option value="sale">Oferta (Laranja)</option>
                    <option value="exclusive">Exclusivo (Dourado)</option>
                    <option value="best">Destaque (Verde)</option>
                  </select>
                </div>
              </div>

              <!-- Sizes checklist -->
              <div class="admin-form-group">
                <label>Tamanhos Disponíveis</label>
                <div class="sizes-checkbox-grid">
                  <label v-for="sz in sizeOptions" :key="sz" class="size-checkbox-lbl">
                    <input type="checkbox" :value="sz" v-model="productForm.sizes" />
                    <span class="size-box">{{ sz }}</span>
                  </label>
                </div>
              </div>

              <div class="drawer-footer-actions">
                <button type="button" class="admin-secondary-btn" @click="closeProductDrawer">Cancelar</button>
                <button type="submit" class="admin-primary-btn w-full" :disabled="formLoading">
                  <span v-if="!formLoading">Salvar Produto</span>
                  <span v-else class="drawer-spinner"></span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </transition>

    <!-- B. USER CREATION MODAL -->
    <transition name="modal-scale">
      <div v-if="showUserModal" class="user-modal-overlay" @click.self="showUserModal = false">
        <div class="user-modal-card">
          
          <div class="user-modal-header">
            <h3>Cadastrar Novo Usuário</h3>
            <button class="drawer-close-btn" @click="showUserModal = false">✕</button>
          </div>

          <form @submit.prevent="saveUser" class="user-modal-form">
            <div class="admin-form-group">
              <label>Nome Completo</label>
              <input type="text" v-model="userForm.name" required placeholder="Ex: Eliza Domingues" />
            </div>

            <div class="admin-form-group">
              <label>E-mail</label>
              <input type="email" v-model="userForm.email" required placeholder="Ex: eliza@example.com" />
            </div>

            <div class="admin-form-group">
              <label>Telefone</label>
              <input type="tel" v-model="userForm.phone" placeholder="Ex: (11) 99999-9999" @input="formatPhone" />
            </div>

            <div class="admin-form-group">
              <label>Perfil de Acesso</label>
              <select v-model="userForm.role" required>
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div class="user-modal-footer">
              <button type="button" class="admin-secondary-btn" @click="showUserModal = false">Cancelar</button>
              <button type="submit" class="admin-primary-btn">Cadastrar</button>
            </div>
          </form>

        </div>
      </div>
    </transition>

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
import { products, users, SHAPES, navigateTo } from '../store'

const activeTab = ref('overview')
const productSearch = ref('')
const userSearch = ref('')
const showProductDrawer = ref(false)
const showUserModal = ref(false)
const editingProduct = ref(null)
const formLoading = ref(false)
const adminToast = ref(null)

const tabs = [
  { id: 'overview', label: 'Painel Geral' },
  { id: 'products', label: 'Gerenciar Produtos' },
  { id: 'users', label: 'Gerenciar Usuários' }
]

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
const filteredProducts = computed(() => {
  if (!productSearch.value.trim()) return products.value
  const query = productSearch.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.brand.toLowerCase().includes(query) ||
    p.categoria.toLowerCase().includes(query)
  )
})

const filteredUsers = computed(() => {
  if (!userSearch.value.trim()) return users.value
  const query = userSearch.value.toLowerCase()
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  )
})

// Forms
const productForm = reactive({
  name: '',
  brand: '',
  categoria: 'Vestidos',
  price: '',
  originalPrice: '',
  shape: 'dress',
  shapeColor: '#8b6f47',
  color: '#e8ddd0',
  color2: '#d4c4b0',
  badgeLabel: '',
  badgeType: 'new',
  sizes: []
})

const userForm = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'Cliente'
})

// DRAWER ACTIONS
function openProductDrawer(prod = null) {
  if (prod) {
    editingProduct.value = prod
    productForm.name = prod.name
    productForm.brand = prod.brand
    productForm.categoria = prod.categoria
    productForm.price = prod.price.replace('R$ ', '')
    productForm.originalPrice = prod.originalPrice ? prod.originalPrice.replace('R$ ', '') : ''
    productForm.shape = Object.keys(SHAPES).find(key => SHAPES[key] === prod.shape) || 'dress'
    productForm.shapeColor = prod.shapeColor || '#8b6f47'
    productForm.color = prod.color
    productForm.color2 = prod.color2
    productForm.badgeLabel = prod.badge ? prod.badge.label : ''
    productForm.badgeType = prod.badge ? prod.badge.type : 'new'
    productForm.sizes = [...prod.sizes]
  } else {
    editingProduct.value = null
    productForm.name = ''
    productForm.brand = 'AURÊ'
    productForm.categoria = 'Vestidos'
    productForm.price = ''
    productForm.originalPrice = ''
    productForm.shape = 'dress'
    productForm.shapeColor = '#8b6f47'
    productForm.color = '#e8ddd0'
    productForm.color2 = '#d4c4b0'
    productForm.badgeLabel = ''
    productForm.badgeType = 'new'
    productForm.sizes = ['P', 'M', 'G']
  }
  showProductDrawer.value = true
}

function closeProductDrawer() {
  showProductDrawer.value = false
  editingProduct.value = null
}

function saveProduct() {
  formLoading.value = true

  setTimeout(() => {
    formLoading.value = false
    
    const formattedPrice = `R$ ${parseFloat(productForm.price.replace(',', '.')).toFixed(2).replace('.', ',')}`
    const formattedOriginalPrice = productForm.originalPrice 
      ? `R$ ${parseFloat(productForm.originalPrice.replace(',', '.')).toFixed(2).replace('.', ',')}`
      : null

    const priceVal = parseFloat(productForm.price.replace(',', '.'))
    const installments = `10x R$ ${(priceVal / 10).toFixed(2).replace('.', ',')}`

    const badge = productForm.badgeLabel 
      ? { label: productForm.badgeLabel, type: productForm.badgeType } 
      : null

    const productPayload = {
      name: productForm.name,
      brand: productForm.brand,
      categoria: productForm.categoria,
      price: formattedPrice,
      originalPrice: formattedOriginalPrice,
      installments,
      shape: SHAPES[productForm.shape],
      shapeColor: productForm.shapeColor,
      color: productForm.color,
      color2: productForm.color2,
      badge,
      sizes: [...productForm.sizes],
      colorOptions: [productForm.color, productForm.color2, '#1a1410'],
      rating: editingProduct.value ? editingProduct.value.rating : 5.0,
      reviews: editingProduct.value ? editingProduct.value.reviews : 1
    }

    if (editingProduct.value) {
      // Edit mode
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index >= 0) {
        products.value[index] = { 
          ...products.value[index], 
          ...productPayload 
        }
        showToast('Produto atualizado com sucesso!')
        
        // Log activity
        activityLogs.value.unshift({
          text: `Elizabeth D. atualizou o produto: ${productPayload.name}`,
          time: 'Agora',
          type: 'info'
        })
      }
    } else {
      // Create mode
      const newProduct = {
        id: products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1,
        ...productPayload
      }
      products.value.unshift(newProduct)
      showToast('Produto adicionado ao catálogo!')
      
      // Log activity
      activityLogs.value.unshift({
        text: `Elizabeth D. cadastrou novo produto: ${newProduct.name}`,
        time: 'Agora',
        type: 'success'
      })
    }

    closeProductDrawer()
  }, 1000)
}

function confirmDeleteProduct(prod) {
  if (confirm(`Tem certeza que deseja excluir o produto "${prod.name}" do catálogo?`)) {
    products.value = products.value.filter(p => p.id !== prod.id)
    showToast('Produto removido do catálogo.')
    
    // Log activity
    activityLogs.value.unshift({
      text: `Elizabeth D. excluiu o produto: ${prod.name}`,
      time: 'Agora',
      type: 'info'
    })
  }
}

// USER ACTIONS
function saveUser() {
  const newUser = {
    id: users.value.length ? Math.max(...users.value.map(u => u.id)) + 1 : 1,
    name: userForm.name,
    email: userForm.email,
    phone: userForm.phone,
    role: userForm.role,
    date: new Date().toLocaleDateString('pt-BR')
  }
  
  users.value.unshift(newUser)
  showUserModal.value = false
  
  // Reset
  userForm.name = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.role = 'Cliente'
  
  showToast('Usuário cadastrado com sucesso!')
  
  activityLogs.value.unshift({
    text: `Elizabeth D. registrou usuário: ${newUser.name} (${newUser.role})`,
    time: 'Agora',
    type: 'user'
  })
}

function confirmDeleteUser(user) {
  if (confirm(`Tem certeza que deseja remover o acesso de "${user.name}"?`)) {
    users.value = users.value.filter(u => u.id !== user.id)
    showToast('Usuário removido com sucesso.')
    
    activityLogs.value.unshift({
      text: `Elizabeth D. removeu o usuário: ${user.name}`,
      time: 'Agora',
      type: 'info'
    })
  }
}

function formatPhone(e) {
  let val = e.target.value.replace(/\D/g, '')
  if (val.length > 11) val = val.substring(0, 11)
  
  if (val.length > 10) {
    e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`
  } else if (val.length > 6) {
    e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 6)}-${val.substring(6)}`
  } else if (val.length > 2) {
    e.target.value = `(${val.substring(0, 2)}) ${val.substring(2)}`
  } else if (val.length > 0) {
    e.target.value = `(${val}`
  }
  userForm.phone = e.target.value
}

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

/* SIDEBAR */
.admin-sidebar {
  width: 260px;
  background: #1a1410;
  border-right: 1px solid #2d231b;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
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

/* MAIN CONTAINER */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* HEADER */
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
.table-prod-preview {
  width: 36px;
  height: 48px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.table-prod-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-prod-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-weight: 600;
}

.badge-pill {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 1px;
  display: inline-block;
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-pill.new { background: #120d0a; color: #d4b896; border: 1px solid #d4b896; }
.badge-pill.sale { background: #c0714a; color: #fff; }
.badge-pill.exclusive { background: #8b6f47; color: #fff; }
.badge-pill.best { background: #5a7a5a; color: #fff; }

.category-chip {
  background: #251d17;
  color: #d4b896;
  border: 1px solid #2d231b;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-price {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  color: #faf8f5;
}

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
.role-badge.cliente {
  background: rgba(255, 255, 255, 0.05);
  color: #a89880;
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
.silhouette-preview-box {
  background: #120d0a;
  border: 1px solid #2d231b;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.preview-stage {
  width: 60px;
  height: 80px;
  border-radius: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.preview-shadow {
  position: absolute;
  inset: 0;
  opacity: 0.35;
}

.preview-svg {
  width: 60%;
  height: 80%;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.preview-labels {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.preview-brand-lbl {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #8b6f47;
  text-transform: uppercase;
}

.preview-name-lbl {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 500;
  color: #faf8f5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-price-lbl {
  font-size: 12.5px;
  font-weight: 600;
  color: #faf8f5;
}

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
