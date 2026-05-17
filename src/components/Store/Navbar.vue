<template>
  <header class="navbar-root">
    <div class="top-bar">
      <span>✦ Frete grátis acima de R$ 299 ✦ Até 10x sem juros ✦ Devoluções gratuitas</span>
    </div>

    <nav class="main-nav">
      <div class="logo-wrap">
        <a href="#" class="logo">
          <span class="logo-icon">◈</span>
          <span class="logo-text">AURÊ</span>
        </a>
      </div>

      <div class="search-wrap" :class="{ active: searchOpen }">
        <div class="search-inner">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="search-input"
            @keyup.enter="handleSearch"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button class="search-btn" @click="handleSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="actions-wrap">
        <button class="action-btn md-hidden" @click="toggleSearch" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <button v-if="currentUser" class="action-btn" @click="profileOpen = !profileOpen" aria-label="Perfil">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="action-label">Perfil</span>
        </button>

        <!-- If not logged in: show standard Conta button -->
        <button v-else class="action-btn" @click="accountOpen = !accountOpen" aria-label="Conta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="action-label">Conta</span>
        </button>

        <button 
          class="action-btn" 
          :class="{ active: showOnlyFavorites }" 
          @click="handleFavoritesClick" 
          aria-label="Favoritos"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            :fill="showOnlyFavorites ? '#c0714a' : 'none'" 
            :stroke="showOnlyFavorites ? '#c0714a' : 'currentColor'" 
            stroke-width="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="action-label">Favoritos</span>
          <span v-if="currentUser && currentUser.favorites?.length" class="fav-badge">
            {{ currentUser.favorites.length }}
          </span>
        </button>

        <button class="action-btn cart-btn" @click="cartOpen = !cartOpen" aria-label="Carrinho">
          <span class="cart-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </span>
          <span class="action-label">Sacola</span>
        </button>

        <button class="hamburger" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div class="category-nav">
      <ul class="category-list">
        <li v-for="cat in categories" :key="cat.label" class="category-item"
            @mouseenter="cat.sub ? (activeDropdown = cat.label) : null"
            @mouseleave="activeDropdown = null">
          <a href="#" class="category-link" :class="{ active: cat.label === activeCategory }">
            {{ cat.label }}
            <svg v-if="cat.sub" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </a>

          <div v-if="cat.sub && activeDropdown === cat.label" class="mega-dropdown">
            <div class="mega-inner">
              <div v-for="group in cat.sub" :key="group.title" class="mega-group">
                <p class="mega-title">{{ group.title }}</p>
                <ul>
                  <li v-for="item in group.items" :key="item">
                    <a href="#" class="mega-link">{{ item }}</a>
                  </li>
                </ul>
              </div>
              <div class="mega-promo">
                <div class="promo-card">
                  <p class="promo-tag">Novidade</p>
                  <p class="promo-headline">Coleção<br/>Verão 2026</p>
                  <a href="#" class="promo-cta">Ver tudo →</a>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-search">
          <input v-model="searchQuery" type="text" placeholder="Buscar..." class="mobile-search-input"/>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <ul class="mobile-list">
          <li v-for="cat in categories" :key="cat.label">
            <button class="mobile-link" @click="toggleMobileCat(cat.label)">
              <span>{{ cat.label }}</span>
              <svg v-if="cat.sub" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   :style="{ transform: mobileCat === cat.label ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <transition name="fade">
              <ul v-if="cat.sub && mobileCat === cat.label" class="mobile-sub">
                <li v-for="group in cat.sub" :key="group.title">
                  <p class="mobile-sub-title">{{ group.title }}</p>
                  <a v-for="item in group.items" :key="item" href="#" class="mobile-sub-link">{{ item }}</a>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
        <div class="mobile-footer">
          <a href="#" class="mobile-foot-link" @click.prevent="accountOpen = true; mobileOpen = false">Minha Conta</a>
          <a href="#" class="mobile-foot-link">Favoritos</a>
          <a href="#" class="mobile-foot-link">Pedidos</a>
          <a href="#" class="mobile-foot-link">Ajuda</a>
        </div>
      </div>
    </transition>

    <div v-if="mobileOpen || cartOpen" class="backdrop" @click="closeAll"></div>

    <transition name="drawer">
      <div v-if="cartOpen" class="cart-drawer">
        <div class="cart-header">
          <h2 class="cart-title">Sacola <span class="cart-count">({{ cartCount }})</span></h2>
          <button @click="cartOpen = false" class="cart-close">✕</button>
        </div>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="cart-item-img" :style="{ background: item.color }"></div>
            <div class="cart-item-info">
              <p class="cart-item-name">{{ item.name }}</p>
              <p class="cart-item-size">{{ item.size }}</p>
              <p class="cart-item-price">{{ item.price }}</p>
            </div>
            <button class="cart-item-remove" @click="removeItem(item.id)">✕</button>
          </div>
        </div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <span>{{ cartTotal }}</span>
          </div>
          <button class="cart-checkout" @click="handleCheckout">Finalizar Compra</button>
          <button class="cart-continue" @click="cartOpen = false">Continuar comprando</button>
        </div>
      </div>
    </transition>

    <AuthModal :show="accountOpen" @close="accountOpen = false" />
    <ProfileModal :show="profileOpen" @close="profileOpen = false" />

    <transition name="modal-fade">
      <div v-if="checkoutSuccess" class="checkout-modal-overlay" @click.self="checkoutSuccess = false">
        <div class="checkout-modal-card" role="dialog" aria-modal="true">
          <div class="checkout-success-icon">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h2 class="checkout-title">Compra Realizada!</h2>
          <p class="checkout-subtitle">Sua compra foi concluída com sucesso. Um e-mail de confirmação foi enviado com os detalhes do seu pedido.</p>
          <button class="checkout-btn-action" @click="checkoutSuccess = false">
            Continuar Comprando
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import AuthModal from '../Shared/AuthModal.vue'
import ProfileModal from '../Shared/ProfileModal.vue'
import { currentUser, cartItems, removeFromCart, clearCart, searchQuery, showOnlyFavorites, decreaseProductsStock } from '../../store'

