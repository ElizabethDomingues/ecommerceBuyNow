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

      <aside class="sidebar" :class="{ open: filtersOpen }">
        <div v-for="group in filterGroups" :key="group.label" class="filter-group">
          <button class="fg-header" @click="toggleGroup(group.label)">
            <span>{{ group.label }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 :style="{ transform: openGroups.includes(group.label) ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.3s' }">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <transition name="expand">
            <div v-if="openGroups.includes(group.label)" class="fg-body">
              <div v-if="group.type === 'color'" class="swatch-grid">
                <button
                  v-for="opt in group.options" :key="opt.value"
                  class="swatch"
                  :class="{ selected: selectedFilters[group.key]?.includes(opt.value) }"
                  :style="{ background: opt.hex }"
                  :title="opt.value"
                  @click="toggleFilter(group.key, opt.value)"
                ></button>
              </div>
              <div v-else-if="group.type === 'size'" class="size-grid">
                <button
                  v-for="opt in group.options" :key="opt"
                  class="size-chip"
                  :class="{ selected: selectedFilters[group.key]?.includes(opt) }"
                  @click="toggleFilter(group.key, opt)"
                >{{ opt }}</button>
              </div>
              <div v-else-if="group.type === 'range'" class="range-wrap">
                <div class="range-vals">
                  <span>R$ {{ priceRange[0] }}</span>
                  <span>R$ {{ priceRange[1] }}</span>
                </div>
                <input type="range" min="0" max="2000" step="50" v-model.number="priceRange[0]" class="range-input"/>
                <input type="range" min="0" max="2000" step="50" v-model.number="priceRange[1]" class="range-input"/>
              </div>
              <div v-else class="check-list">
                <label v-for="opt in group.options" :key="opt" class="check-item">
                  <input type="checkbox" :value="opt" v-model="selectedFilters[group.key]" class="check-input"/>
                  <span class="check-box"></span>
                  <span class="check-label">{{ opt }}</span>
                </label>
              </div>
            </div>
          </transition>
        </div>
        <button v-if="activeFiltersCount > 0" class="clear-all" @click="clearFilters">
          Limpar todos os filtros
        </button>
      </aside>

      <div class="grid-area">
        <div class="product-grid" :class="`cols-${gridCols}`">
          <article
            v-for="(product, i) in paginatedProducts"
            :key="product.id"
            class="product-card"
            :style="{ animationDelay: `${i * 60}ms` }"
            @mouseenter="hoveredId = product.id"
            @mouseleave="hoveredId = null"
          >
            <span v-if="product.badge" class="prod-badge" :class="product.badge.type">{{ product.badge.label }}</span>

            <div class="prod-img-wrap">
              <div class="prod-img" :style="{ background: product.color }">
                <div class="prod-img-inner" :style="{ background: product.color2 }"></div>
                <svg class="prod-silhouette" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="product.shape" :fill="product.shapeColor" opacity="0.55"/>
                </svg>
              </div>
              <div class="prod-actions" :class="{ visible: hoveredId === product.id }">
                <button class="prod-action-btn" @click="toggleWishlist(product.id)" :class="{ wishlisted: wishlist.includes(product.id) }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <button class="prod-action-btn" title="Ver rapidamente">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div class="quick-add" :class="{ visible: hoveredId === product.id }">
                <button
                  v-for="sz in product.sizes.slice(0,4)"
                  :key="sz"
                  class="qa-size"
                  @click.stop="addToCart(product, sz)"
                >{{ sz }}</button>
                <span v-if="product.sizes.length > 4" class="qa-more">+{{ product.sizes.length - 4 }}</span>
              </div>
            </div>
            <div class="prod-info">
              <div class="prod-top">
                <p class="prod-brand">{{ product.brand }}</p>
                <div class="prod-rating">
                  <span class="stars">{{ '★'.repeat(Math.floor(product.rating)) }}{{ product.rating % 1 ? '½' : '' }}</span>
                  <span class="rating-count">({{ product.reviews }})</span>
                </div>
              </div>
              <h3 class="prod-name">{{ product.name }}</h3>
              <div class="prod-colors">
                <span
                  v-for="c in product.colorOptions"
                  :key="c"
                  class="color-dot"
                  :style="{ background: c }"
                ></span>
                <span v-if="product.colorOptions.length > 4" class="color-more">+{{ product.colorOptions.length - 4 }}</span>
              </div>
              <div class="prod-price-row">
                <div class="prod-prices">
                  <span v-if="product.originalPrice" class="price-original">{{ product.originalPrice }}</span>
                  <span class="price-current" :class="{ sale: product.originalPrice }">{{ product.price }}</span>
                </div>
                <span v-if="product.installments" class="price-installments">{{ product.installments }}</span>
              </div>
              
              <button class="add-to-bag-btn" @click.stop="quickAddToCart(product)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Adicionar à Sacola
              </button>
            </div>
          </article>
        </div>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p class="empty-icon">◈</p>
          <p class="empty-title">Nenhum produto encontrado</p>
          <p class="empty-sub">Tente ajustar os filtros</p>
          <button class="clear-all" @click="clearFilters">Limpar filtros</button>
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
    <footer class="store-footer">
      <div class="footer-brand">
        <span class="logo-icon">◈</span> AURÊ
      </div>
      <p class="footer-copy">© 2026 AURÊ. Todos os direitos reservados. Design minimalista de luxo.</p>
      <div class="footer-links">
        <a href="#/">Coleção</a>
        <a href="#/">Sobre nós</a>
        <a href="#/">Termos de Uso</a>
        <a href="#/admin" class="admin-portal-link">Painel do Administrador →</a>
      </div>
    </footer>

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
import { products, SHAPES, addToCart as storeAddToCart, searchQuery, currentUser, updateUser } from './store'

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

.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: 32px 32px 32px 0;
  border-right: 1px solid #e8e0d5;
  position: sticky;
  top: 57px;
  max-height: calc(100vh - 57px);
  overflow-y: auto;
  transition: width 0.35s, opacity 0.35s;
}
.sidebar:not(.open) {
  width: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0;
}

