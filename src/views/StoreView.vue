<template>
  <div class="pg-root">

    <section class="hero">
      <div class="hero-text">
        <p class="hero-kicker">Coleção Verão 2026</p>
        <h1 class="hero-title">Feminino</h1>
        <p class="hero-sub">{{ filteredProducts.length }} peças selecionadas</p>
      </div>
      <div class="hero-breadcrumb">
        <a href="#">Início</a>
        <span>◈</span>
        <a href="#">Feminino</a>
      </div>
    </section>

    <div class="toolbar">
      <div class="toolbar-left">
        <button class="filter-toggle" @click="filtersOpen = !filtersOpen" :class="{ active: filtersOpen }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="20" y2="12"/>
            <line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          Filtros
          <span v-if="activeFiltersCount > 0" class="filter-count">{{ activeFiltersCount }}</span>
        </button>
        <div class="active-tags">
          <span v-for="tag in activeTags" :key="tag" class="tag" @click="removeTag(tag)">
            {{ tag }} <span class="tag-x">×</span>
          </span>
        </div>
      </div>

      <div class="toolbar-right">
        <span class="sort-label">Ordenar por</span>
        <select v-model="sortBy" class="sort-select">
          <option value="relevance">Relevância</option>
          <option value="newest">Novidades</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="rating">Mais avaliados</option>
        </select>
        <div class="grid-toggle">
          <button :class="{ on: gridCols === 3 }" @click="gridCols = 3" title="3 colunas">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor">
              <rect x="0" y="0" width="4" height="4"/><rect x="7" y="0" width="4" height="4"/><rect x="14" y="0" width="4" height="4"/>
              <rect x="0" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/><rect x="14" y="7" width="4" height="4"/>
              <rect x="0" y="14" width="4" height="4"/><rect x="7" y="14" width="4" height="4"/><rect x="14" y="14" width="4" height="4"/>
            </svg>
          </button>
          <button :class="{ on: gridCols === 2 }" @click="gridCols = 2" title="2 colunas">
            <svg width="14" height="14" viewBox="0 0 14 18" fill="currentColor">
              <rect x="0" y="0" width="5" height="5"/><rect x="9" y="0" width="5" height="5"/>
              <rect x="0" y="8" width="5" height="5"/><rect x="9" y="8" width="5" height="5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="main-layout">

      <SidebarFilter 
        :filters-open="filtersOpen"
        :filter-groups="filterGroups"
        :open-groups="openGroups"
        :selected-filters="selectedFilters"
        :price-range="priceRange"
        :active-filters-count="activeFiltersCount"
        @toggle-group="toggleGroup"
        @toggle-filter="toggleFilter"
        @clear-filters="clearFilters"
        @update:price-range="priceRange = $event"
      />

      <div class="grid-area">
        <transition name="fade">
          <div v-if="showOnlyFavorites" class="favorites-banner">
            <div class="fav-banner-left">
              <span class="fav-banner-icon">♥</span>
              <span>Mostrando apenas seus <strong>{{ filteredProducts.length }} itens favoritos</strong></span>
            </div>
            <button class="fav-banner-close" @click="showOnlyFavorites = false">
              Mostrar todos os produtos ×
            </button>
          </div>
        </transition>

        <div class="product-grid" :class="`cols-${gridCols}`">
          <ProductCard
            v-for="(product, i) in paginatedProducts"
            :key="product.id"
            :product="product"
            :delay="`${i * 60}ms`"
            :wishlist="wishlist"
            @toggle-wishlist="toggleWishlist"
            @add-to-cart="addToCart"
            @quick-add-to-cart="quickAddToCart"
          />
        </div>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p class="empty-icon">{{ showOnlyFavorites ? '♥' : '◈' }}</p>
          <p class="empty-title">{{ showOnlyFavorites ? 'Sua lista de favoritos está vazia' : 'Nenhum produto encontrado' }}</p>
          <p class="empty-sub">{{ showOnlyFavorites ? 'Clique no coração nos produtos para salvá-los aqui.' : 'Tente ajustar os filtros' }}</p>
          <button class="clear-all" @click="showOnlyFavorites ? (showOnlyFavorites = false) : clearFilters()">
            {{ showOnlyFavorites ? 'Ver Todos os Produtos' : 'Limpar filtros' }}
          </button>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button class="pg-btn" :disabled="page === 1" @click="page--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            v-for="p in totalPages" :key="p"
            class="pg-btn num"
            :class="{ active: p === page }"
            @click="page = p"
          >{{ p }}</button>
          <button class="pg-btn" :disabled="page === totalPages" @click="page++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- PREMIUM FOOTER -->
    <StoreFooter />

    <transition name="toast">
      <div v-if="toast" class="toast">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ toast }}
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="showLoginWarningModal" class="warning-modal-overlay" @click.self="showLoginWarningModal = false">
        <div class="warning-modal-card" role="dialog" aria-modal="true">
          <div class="warning-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="warning-title">Acesso Restrito</h3>
          <p class="warning-subtitle">Faça login para utilizar essa opção</p>
          <button class="warning-btn-action" @click="showLoginWarningModal = false">
            Entendido
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import StoreFooter from '../components/Store/StoreFooter.vue'
import SidebarFilter from '../components/Store/SidebarFilter.vue'
import ProductCard from '../components/Store/ProductCard.vue'
import { products, SHAPES, addToCart as storeAddToCart, searchQuery, currentUser, updateUser, showOnlyFavorites } from '../store'

