<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="handleClose">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        
        <button class="close-btn" @click="handleClose" aria-label="Fechar modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <transition name="success-fade">
          <div v-if="successState" class="success-screen">
            <div class="success-icon-wrap">
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 class="success-title">Perfil Atualizado!</h2>
            <p class="success-subtitle">Suas informações foram salvas com sucesso no banco de dados.</p>
            <button class="success-btn-action" @click="handleClose">
              Voltar à Loja
            </button>
          </div>
        </transition>

        <div v-if="!successState" class="modal-content-wrap">
          <div class="profile-header">
            <h2 id="profile-title" class="profile-title">Meu Perfil</h2>
            <span class="profile-badge">{{ currentUser?.role || 'Cliente' }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="profile-form">
            <div class="input-group">
              <input 
                type="text" 
                id="prof-name" 
                v-model="formData.name" 
                required 
                placeholder=" "
                autocomplete="name"
              />
              <label for="prof-name">Nome Completo</label>
              <span class="bar"></span>
            </div>

            <div class="input-group">
              <input 
                type="email" 
                id="prof-email" 
                v-model="formData.email" 
                required 
                placeholder=" "
                autocomplete="email"
              />
              <label for="prof-email">E-mail</label>
              <span class="bar"></span>
            </div>

            <div class="input-group">
              <input 
                type="tel" 
                id="prof-phone" 
                v-model="formData.phone" 
                placeholder=" "
                autocomplete="tel"
                @input="formatPhone"
              />
              <label for="prof-phone">Telefone</label>
              <span class="bar"></span>
            </div>

            <transition name="fade">
              <div v-if="errorMsg" class="error-msg">
                <span>{{ errorMsg }}</span>
              </div>
            </transition>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">Salvar Alterações</span>
              <span v-else class="loader-wrap">
                <span class="mini-spinner"></span>
                Salvando...
              </span>
            </button>
          </form>

          <div class="logout-wrap">
            <button class="logout-btn" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { currentUser, updateUser } from '../../store'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const successState = ref(false)
const errorMsg = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    errorMsg.value = ''
    successState.value = false
    loading.value = false
    
    // Load active session user details
    if (currentUser.value) {
      formData.name = currentUser.value.name
      formData.email = currentUser.value.email
      formData.phone = currentUser.value.phone || ''
    }
  } else {
    document.body.style.overflow = ''
  }
})

function handleClose() {
  emit('close')
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
  formData.phone = e.target.value
}

async function handleSubmit() {
  errorMsg.value = ''

  if (formData.name.trim().split(' ').length < 2) {
    errorMsg.value = 'Por favor, insira seu nome completo.'
    return
  }

  loading.value = true
  
  try {
    if (currentUser.value) {
      await updateUser(currentUser.value.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      })
      
      loading.value = false
      successState.value = true
    } else {
      loading.value = false
      errorMsg.value = 'Nenhum usuário logado.'
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Falha ao atualizar dados no banco de dados.'
    loading.value = false
  }
}

function handleLogout() {
  currentUser.value = null
  handleClose()
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200; 
  background: rgba(26, 20, 16, 0.45);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: #faf8f5;
  border: 1px solid #e8e0d5;
  border-radius: 4px;
  box-shadow: 0 24px 64px rgba(26, 20, 16, 0.18);
  position: relative;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b5543;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  z-index: 10;
}
.close-btn:hover {
  background: #f0ece6;
  color: #1a1410;
  transform: rotate(90deg);
}

.modal-content-wrap {
  padding: 40px;
  overflow-y: auto;
  flex: 1;
}

.profile-header {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e0d5;
  padding-bottom: 16px;
}

.profile-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 600;
  color: #1a1410;
  letter-spacing: 0.05em;
}

.profile-badge {
  background: #f0ece6;
  color: #8b6f47;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 50px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.input-group input {
  width: 100%;
  padding: 12px 0 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #1a1410;
  border: none;
  border-bottom: 1px solid #e8e0d5;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}

.input-group label {
  position: absolute;
  top: 12px;
  left: 0;
  font-size: 14px;
  color: #a89880;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -12px;
  font-size: 11px;
  color: #8b6f47;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.input-group .bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: #8b6f47;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.input-group input:focus ~ .bar {
  transform: scaleX(1);
}

.error-msg {
  background: #fdf3f2;
  border-left: 3px solid #ea4335;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #b5291f;
  margin-bottom: 20px;
  border-radius: 0 4px 4px 0;
}

.submit-btn {
  width: 100%;
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 15px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #faf8f5;
  color: #1a1410;
}

.submit-btn:disabled {
  background: #a89880;
  border-color: #a89880;
  cursor: not-allowed;
  opacity: 0.8;
}

.loader-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.logout-wrap {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px dashed #e8e0d5;
  display: flex;
  justify-content: center;
}

.logout-btn {
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #b5291f;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.25s;
}

.logout-btn:hover {
  background: #fdf3f2;
}

.success-screen {
  position: absolute;
  inset: 0;
  background: #faf8f5;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f0ece6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.checkmark {
  width: 40px;
  height: 40px;
  stroke: #8b6f47;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.success-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  color: #1a1410;
  margin-bottom: 12px;
  font-weight: 600;
}

.success-subtitle {
  font-size: 14px;
  color: #6b5543;
  max-width: 320px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.success-btn-action {
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 14px 28px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}

.success-btn-action:hover {
  background: transparent;
  color: #1a1410;
}

/* MODAL TRANSITIONS */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.35s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card, .modal-fade-leave-active .modal-card {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card {
  transform: translateY(20px);
}

.success-fade-enter-active, .success-fade-leave-active {
  transition: all 0.4s ease;
}
.success-fade-enter-from, .success-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
