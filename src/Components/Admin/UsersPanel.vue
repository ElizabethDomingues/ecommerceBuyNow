<template>
  <div class="panel-users anim-fade-in">
    
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
      
      <button class="admin-primary-btn" @click="openCreateUser">
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
            <th>Status</th>
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
            <td>
              <span class="status-badge" :class="user.status === 'Inativo' ? 'inativo' : 'ativo'">
                {{ user.status || 'Ativo' }}
              </span>
            </td>
            <td><span class="text-secondary">{{ user.date }}</span></td>
            <td class="text-right actions-cell">
              <button 
                class="table-action-btn edit" 
                @click="openEditUser(user)" 
                :disabled="user.id === 1 && currentUser?.id !== 1"
                title="Editar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
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

    <!-- B. USER CREATION MODAL -->
    <transition name="modal-scale">
      <div v-if="showUserModal" class="user-modal-overlay" @click.self="showUserModal = false">
        <div class="user-modal-card">
          
          <div class="user-modal-header">
            <h3>{{ editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário' }}</h3>
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
              <select v-model="userForm.role" required :disabled="editingUser?.id === 1">
                <option value="Cliente">Cliente</option>
                <option value="Estoquista">Estoquista</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div v-if="editingUser" class="admin-form-group">
              <label>Status da Conta</label>
              <select v-model="userForm.status" required :disabled="editingUser?.id === 1">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div class="user-modal-footer">
              <button type="button" class="admin-secondary-btn" @click="showUserModal = false">Cancelar</button>
              <button type="submit" class="admin-primary-btn" :disabled="formLoading">
                <span v-if="!formLoading">{{ editingUser ? 'Salvar Alterações' : 'Cadastrar' }}</span>
                <span v-else class="drawer-spinner"></span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { users, addUser, updateUser, deleteUser, currentUser } from '../../store'

const emit = defineEmits(['show-toast', 'add-log'])

const userSearch = ref('')
const showUserModal = ref(false)
const editingUser = ref(null)
const formLoading = ref(false)

const userForm = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'Cliente',
  status: 'Ativo'
})

const filteredUsers = computed(() => {
  if (!userSearch.value.trim()) return users.value
  const query = userSearch.value.toLowerCase()
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  )
})

function openCreateUser() {
  editingUser.value = null
  userForm.name = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.role = 'Cliente'
  userForm.status = 'Ativo'
  showUserModal.value = true
}

function openEditUser(user) {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.phone = user.phone || ''
  userForm.role = user.role
  userForm.status = user.status || 'Ativo'
  showUserModal.value = true
}

async function saveUser() {
  formLoading.value = true
  
  if (editingUser.value) {
    const updated = await updateUser(editingUser.value.id, {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      status: userForm.status
    })
    
    showUserModal.value = false
    formLoading.value = false
    
    if (updated) {
      emit('show-toast', 'Usuário atualizado com sucesso!')
      emit('add-log', {
        text: `Elizabeth D. atualizou o usuário: ${updated.name}`,
        time: 'Agora',
        type: 'user'
      })
    }
    editingUser.value = null
    return
  }

  const newUser = await addUser({
    name: userForm.name,
    email: userForm.email,
    phone: userForm.phone,
    role: userForm.role,
    status: 'Ativo'
  })
  
  showUserModal.value = false
  formLoading.value = false
  
  // Reset
  userForm.name = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.role = 'Cliente'
  userForm.status = 'Ativo'
  
  if (newUser) {
    emit('show-toast', 'Usuário cadastrado com sucesso!')
    emit('add-log', {
      text: `Elizabeth D. registrou usuário: ${newUser.name} (${newUser.role})`,
      time: 'Agora',
      type: 'user'
    })
  }
}

async function confirmDeleteUser(user) {
  if (confirm(`Tem certeza que deseja remover o acesso de "${user.name}"?`)) {
    const success = await deleteUser(user.id)
    if (success) {
      emit('show-toast', 'Usuário removido com sucesso.')
      emit('add-log', {
        text: `Elizabeth D. removeu o usuário: ${user.name}`,
        time: 'Agora',
        type: 'info'
      })
    }
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
</script>

<style scoped>
.panel-users {
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

.text-right {
  text-align: right;
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
.table-action-btn.edit:hover:not(:disabled) {
  background: rgba(139, 111, 71, 0.15);
  color: #8b6f47;
}
.table-action-btn.edit:disabled {
  opacity: 0.35;
  cursor: not-allowed;
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

.user-modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.user-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
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

/* MODAL SCALE ANIMATION */
.modal-scale-enter-active, .modal-scale-leave-active { transition: all 0.3s ease; }
.modal-scale-enter-from, .modal-scale-leave-to { opacity: 0; }
.modal-scale-enter-active .user-modal-card { animation: modalScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active .user-modal-card { animation: modalScaleOut 0.2s ease; }

@keyframes modalScaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes modalScaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}

.anim-fade-in { animation: fadeIn 0.4s ease both; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
