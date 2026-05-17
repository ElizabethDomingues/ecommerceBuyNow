<template>
  <aside class="sidebar" :class="{ open: filtersOpen }">
    <div v-for="group in filterGroups" :key="group.label" class="filter-group">
      <button class="fg-header" @click="$emit('toggleGroup', group.label)">
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
              @click="$emit('toggleFilter', group.key, opt.value)"
            ></button>
          </div>
          <div v-else-if="group.type === 'size'" class="size-grid">
            <button
              v-for="opt in group.options" :key="opt"
              class="size-chip"
              :class="{ selected: selectedFilters[group.key]?.includes(opt) }"
              @click="$emit('toggleFilter', group.key, opt)"
            >{{ opt }}</button>
          </div>
          <div v-else-if="group.type === 'range'" class="range-wrap">
            <div class="range-vals">
              <span>R$ {{ priceRange[0] }}</span>
              <span>R$ {{ priceRange[1] }}</span>
            </div>
            <input type="range" min="0" max="2000" step="50" :value="priceRange[0]" @input="updateRange(0, $event.target.value)" class="range-input"/>
            <input type="range" min="0" max="2000" step="50" :value="priceRange[1]" @input="updateRange(1, $event.target.value)" class="range-input"/>
          </div>
          <div v-else class="check-list">
            <label v-for="opt in group.options" :key="opt" class="check-item">
              <input type="checkbox" :value="opt" :checked="selectedFilters[group.key]?.includes(opt)" @change="$emit('toggleFilter', group.key, opt)" class="check-input"/>
              <span class="check-box"></span>
              <span class="check-label">{{ opt }}</span>
            </label>
          </div>
        </div>
      </transition>
    </div>
    <button v-if="activeFiltersCount > 0" class="clear-all" @click="$emit('clearFilters')">
      Limpar todos os filtros
    </button>
  </aside>
</template>

<script setup>
const props = defineProps({
  filtersOpen: Boolean,
  filterGroups: Array,
  openGroups: Array,
  selectedFilters: Object,
  priceRange: Array,
  activeFiltersCount: Number
})

const emit = defineEmits(['toggleGroup', 'toggleFilter', 'clearFilters', 'update:priceRange'])

function updateRange(index, value) {
  const newRange = [...props.priceRange]
  newRange[index] = Number(value)
  emit('update:priceRange', newRange)
}
</script>

<style scoped>
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

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  height: 0;
  opacity: 0;
  padding-top: 0;
}
</style>
