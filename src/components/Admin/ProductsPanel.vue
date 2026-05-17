<template>
  <div class="panel-products anim-fade-in">
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
            <th>Estoque</th>
            <th>Preço</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in filteredProducts" :key="prod.id">
            <td>
              <div class="table-prod-preview" :style="{ background: prod.color }">
                <img v-if="prod.image" :src="prod.image" class="table-prod-cover-img" />
                <svg v-else width="24" height="36" viewBox="0 0 120 180" fill="none">
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
            <td>
              <span class="table-stock-indicator" :class="{ 'low': prod.stock <= 5, 'out': prod.stock === 0 }">
                {{ prod.stock !== undefined ? prod.stock : 10 }} un
              </span>
            </td>
            <td><span class="table-price">{{ prod.price }}</span></td>
            <td class="text-right actions-cell">
              <!-- Inline delete confirmation popover -->
              <transition name="row-confirm-fade">
                <div v-if="productToDelete?.id === prod.id" class="row-delete-confirm">
                  <span class="row-confirm-label">Excluir produto?</span>
                  <button class="row-confirm-yes" @click="handleDeleteProduct">Sim</button>
                  <button class="row-confirm-no" @click="closeDeleteModal">Não</button>
                </div>
              </transition>
              <div v-if="!productToDelete || productToDelete.id !== prod.id" class="row-normal-actions">
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
              </div>
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

    <!-- PRODUCT DRAWER (Create/Edit) -->
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
                  <img v-if="productForm.image" :src="productForm.image" class="preview-stage-img" />
                  <svg v-else class="preview-svg" viewBox="0 0 120 180" fill="none">
                    <path :d="SHAPES[productForm.shape]" :fill="productForm.shapeColor" opacity="0.8"/>
                  </svg>
                </div>
                <div class="preview-labels">
                  <p class="preview-brand-lbl">{{ productForm.brand || 'Marca' }}</p>
                  <p class="preview-name-lbl">{{ productForm.name || 'Nome do Produto' }}</p>
                  <p class="preview-price-lbl">R$ {{ productForm.price || '0,00' }}</p>
                </div>
              </div>

              <!-- Quick Delete Button for Edit Mode -->
              <div v-if="editingProduct" class="drawer-delete-action-wrap">
                <button type="button" class="drawer-delete-btn" @click="confirmDeleteProduct(editingProduct)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Excluir Este Produto
                </button>
              </div>

              <!-- Form inputs -->
              <div v-if="editingProduct" class="admin-form-group">
                <label>ID do Produto</label>
                <input type="text" :value="editingProduct.id" readonly class="readonly-input" />
              </div>

              <div class="admin-form-group">
                <label>Nome do Produto</label>
                <input type="text" v-model="productForm.name" required placeholder="Ex: Vestido Midi Floral Lux" />
              </div>

              <div class="admin-form-group">
                <label>Foto de Capa (Opcional - Upload do Dispositivo)</label>
                <div class="file-upload-wrapper">
                  <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" class="file-upload-input" id="prodImageUpload" />
                  <label for="prodImageUpload" class="file-upload-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>{{ productForm.image ? 'Alterar Imagem da Capa' : 'Escolher Foto do Dispositivo' }}</span>
                  </label>
                  <button v-if="productForm.image" type="button" class="remove-image-btn" @click="removeProductImage">
                    Remover Imagem
                  </button>
                </div>
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

              <!-- Novo campo de quantidade em estoque e ativo -->
              <div class="form-row-2">
                <div class="admin-form-group">
                  <label>Quantidade em Estoque</label>
                  <input type="number" v-model.number="productForm.stock" required min="0" />
                </div>
                <div class="admin-form-group">
                  <label>Produto Ativo (sim/não)</label>
                  <div class="active-toggle-wrap">
                    <label class="switch-lbl">
                      <input type="checkbox" v-model="productForm.active" />
                      <span class="slider-switch"></span>
                    </label>
                    <span class="active-status-text">{{ productForm.active ? 'Sim, visível na loja' : 'Não, oculto na loja' }}</span>
                  </div>
                </div>
              </div>

              <!-- Novo campo de descrição -->
              <div class="admin-form-group">
                <label>Descrição do Produto</label>
                <textarea v-model="productForm.description" rows="3" placeholder="Insira uma descrição detalhada do produto de luxo..." class="admin-textarea"></textarea>
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

    <!-- Delete confirmation is now inline per row (see actions-cell above) -->
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { products, SHAPES, addProduct, updateProduct, deleteProduct } from '../../store'

const emit = defineEmits(['show-toast', 'add-log'])

const productSearch = ref('')
const showProductDrawer = ref(false)
const editingProduct = ref(null)
const formLoading = ref(false)

// Custom Delete Modal State
const showDeleteModal = ref(false)
const productToDelete = ref(null)