const gridCols    = ref(3)
const filtersOpen = ref(true)
const sortBy      = ref('relevance')
const page        = ref(1)
const perPage     = 9
const hoveredId   = ref(null)
const toast       = ref(null)
const showLoginWarningModal = ref(false)

const wishlist = computed(() => {
  if (currentUser.value) {
    return currentUser.value.favorites || []
  }
  return []
})
const priceRange  = ref([0, 2000])
const openGroups  = ref(['Categoria', 'Tamanho', 'Cor'])
const selectedFilters = reactive({
  categoria: [], tamanho: [], cor: [], marca: []
})

const filterGroups = [
  {
    label: 'Categoria', key: 'categoria', type: 'check',
    options: ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Macacões', 'Casacos']
  },
  {
    label: 'Tamanho', key: 'tamanho', type: 'size',
    options: ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40', '42', '44']
  },
  {
    label: 'Cor', key: 'cor', type: 'color',
    options: [
      { value: 'Preto', hex: '#1a1410' }, { value: 'Branco', hex: '#faf8f5' },
      { value: 'Bege', hex: '#d4b896' },  { value: 'Caramelo', hex: '#8b6f47' },
      { value: 'Terracota', hex: '#c0714a' }, { value: 'Verde', hex: '#5a7a5a' },
      { value: 'Azul', hex: '#4a6080' },  { value: 'Rosa', hex: '#c9938a' },
      { value: 'Bordô', hex: '#7a2a35' }, { value: 'Cinza', hex: '#8a8278' },
    ]
  },
  {
    label: 'Faixa de Preço', key: 'preco', type: 'range', options: []
  },
  {
    label: 'Marca', key: 'marca', type: 'check',
    options: ['Farm Rio', 'Animale', 'Shoulder', 'Forum', 'PatBo', 'Lenny Niemeyer']
  },
]

const activeTags = computed(() => {
  const tags = []
  Object.entries(selectedFilters).forEach(([key, vals]) => {
    if (Array.isArray(vals)) vals.forEach(v => tags.push(`${v}`))
  })
  return tags
})

const activeFiltersCount = computed(() => activeTags.value.length)

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

function getColorName(hex) {
  const colorMap = [
    { value: 'Preto', hex: '#1a1410' }, { value: 'Branco', hex: '#faf8f5' },
    { value: 'Bege', hex: '#d4b896' },  { value: 'Caramelo', hex: '#8b6f47' },
    { value: 'Terracota', hex: '#c0714a' }, { value: 'Verde', hex: '#5a7a5a' },
    { value: 'Azul', hex: '#4a6080' },  { value: 'Rosa', hex: '#c9938a' },
    { value: 'Bordô', hex: '#7a2a35' }, { value: 'Cinza', hex: '#8a8278' },
  ]
  try {
    const rgb = hexToRgb(hex)
    let minD = Infinity
    let closest = 'Bege'
    for (const opt of colorMap) {
      const optRgb = hexToRgb(opt.hex)
      const d = Math.sqrt(
        Math.pow(rgb.r - optRgb.r, 2) +
        Math.pow(rgb.g - optRgb.g, 2) +
        Math.pow(rgb.b - optRgb.b, 2)
      )
      if (d < minD) {
        minD = d
        closest = opt.value
      }
    }
    return closest
  } catch (e) {
    return 'Bege'
  }
}

