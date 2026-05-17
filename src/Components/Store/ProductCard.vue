<template>
  <article
    class="product-card"
    :style="{ animationDelay: delay }"
    @mouseenter="hoveredId = product.id"
    @mouseleave="hoveredId = null"
  >
    <span v-if="product.badge" class="prod-badge" :class="product.badge.type">{{ product.badge.label }}</span>

    <div class="prod-img-wrap">
      <div class="prod-img" :style="{ background: product.color }">
        <div class="prod-img-inner" :style="{ background: product.color2 }"></div>
        <img v-if="product.image" :src="product.image" class="prod-cover-img" />
        <svg v-else class="prod-silhouette" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="product.shape" :fill="product.shapeColor" opacity="0.55"/>
        </svg>
      </div>
      <div class="prod-actions" :class="{ visible: hoveredId === product.id }">
        <button class="prod-action-btn" @click.stop="$emit('toggleWishlist', product.id)" :class="{ wishlisted: wishlist.includes(product.id) }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="prod-action-btn" title="Ver rapidamente" @click.stop>
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
          @click.stop="$emit('addToCart', product, sz)"
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
      
      <button class="add-to-bag-btn" @click.stop="$emit('quickAddToCart', product)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        Adicionar à Sacola
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: Object,
  delay: String,
  wishlist: Array
})

const emit = defineEmits(['toggleWishlist', 'addToCart', 'quickAddToCart'])

const hoveredId = ref(null)
</script>

<style scoped>
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
.prod-cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
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
  text-transform: uppercase;
  letter-spacing: 0.15em;
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
</style>