const sizeOptions = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40', '42', '44']

const filteredProducts = computed(() => {
  if (!productSearch.value.trim()) return products.value
  const query = productSearch.value.toLowerCase()
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.brand.toLowerCase().includes(query) ||
    p.categoria.toLowerCase().includes(query)
  )
})

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
  sizes: [],
  image: null,
  description: '',
  stock: 10,
  active: true
})

const fileInput = ref(null)

function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      productForm.image = event.target?.result
    }
    reader.readAsDataURL(file)
  }
}

function removeProductImage() {
  productForm.image = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

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
    productForm.image = prod.image || null
    productForm.description = prod.description || ''
    productForm.stock = prod.stock !== undefined ? parseInt(prod.stock) : 10
    productForm.active = prod.active !== false && prod.active !== 0
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
    productForm.image = null
    productForm.description = ''
    productForm.stock = 15
    productForm.active = true
  }
  showProductDrawer.value = true
}

function closeProductDrawer() {
  showProductDrawer.value = false
  editingProduct.value = null
}

async function saveProduct() {
  formLoading.value = true
  
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
    reviews: editingProduct.value ? editingProduct.value.reviews : 1,
    marca: productForm.brand,
    image: productForm.image,
    description: productForm.description,
    stock: parseInt(productForm.stock) || 0,
    active: productForm.active
  }

  if (editingProduct.value) {
    const result = await updateProduct(editingProduct.value.id, productPayload)
    if (result) {
      emit('show-toast', 'Produto atualizado com sucesso!')
      emit('add-log', {
        text: `Elizabeth D. atualizou o produto: ${productPayload.name}`,
        time: 'Agora',
        type: 'info'
      })
    } else {
      emit('show-toast', 'Erro ao atualizar o produto no servidor.')
    }
  } else {
    const result = await addProduct(productPayload)
    if (result) {
      emit('show-toast', 'Produto adicionado ao catálogo!')
      emit('add-log', {
        text: `Elizabeth D. cadastrou novo produto: ${productPayload.name}`,
        time: 'Agora',
        type: 'success'
      })
    } else {
      emit('show-toast', 'Erro ao adicionar o produto no servidor.')
    }
  }

  formLoading.value = false
  closeProductDrawer()
}

// CUSTOM DELETION MODAL LOGIC
function confirmDeleteProduct(prod) {
  productToDelete.value = prod
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  productToDelete.value = null
}

async function handleDeleteProduct() {
  if (!productToDelete.value) return
  const prod = productToDelete.value
  const success = await deleteProduct(prod.id)
  if (success) {
    emit('show-toast', 'Produto removido do catálogo.')
    emit('add-log', {
      text: `Elizabeth D. excluiu o produto: ${prod.name}`,
      time: 'Agora',
      type: 'info'
    })
  } else {
    emit('show-toast', 'Erro ao remover produto do catálogo.')
  }
  closeDeleteModal()
}
</script>

<style scoped>
.panel-products {
  display: flex;
  flex-direction: column;
  height: 100%;
}

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
  padding: 12px 16px 12px 42px;
  color: #faf8f5;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.25s;
}

.admin-search-input:focus {
  border-color: #8b6f47;
}

.admin-primary-btn {
  background: #8b6f47;
  color: #faf8f5;
  border: 1px solid #8b6f47;
  padding: 12px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.25s;
}

.admin-primary-btn:hover {
  background: #9d8259;
  border-color: #9d8259;
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.2);
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

.table-stock-indicator {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(139, 111, 71, 0.1);
  border: 1px solid rgba(139, 111, 71, 0.2);
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #a89880;
}
.table-stock-indicator.low {
  background: rgba(192, 113, 74, 0.1);
  border-color: rgba(192, 113, 74, 0.3);
  color: #c0714a;
}
.table-stock-indicator.out {
  background: rgba(168, 152, 128, 0.05);
  border-color: rgba(168, 152, 128, 0.15);
  color: #5c4d43;
}

.text-right {
  text-align: right;
}

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

.table-prod-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  min-width: 180px;
}

.row-normal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

/* INLINE DELETE CONFIRMATION */
.row-delete-confirm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  padding: 6px 10px;
  background: rgba(201, 147, 138, 0.08);
  border: 1px solid rgba(201, 147, 138, 0.3);
  border-radius: 4px;
  animation: rowConfirmIn 0.18s ease;
}

@keyframes rowConfirmIn {
  from { opacity: 0; transform: translateX(6px); }
  to   { opacity: 1; transform: translateX(0); }
}

.row-confirm-label {
  font-size: 12px;
  color: #c9938a;
  font-weight: 500;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}