const filteredProducts = computed(() => {
  let list = [...products.value]

  if (showOnlyFavorites.value) {
    const favIds = currentUser.value?.favorites || []
    list = list.filter(p => favIds.includes(p.id))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.categoria && p.categoria.toLowerCase().includes(q)) ||
      (p.marca && p.marca.toLowerCase().includes(q))
    )
  }

  if (selectedFilters.categoria.length) {
    list = list.filter(p => selectedFilters.categoria.includes(p.categoria))
  }
  if (selectedFilters.marca.length) {
    list = list.filter(p => selectedFilters.marca.includes(p.marca))
  }

  if (selectedFilters.tamanho.length) {
    list = list.filter(p => p.sizes && p.sizes.some(sz => selectedFilters.tamanho.includes(sz)))
  }
  if (selectedFilters.cor.length) {
    list = list.filter(p => {
      const colors = p.colorOptions || (p.color ? [p.color] : [])
      return colors.some(c => selectedFilters.cor.includes(getColorName(c)))
    })
  }

  list = list.filter(p => {
    const price = parsePrice(p.price)
    return price >= priceRange.value[0] && price <= priceRange.value[1]
  })

  const sortMap = {
    newest: (a, b) => b.id - a.id,
    'price-asc': (a, b) => parsePrice(a.price) - parsePrice(b.price),
    'price-desc': (a, b) => parsePrice(b.price) - parsePrice(a.price),
    rating: (a, b) => b.rating - a.rating,
    relevance: () => 0,
  }
  list.sort(sortMap[sortBy.value])
  return list
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