function handleFavoritesClick() {
  if (!currentUser.value) {
    accountOpen.value = true
  } else {
    showOnlyFavorites.value = !showOnlyFavorites.value
  }
}
const searchOpen = ref(false)
const searchFocused = ref(false)
const mobileOpen = ref(false)
const cartOpen = ref(false)
const accountOpen = ref(false)
const profileOpen = ref(false)
const checkoutSuccess = ref(false)
const activeDropdown = ref(null)
const activeCategory = ref('Feminino')
const mobileCat = ref(null)
const searchInput = ref(null)

const categories = [
  {
    label: 'Feminino',
    sub: [
      { title: 'Roupas', items: ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Macacões'] },
      { title: 'Calçados', items: ['Tênis', 'Sandálias', 'Botas', 'Scarpin'] },
      { title: 'Acessórios', items: ['Bolsas', 'Cintos', 'Chapéus', 'Joias'] },
    ]
  },
]

const cartCount = computed(() => cartItems.value.length)
const cartTotal = computed(() => {
  const sum = cartItems.value.reduce((acc, item) => {
    const cleanPrice = item.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
    return acc + parseFloat(cleanPrice)
  }, 0)
  return `R$ ${sum.toFixed(2).replace('.', ',')}`
})

function handleSearch() {
  console.log('Buscando:', searchQuery.value)
}
function toggleSearch() {
  searchOpen.value = !searchOpen.value
}
function toggleMobileCat(label) {
  mobileCat.value = mobileCat.value === label ? null : label
}
function removeItem(id) {
  removeFromCart(id)
}
async function handleCheckout() {
  if (cartItems.value.length === 0) return
  const ids = cartItems.value.map(i => i.productId)
  await decreaseProductsStock(ids)
  clearCart()
  cartOpen.value = false
  checkoutSuccess.value = true
}
function closeAll() {
  mobileOpen.value = false
  cartOpen.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.navbar-root {
  font-family: 'DM Sans', sans-serif;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #faf8f5;
  border-bottom: 1px solid #e8e0d5;
}

/* TOP BAR */
.top-bar {
  background: #1a1410;
  color: #d4b896;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.12em;
  padding: 8px 16px;
  font-weight: 400;
}

/* MAIN NAV */
.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 72px;
  gap: 24px;
}

/* LOGO */
.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.logo-icon {
  font-size: 22px;
  color: #8b6f47;
  line-height: 1;
}
.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  color: #1a1410;
  letter-spacing: 0.2em;
}