.row-confirm-yes {
  background: #c9938a;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 3px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.row-confirm-yes:hover { background: #d8a49c; }

.row-confirm-no {
  background: none;
  color: #a89880;
  border: 1px solid #2d231b;
  padding: 4px 12px;
  border-radius: 3px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.row-confirm-no:hover { border-color: #8b6f47; color: #faf8f5; }

.row-confirm-fade-enter-active,
.row-confirm-fade-leave-active { transition: opacity 0.15s ease; }
.row-confirm-fade-enter-from,
.row-confirm-fade-leave-to { opacity: 0; }

.table-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  margin-left: 2px;
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
.table-action-btn.delete:hover {
  background: rgba(234, 67, 53, 0.15);
  color: #ea4335;
}

.table-empty-row {
  text-align: center;
  padding: 48px !important;
  color: #a89880;
  font-size: 14px;
}

/* DRAWER OVERLAY */
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

/* FILE UPLOAD STYLING */
.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-upload-input {
  display: none !important;
}

.file-upload-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed #4a3e35;
  border-radius: 4px;
  padding: 10px 16px;
  color: #d4b896;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-label:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #8b6f47;
  color: #ffebd1;
}

.remove-image-btn {
  background: rgba(220, 100, 100, 0.15);
  color: #ff9999;
  border: 1px solid rgba(220, 100, 100, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: rgba(220, 100, 100, 0.25);
  color: #ffffff;
}

.preview-stage-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
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

/* DRAWER ANIMATIONS */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.35s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-fade-enter-active .drawer-card { animation: slideLeft 0.35s ease; }
.drawer-fade-leave-active .drawer-card { animation: slideRight 0.3s ease; }

@keyframes slideRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

.anim-fade-in { animation: fadeIn 0.4s ease both; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* DELETE MODAL STYLING — moved to global block below */

/* CUSTOM SWITCH */
.active-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 42px;
}

.switch-lbl {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
}

.switch-lbl input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-switch {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #120d0a;
  border: 1px solid #2d231b;
  transition: .3s;
  border-radius: 34px;
}

.slider-switch:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: #a89880;
  transition: .3s;
  border-radius: 50%;
}

.switch-lbl input:checked + .slider-switch {
  background-color: rgba(139, 111, 71, 0.2);
  border-color: #8b6f47;
}

.switch-lbl input:checked + .slider-switch:before {
  transform: translateX(22px);
  background-color: #8b6f47;
}

.active-status-text {
  font-size: 12.5px;
  color: #faf8f5;
  font-weight: 500;
}

/* READONLY INPUT */
.readonly-input {
  background: #120d0a !important;
  border-color: #2d231b !important;
  color: #8b6f47 !important;
  cursor: not-allowed;
  font-weight: 600;
}

/* TEXTAREA */
.admin-textarea {
  background: #120d0a;
  border: 1px solid #2d231b;
  border-radius: 2px;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: #faf8f5;
  outline: none;
  resize: vertical;
  transition: all 0.25s;
}

.admin-textarea:focus {
  border-color: #8b6f47;
  background: #251d17;
}

.admin-form-group input[type="number"] {
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

.admin-form-group input[type="number"]:focus {
  border-color: #8b6f47;
  background: #251d17;
}

/* DRAWER QUICK DELETE */
.drawer-delete-action-wrap {
  display: flex;
  justify-content: center;
  margin: 16px 0 24px;
}

.drawer-delete-btn {
  background: rgba(201, 147, 138, 0.08);
  border: 1px solid rgba(201, 147, 138, 0.25);
  color: #c9938a;
  padding: 10px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.25s;
}

.drawer-delete-btn:hover {
  background: rgba(234, 67, 53, 0.12);
  border-color: #ea4335;
  color: #ea4335;
}
</style>

<!-- Modal styles are global because the element is teleported outside the component tree -->
<style>
/* DELETE CONFIRMATION MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.7);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #1a1410;
  border: 1px solid #2d231b;
  width: 100%;
  max-width: 400px;
  margin: 16px;
  padding: 32px;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScale {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-icon-wrap {
  width: 54px;
  height: 54px;
  background: rgba(201, 147, 138, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-delete-icon {
  color: #c9938a;
}

.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: #faf8f5;
  margin-bottom: 12px;
}

.modal-desc {
  font-size: 13.5px;
  color: #a89880;
  line-height: 1.5;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.modal-cancel-btn {
  width: 100%;
  max-width: 280px;
  background: none;
  border: 1px solid #2d231b;
  color: #a89880;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
}

.modal-cancel-btn:hover {
  border-color: #8b6f47;
  color: #faf8f5;
}

.modal-confirm-btn {
  width: 100%;
  max-width: 280px;
  background: #c9938a;
  border: 1px solid #c9938a;
  color: #fff;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
}

.modal-confirm-btn:hover {
  background: #d8a49c;
  border-color: #d8a49c;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