function parsePrice(str) {
  return parseFloat(str.replace('R$ ', '').replace('.', '').replace(',', '.'))
}
function toggleGroup(label) {
  const i = openGroups.value.indexOf(label)
  i >= 0 ? openGroups.value.splice(i, 1) : openGroups.value.push(label)
}
function toggleFilter(key, value) {
  if (!selectedFilters[key]) selectedFilters[key] = []
  const i = selectedFilters[key].indexOf(value)
  i >= 0 ? selectedFilters[key].splice(i, 1) : selectedFilters[key].push(value)
  page.value = 1
}
function removeTag(tag) {
  Object.keys(selectedFilters).forEach(key => {
    if (Array.isArray(selectedFilters[key])) {
      const i = selectedFilters[key].indexOf(tag)
      if (i >= 0) selectedFilters[key].splice(i, 1)
    }
  })
}
function clearFilters() {
  Object.keys(selectedFilters).forEach(k => selectedFilters[k] = [])
  priceRange.value = [0, 2000]
  page.value = 1
}
function toggleWishlist(id) {
  if (!currentUser.value) {
    showLoginWarningModal.value = true
    return
  }

  const currentFavs = [...(currentUser.value.favorites || [])]
  const i = currentFavs.indexOf(id)
  if (i >= 0) {
    currentFavs.splice(i, 1)
    showToast('Removido dos favoritos')
  } else {
    currentFavs.push(id)
    showToast('Adicionado aos favoritos ♥')
  }

  updateUser(currentUser.value.id, { favorites: currentFavs })
}
function addToCart(product, size) {
  storeAddToCart(product, size)
  showToast(`${product.name} (Tamanho ${size}) adicionado à sacola`)
}
function quickAddToCart(product) {
  const size = product.sizes[0] || 'M'
  storeAddToCart(product, size)
  showToast(`${product.name} (Tamanho ${size}) adicionado à sacola`)
}
function showToast(msg) {
  toast.value = msg
  setTimeout(() => toast.value = null, 2800)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.pg-root {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  min-height: 100vh;
  color: #1a1410;
}

.hero {
  background: linear-gradient(135deg, #1a1410 0%, #3d2f1e 100%);
  padding: 48px 48px 36px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.hero-kicker {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d4b896;
  margin-bottom: 8px;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 56px;
  font-weight: 600;
  color: #faf8f5;
  letter-spacing: -0.01em;
  line-height: 1;
  margin-bottom: 8px;
}
.hero-sub {
  font-size: 12px;
  color: #a89880;
  letter-spacing: 0.08em;
}
.hero-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #a89880;
}
.hero-breadcrumb a { color: #d4b896; text-decoration: none; }
.hero-breadcrumb a:hover { color: #faf8f5; }
.hero-breadcrumb span { font-size: 8px; }

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  border-bottom: 1px solid #e8e0d5;
  background: #faf8f5;
  position: sticky;
  top: 0; 
  z-index: 100;
  gap: 16px;
}
.toolbar-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.toolbar-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e0d5c8;
  padding: 8px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3d2f1e;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
  position: relative;
}
.filter-toggle:hover, .filter-toggle.active {
  background: #1a1410;
  color: #faf8f5;
  border-color: #1a1410;
}
.filter-count {
  background: #8b6f47;
  color: #fff;
  font-size: 9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.active-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0ece6;
  border: 1px solid #e0d5c8;
  padding: 4px 10px;
  font-size: 11px;
  color: #3d2f1e;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.tag:hover { background: #e8ddd0; }
.tag-x { color: #a89880; font-size: 13px; line-height: 1; }

.sort-label { font-size: 11px; letter-spacing: 0.08em; color: #a89880; white-space: nowrap; }
.sort-select {
  background: #f0ece6;
  border: 1px solid #e0d5c8;
  padding: 8px 28px 8px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #1a1410;
  border-radius: 2px;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b6f47' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.grid-toggle { display: flex; border: 1px solid #e0d5c8; border-radius: 2px; overflow: hidden; }
.grid-toggle button {
  background: none;
  border: none;
  padding: 8px 10px;
  cursor: pointer;
  color: #a89880;
  transition: all 0.2s;
}
.grid-toggle button.on { background: #1a1410; color: #faf8f5; }

.main-layout {
  display: flex;
  align-items: flex-start;
  gap: 0;
  padding: 0 48px;
  max-width: 1600px;
  margin: 0 auto;
}

.grid-area { flex: 1; padding: 32px 0 32px 40px; min-width: 0; }
.product-grid {
  display: grid;
  gap: 32px 24px;
}
.product-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.product-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }

.empty-state {
  text-align: center;
  padding: 80px 20px;
}
.empty-icon {
  font-size: 40px;
  color: #d4b896;
  margin-bottom: 16px;
}
.empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  color: #1a1410;
  margin-bottom: 8px;
}
.empty-sub { font-size: 13px; color: #a89880; margin-bottom: 24px; }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e8e0d5;
}
.pg-btn {
  min-width: 40px;
  height: 40px;
  background: none;
  border: 1px solid #e0d5c8;
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #3d2f1e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0 12px;
}
.pg-btn:disabled { opacity: 0.35; cursor: default; }
.pg-btn:not(:disabled):hover { border-color: #8b6f47; color: #8b6f47; }
.pg-btn.active { background: #1a1410; color: #faf8f5; border-color: #1a1410; }
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1410;
  color: #faf8f5;
  padding: 12px 22px;
  border-radius: 2px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(26,20,16,0.25);
  z-index: 2000;
  white-space: nowrap;
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }

@media (max-width: 1024px) {
  .product-grid.cols-3 { grid-template-columns: repeat(2, 1fr); }
  .main-layout { padding: 0 24px; }
  .toolbar { padding: 14px 24px; }
  .hero { padding: 36px 24px 28px; }
  .hero-title { font-size: 40px; }
}
@media (max-width: 680px) {
  .sidebar { display: none; }
  .product-grid.cols-3, .product-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
  .main-layout { padding: 0 16px; }
  .grid-area { padding: 24px 0; }
  .toolbar { padding: 12px 16px; gap: 8px; }
  .sort-label { display: none; }
  .hero { padding: 28px 16px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
  .hero-title { font-size: 32px; }
}

.warning-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2500;
  background: rgba(26, 20, 16, 0.45);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.warning-modal-card {
  width: 100%;
  max-width: 380px;
  background: #faf8f5;
  border: 1px solid #e8e0d5;
  border-radius: 4px;
  box-shadow: 0 24px 64px rgba(26, 20, 16, 0.2);
  padding: 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warning-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fdf5f2;
  color: #c0714a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.warning-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #1a1410;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.warning-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #6b5543;
  line-height: 1.5;
  margin-bottom: 28px;
}

.warning-btn-action {
  width: 100%;
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}

.warning-btn-action:hover {
  background: transparent;
  color: #1a1410;
}

.favorites-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(192, 113, 74, 0.08);
  border: 1px solid rgba(192, 113, 74, 0.2);
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #3d2f1e;
  font-family: 'DM Sans', sans-serif;
  animation: slideDown 0.3s ease;
}

.fav-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fav-banner-icon {
  color: #c0714a;
  font-size: 16px;
}

.fav-banner-close {
  background: none;
  border: none;
  color: #c0714a;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  letter-spacing: 0.02em;
  padding: 4px 8px;
  border-radius: 2px;
  transition: all 0.2s;
}

.fav-banner-close:hover {
  background: rgba(192, 113, 74, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