.filter-group { border-bottom: 1px solid #e8e0d5; padding: 16px 0; }
.fg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1a1410;
  cursor: pointer;
  padding: 4px 0;
}
.fg-body { padding-top: 14px; }

.swatch-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.swatch:hover { transform: scale(1.15); }
.swatch.selected { outline-color: #8b6f47; }

.size-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.size-chip {
  min-width: 36px;
  padding: 5px 8px;
  background: #f0ece6;
  border: 1px solid #e0d5c8;
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #3d2f1e;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.size-chip:hover { border-color: #8b6f47; color: #8b6f47; }
.size-chip.selected { background: #1a1410; color: #faf8f5; border-color: #1a1410; }

.range-wrap { display: flex; flex-direction: column; gap: 8px; }
.range-vals { display: flex; justify-content: space-between; font-size: 12px; color: #6b5543; }
.range-input {
  width: 100%;
  accent-color: #8b6f47;
  height: 2px;
}

.check-list { display: flex; flex-direction: column; gap: 10px; }
.check-item { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.check-input { display: none; }
.check-box {
  width: 16px;
  height: 16px;
  border: 1px solid #c0b0a0;
  border-radius: 2px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
}
.check-input:checked + .check-box {
  background: #1a1410;
  border-color: #1a1410;
}
.check-input:checked + .check-box::after {
  content: '';
  position: absolute;
  inset: 3px 2px 2px 4px;
  border-left: 1.5px solid #faf8f5;
  border-bottom: 1.5px solid #faf8f5;
  transform: rotate(-45deg);
}
.check-label { font-size: 13px; color: #3d2f1e; }
.check-item:hover .check-label { color: #8b6f47; }

.clear-all {
  margin-top: 20px;
  background: none;
  border: 1px solid #e0d5c8;
  width: 100%;
  padding: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a89880;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}
.clear-all:hover { border-color: #8b6f47; color: #8b6f47; }

.grid-area { flex: 1; padding: 32px 0 32px 40px; min-width: 0; }
.product-grid {
  display: grid;
  gap: 32px 24px;
}
.product-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.product-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }

.product-card {
  position: relative;
  cursor: pointer;
  animation: fadeUp 0.45s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.prod-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 1px;
}
.prod-badge.new       { background: #1a1410; color: #d4b896; }
.prod-badge.sale      { background: #c0714a; color: #fff; }
.prod-badge.exclusive { background: #8b6f47; color: #faf8f5; }
.prod-badge.best      { background: #5a7a5a; color: #fff; }

.prod-img-wrap {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: 2px;
  background: #e8e0d5;
}
.prod-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
  position: relative;
}
.product-card:hover .prod-img { transform: scale(1.04); }
.prod-img-inner {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s;
}
.product-card:hover .prod-img-inner { opacity: 0.3; }
.prod-silhouette {
  width: 55%;
  height: 80%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
}

.prod-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.25s;
}
.prod-actions.visible { opacity: 1; transform: translateX(0); }
.prod-action-btn {
  width: 36px;
  height: 36px;
  background: #faf8f5;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3d2f1e;
  box-shadow: 0 2px 12px rgba(26,20,16,0.12);
  transition: all 0.2s;
}
.prod-action-btn:hover { background: #1a1410; color: #faf8f5; }
.prod-action-btn.wishlisted { background: #c0714a; color: #fff; }

.quick-add {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26,20,16,0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
}
.quick-add.visible { transform: translateY(0); }
.qa-size {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: #faf8f5;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 500;
  padding: 5px 8px;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 0.08em;
  transition: all 0.15s;
}
.qa-size:hover { background: #8b6f47; border-color: #8b6f47; }
.qa-more { font-size: 10px; color: #a89880; }

/* ── PRODUCT INFO ── */
.prod-info { padding: 16px 0 4px; }
.prod-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.prod-brand {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #8b6f47;
}
.prod-rating { display: flex; align-items: center; gap: 4px; }
.stars { font-size: 10px; color: #c0914a; letter-spacing: -1px; }
.rating-count { font-size: 10px; color: #a89880; }
.prod-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-weight: 500;
  color: #1a1410;
  line-height: 1.3;
  margin-bottom: 8px;
}
.prod-colors { display: flex; align-items: center; gap: 5px; margin-bottom: 10px; }
.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.6);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.12);
}
.color-more { font-size: 10px; color: #a89880; }
.prod-price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.prod-prices { display: flex; align-items: baseline; gap: 7px; }
.price-original {
  font-size: 12px;
  color: #a89880;
  text-decoration: line-through;
}
.price-current {
  font-size: 16px;
  font-weight: 500;
  color: #1a1410;
}
.price-current.sale { color: #c0714a; }
.price-installments { font-size: 11px; color: #8b6f47; }

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

.expand-enter-active, .expand-leave-active { transition: all 0.28s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 300px; }

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

/* PREMIUM STORE FOOTER */
.store-footer {
  border-top: 1px solid #e8e0d5;
  padding: 64px 48px;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 80px;
  width: 100%;
}
.footer-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  letter-spacing: 0.2em;
  color: #1a1410;
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-copy {
  font-size: 12px;
  color: #a89880;
  text-align: center;
}
.footer-links {
  display: flex;
  gap: 24px;
  font-size: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.footer-links a {
  text-decoration: none;
  color: #6b5543;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #1a1410;
}
.admin-portal-link {
  color: #8b6f47 !important;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.add-to-bag-btn {
  width: 100%;
  margin-top: 14px;
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.95;
}

.add-to-bag-btn:hover {
  background: transparent;
  color: #1a1410;
  opacity: 1;
}

.add-to-bag-btn svg {
  transition: transform 0.3s;
}

.add-to-bag-btn:hover svg {
  transform: translateY(-2px);
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
</style>