/* SEARCH */
.search-wrap {
  flex: 1;
  max-width: 420px;
}
.search-inner {
  display: flex;
  align-items: center;
  background: #f0ece6;
  border: 1px solid #e0d5c8;
  border-radius: 2px;
  transition: all 0.25s;
}
.search-inner:focus-within {
  border-color: #8b6f47;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
}
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #1a1410;
}
.search-input::placeholder { color: #a89880; }
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 14px;
  color: #8b6f47;
  display: flex;
  align-items: center;
}

/* ACTIONS */
.actions-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 10px;
  color: #3d2f1e;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
}

.action-btn.active {
  color: #c0714a !important;
}

.fav-badge {
  position: absolute;
  top: 1px;
  right: 1px;
  background: #c0714a;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
}
.action-btn:hover { background: #f0ece6; color: #8b6f47; }
.action-label {
  font-size: 9px;
  letter-spacing: 0.08em;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1;
}
.cart-icon-wrap { position: relative; }
.cart-badge {
  position: absolute;
  top: -7px;
  right: -8px;
  background: #8b6f47;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
}
.cart-btn { position: relative; }
.md-hidden { display: none; }

/* HAMBURGER */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: #1a1410;
  transition: all 0.3s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* CATEGORY NAV */
.category-nav {
  border-top: 1px solid #e8e0d5;
  padding: 0 40px;
  background: #faf8f5;
}
.category-list {
  display: flex;
  list-style: none;
  gap: 0;
}
.category-item { position: relative; }
.category-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #3d2f1e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 18px;
  position: relative;
  transition: color 0.2s;
}
.category-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 18px;
  right: 18px;
  height: 2px;
  background: #8b6f47;
  transform: scaleX(0);
  transition: transform 0.25s;
}
.category-link:hover, .category-link.active { color: #8b6f47; }
.category-link:hover::after, .category-link.active::after { transform: scaleX(1); }

/* MEGA DROPDOWN */
.mega-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #faf8f5;
  border: 1px solid #e8e0d5;
  border-top: 2px solid #8b6f47;
  box-shadow: 0 20px 60px rgba(26,20,16,0.12);
  min-width: 560px;
  z-index: 500;
  animation: dropIn 0.2s ease;
}
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mega-inner {
  display: flex;
  gap: 0;
  padding: 32px;
}
.mega-group {
  flex: 1;
  padding-right: 24px;
}
.mega-group + .mega-group { border-left: 1px solid #e8e0d5; padding-left: 24px; }
.mega-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1410;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}
.mega-link {
  display: block;
  text-decoration: none;
  color: #6b5543;
  font-size: 13px;
  padding: 4px 0;
  transition: color 0.2s, transform 0.2s;
}
.mega-link:hover { color: #8b6f47; transform: translateX(4px); }
.mega-promo {
  padding-left: 24px;
  border-left: 1px solid #e8e0d5;
  display: flex;
  align-items: center;
}
.promo-card {
  background: linear-gradient(135deg, #1a1410 0%, #3d2f1e 100%);
  color: #faf8f5;
  padding: 28px 24px;
  border-radius: 2px;
  width: 160px;
}
.promo-tag {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d4b896;
  margin-bottom: 10px;
}
.promo-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #faf8f5;
}
.promo-cta {
  color: #d4b896;
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.1em;
  border-bottom: 1px solid #d4b896;
  padding-bottom: 2px;
  transition: color 0.2s;
}
.promo-cta:hover { color: #fff; border-color: #fff; }

/* MOBILE MENU */
.mobile-menu {
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 360px;
  height: 100dvh;
  background: #faf8f5;
  z-index: 900;
  overflow-y: auto;
  padding: 100px 0 40px;
  box-shadow: 8px 0 40px rgba(26,20,16,0.15);
}
.mobile-search {
  display: flex;
  align-items: center;
  margin: 0 24px 24px;
  background: #f0ece6;
  border: 1px solid #e0d5c8;
  border-radius: 2px;
  padding: 10px 14px;
  gap: 10px;
  color: #a89880;
}
.mobile-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #1a1410;
}
.mobile-search-input::placeholder { color: #a89880; }
.mobile-list {
  list-style: none;
  padding: 0 24px;
}
.mobile-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #e8e0d5;
  padding: 16px 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1a1410;
  cursor: pointer;
  text-align: left;
}
.mobile-sub {
  list-style: none;
  background: #f5f0ea;
  margin: 0 -24px;
  padding: 16px 24px;
}
.mobile-sub-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1410;
  margin: 12px 0 6px;
}
.mobile-sub-link {
  display: block;
  text-decoration: none;
  color: #6b5543;
  font-size: 13px;
  padding: 4px 0;
}
.mobile-sub-link:hover { color: #8b6f47; }
.mobile-footer {
  padding: 32px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid #e8e0d5;
  margin-top: 24px;
}
.mobile-foot-link {
  text-decoration: none;
  color: #6b5543;
  font-size: 13px;
  padding: 12px 0;
  border-bottom: 1px solid #f0ece6;
}

/* CART DRAWER */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100dvh;
  background: #faf8f5;
  z-index: 900;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(26,20,16,0.15);
}
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 28px 20px;
  border-bottom: 1px solid #e8e0d5;
}
.cart-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: #1a1410;
}
.cart-count { color: #8b6f47; }
.cart-close {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #6b5543;
  padding: 4px 8px;
  transition: color 0.2s;
}
.cart-close:hover { color: #1a1410; }
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cart-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e0d5;
}
.cart-item-img {
  width: 64px;
  height: 80px;
  border-radius: 2px;
  flex-shrink: 0;
}
.cart-item-info { flex: 1; }
.cart-item-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1410;
  margin-bottom: 4px;
}
.cart-item-size {
  font-size: 11px;
  color: #a89880;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.cart-item-price {
  font-size: 14px;
  font-weight: 500;
  color: #3d2f1e;
}
.cart-item-remove {
  background: none;
  border: none;
  font-size: 11px;
  cursor: pointer;
  color: #c0a888;
  padding: 2px 4px;
  transition: color 0.2s;
}
.cart-item-remove:hover { color: #1a1410; }
.cart-footer {
  padding: 20px 28px 32px;
  border-top: 1px solid #e8e0d5;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  color: #1a1410;
  margin-bottom: 16px;
}
.cart-checkout {
  width: 100%;
  background: #1a1410;
  color: #faf8f5;
  border: none;
  padding: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.cart-checkout:hover { background: #3d2f1e; }
.cart-continue {
  width: 100%;
  background: none;
  border: 1px solid #e0d5c8;
  padding: 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #6b5543;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}
.cart-continue:hover { border-color: #8b6f47; color: #8b6f47; }

/* BACKDROP */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.4);
  z-index: 800;
  backdrop-filter: blur(2px);
}

/* TRANSITIONS */
.slide-enter-active, .slide-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
.drawer-enter-active, .drawer-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: all 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; max-height: 0; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .main-nav { padding: 0 20px; height: 64px; }
  .search-wrap { display: none; }
  .md-hidden { display: flex; }
  .action-label { display: none; }
  .hamburger { display: flex; }
  .category-nav { display: none; }
  .logo-text { font-size: 24px; }
}

.checkout-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(26, 20, 16, 0.45);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.checkout-modal-card {
  width: 100%;
  max-width: 440px;
  background: #faf8f5;
  border: 1px solid #e8e0d5;
  border-radius: 4px;
  box-shadow: 0 24px 64px rgba(26, 20, 16, 0.22);
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.checkout-success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0ece6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.checkout-success-icon .checkmark {
  width: 44px;
  height: 44px;
  stroke: #8b6f47;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.checkout-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  color: #1a1410;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.checkout-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #6b5543;
  line-height: 1.6;
  margin-bottom: 32px;
}

.checkout-btn-action {
  width: 100%;
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 15px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}

.checkout-btn-action:hover {
  background: transparent;
  color: #1a1410;
}
</style>