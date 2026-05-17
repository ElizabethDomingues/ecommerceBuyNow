<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="handleClose">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        
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
            <h2 class="success-title">
              {{ activeTab === 'register' ? 'Conta Criada!' : 'Bem-vindo de volta!' }}
            </h2>
            <p class="success-subtitle">
              {{ activeTab === 'register' 
                ? `Olá, ${formData.name}! Sua conta na AURÊ foi criada com sucesso.` 
                : 'Login realizado com sucesso. Redirecionando...' }}
            </p>
            <button class="success-btn-action" @click="handleClose">
              Começar a Navegar
            </button>
          </div>
        </transition>

        <div v-if="!successState" class="modal-content-wrap">
          
          <div class="tabs-header">
            <button 
              type="button" 
              class="tab-trigger" 
              :class="{ active: activeTab === 'login' }"
              @click="switchTab('login')"
            >
              Entrar
            </button>
            <button 
              type="button" 
              class="tab-trigger" 
              :class="{ active: activeTab === 'register' }"
              @click="switchTab('register')"
            >
              Criar Conta
            </button>
            <div 
              class="tab-indicator" 
              :style="{ 
                transform: activeTab === 'register' ? 'translateX(100%)' : 'translateX(0)' 
              }"
            ></div>
          </div>

          <form @submit.prevent="handleSubmit" class="auth-form">
            <transition-group name="field-fade">
              <div v-if="activeTab === 'register'" key="name" class="input-group">
                <input 
                  type="text" 
                  id="reg-name" 
                  v-model="formData.name" 
                  required 
                  placeholder=" "
                  autocomplete="name"
                />
                <label for="reg-name">Nome Completo</label>
                <span class="bar"></span>
              </div>

              <div v-if="activeTab === 'register'" key="phone" class="input-group">
                <input 
                  type="tel" 
                  id="reg-phone" 
                  v-model="formData.phone" 
                  placeholder=" "
                  autocomplete="tel"
                  @input="formatPhone"
                />
                <label for="reg-phone">Telefone (opcional)</label>
                <span class="bar"></span>
              </div>
            </transition-group>
            <div class="input-group">
              <input 
                type="email" 
                id="auth-email" 
                v-model="formData.email" 
                required 
                placeholder=" "
                autocomplete="email"
              />
              <label for="auth-email">E-mail</label>
              <span class="bar"></span>
            </div>

            <div class="input-group password-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="auth-password" 
                v-model="formData.password" 
                required 
                placeholder=" "
                autocomplete="current-password"
              />
              <label for="auth-password">Senha</label>
              <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Esconder senha' : 'Mostrar senha'"
              >
                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <span class="bar"></span>
            </div>
            <transition name="field-fade">
              <div v-if="activeTab === 'register'" key="confirm" class="input-group password-group">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="reg-confirm-password" 
                  v-model="formData.confirmPassword" 
                  required 
                  placeholder=" "
                  autocomplete="new-password"
                />
                <label for="reg-confirm-password">Confirmar Senha</label>
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'"
                >
                  <svg v-if="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <span class="bar"></span>
              </div>
            </transition>
            <div class="form-options">
              <div v-if="activeTab === 'login'" class="login-options">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="formData.rememberMe" />
                  <span class="checkmark-box"></span>
                  <span class="checkbox-label">Lembrar de mim</span>
                </label>
                <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">Esqueceu a senha?</a>
              </div>

              <div v-if="activeTab === 'register'" class="register-options">
                <label class="custom-checkbox align-start">
                  <input type="checkbox" v-model="formData.acceptTerms" required />
                  <span class="checkmark-box"></span>
                  <span class="checkbox-label">
                    Li e concordo com os <a href="#" class="inline-link" @click.prevent>Termos de Uso</a> e <a href="#" class="inline-link" @click.prevent>Políticas de Privacidade</a>.
                  </span>
                </label>
                <label class="custom-checkbox align-start mt-12">
                  <input type="checkbox" v-model="formData.subscribeNewsletter" />
                  <span class="checkmark-box"></span>
                  <span class="checkbox-label">
                    Quero receber novidades, ofertas exclusivas e lançamentos AURÊ no meu e-mail.
                  </span>
                </label>
              </div>
            </div>

            <transition name="fade">
              <div v-if="errorMsg" class="error-msg">
                <span>{{ errorMsg }}</span>
              </div>
            </transition>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">
                {{ activeTab === 'login' ? 'Entrar na minha conta' : 'Criar minha conta' }}
              </span>
              <span v-else class="loader-wrap">
                <span class="mini-spinner"></span>
                Carregando...
              </span>
            </button>
          </form>

          <div class="divider-text">
            <span>Ou continue com</span>
          </div>

    
          <div class="modal-footer-switch">
            <span>
              {{ activeTab === 'login' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?' }}
            </span>
            <button 
              type="button" 
              class="inline-switch-btn" 
              @click="switchTab(activeTab === 'login' ? 'register' : 'login')"
            >
              {{ activeTab === 'login' ? 'Cadastre-se' : 'Faça login' }}
            </button>
          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { addUser, currentUser, users } from '../../store'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('login')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const successState = ref(false)
const errorMsg = ref('')

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
  acceptTerms: false,
  subscribeNewsletter: true
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    resetForm()
  } else {
    document.body.style.overflow = ''
  }
})

function resetForm() {
  activeTab.value = 'login'
  showPassword.value = false
  showConfirmPassword.value = false
  loading.value = false
  successState.value = false
  errorMsg.value = ''
  formData.name = ''
  formData.phone = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.rememberMe = false
  formData.acceptTerms = false
  formData.subscribeNewsletter = true
}

function handleClose() {
  emit('close')
}

function switchTab(tab) {
  activeTab.value = tab
  errorMsg.value = ''
  showPassword.value = false
  showConfirmPassword.value = false
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

  if (activeTab.value === 'register') {
    if (formData.name.trim().split(' ').length < 2) {
      errorMsg.value = 'Por favor, insira seu nome completo.'
      return
    }
    if (formData.password.length < 6) {
      errorMsg.value = 'A senha deve conter no mínimo 6 caracteres.'
      return
    }
    if (formData.password !== formData.confirmPassword) {
      errorMsg.value = 'As senhas não coincidem.'
      return
    }
    if (!formData.acceptTerms) {
      errorMsg.value = 'Você deve aceitar os termos de uso para continuar.'
      return
    }
  }

  loading.value = true
  
  try {
    if (activeTab.value === 'register') {
      await addUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        role: 'Cliente'
      })
    } else {
      const match = users.value.find(u => u.email.toLowerCase() === formData.email.toLowerCase())
      if (match) {
        if (match.status === 'Inativo') {
          errorMsg.value = 'Esta conta está inativa. Entre em contato com o suporte.'
          loading.value = false
          return
        }
        currentUser.value = match
      } else {
        const newUser = await addUser({
          name: formData.email.split('@')[0].toUpperCase(),
          email: formData.email,
          phone: '',
          role: 'Cliente',
          status: 'Ativo'
        })
        currentUser.value = newUser
      }
    }
    
    loading.value = false
    successState.value = true
    
    setTimeout(() => {
      handleClose()
    }, 2800)
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Ocorreu um erro ao conectar ao banco de dados.'
    loading.value = false
  }
}

function handleForgotPassword() {
  alert(`Instruções de recuperação enviadas para: ${formData.email || 'seu e-mail'}`)
}

function handleSocialLogin(provider) {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    formData.name = provider === 'Apple' ? 'Usuario Apple' : 'Usuario Google'
    successState.value = true
    setTimeout(() => {
      handleClose()
    }, 2500)
  }, 1000)
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
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

.tabs-header {
  display: flex;
  position: relative;
  border-bottom: 1px solid #e8e0d5;
  margin-bottom: 32px;
  gap: 0;
}

.tab-trigger {
  flex: 1;
  background: none;
  border: none;
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 500;
  color: #a89880;
  cursor: pointer;
  padding: 12px 0 16px;
  text-align: center;
  transition: color 0.3s ease;
}

.tab-trigger.active {
  color: #1a1410;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50%;
  height: 2px;
  background: #8b6f47;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-form {
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

.password-group input {
  padding-right: 32px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #a89880;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-password:hover {
  color: #8b6f47;
}

.form-options {
  margin: 8px 0 28px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 12px;
  color: #8b6f47;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: #1a1410;
  text-decoration: underline;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}
.custom-checkbox.align-start {
  align-items: flex-start;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark-box {
  height: 16px;
  width: 16px;
  background-color: transparent;
  border: 1px solid #c8bdaf;
  border-radius: 2px;
  margin-right: 10px;
  flex-shrink: 0;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
  top: 1px;
}

.custom-checkbox input:checked ~ .checkmark-box {
  background-color: #8b6f47;
  border-color: #8b6f47;
}

.checkmark-box:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark-box:after {
  display: block;
}

.custom-checkbox .checkmark-box:after {
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 13px;
  color: #6b5543;
  line-height: 1.4;
}

.inline-link {
  color: #8b6f47;
  text-decoration: none;
  font-weight: 500;
}
.inline-link:hover {
  text-decoration: underline;
}

.mt-12 {
  margin-top: 12px;
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

.submit-btn:hover .mini-spinner {
  border-color: rgba(26, 20, 16, 0.3);
  border-top-color: #1a1410;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider-text {
  text-align: center;
  position: relative;
  margin: 28px 0;
}

.divider-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #e8e0d5;
  z-index: 1;
}

.divider-text span {
  position: relative;
  background: #faf8f5;
  padding: 0 16px;
  font-size: 11px;
  color: #a89880;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  z-index: 2;
}

.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #faf8f5;
  border: 1px solid #e0d5c8;
  padding: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #3d2f1e;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #f0ece6;
  border-color: #8b6f47;
}

.social-icon {
  flex-shrink: 0;
}

.modal-footer-switch {
  text-align: center;
  font-size: 13px;
  color: #6b5543;
}

.inline-switch-btn {
  background: none;
  border: none;
  color: #8b6f47;
  font-weight: 600;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
  text-decoration: underline;
  font-family: 'DM Sans', sans-serif;
}
.inline-switch-btn:hover {
  color: #1a1410;
}

.success-screen {
  position: absolute;
  inset: 0;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  z-index: 20;
  text-align: center;
}

.success-icon-wrap {
  margin-bottom: 24px;
}

.success-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  color: #1a1410;
  margin-bottom: 12px;
}

.success-subtitle {
  font-size: 14.5px;
  color: #6b5543;
  line-height: 1.6;
  max-width: 320px;
  margin-bottom: 32px;
}

.success-btn-action {
  background: #1a1410;
  color: #faf8f5;
  border: 1px solid #1a1410;
  padding: 14px 28px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}
.success-btn-action:hover {
  background: transparent;
  color: #1a1410;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #8b6f47;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #8b6f47;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% { stroke-dashoffset: 0; }
}
@keyframes scale {
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
}
@keyframes fill {
  100% { box-shadow: inset 0px 0px 0px 30px #8b6f47; }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card {
  animation: zoomIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-leave-active .modal-card {
  animation: zoomOut 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes zoomOut {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.95) translateY(8px); }
}

.success-fade-enter-active {
  transition: all 0.4s ease 0.1s;
}
.success-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.field-fade-enter-active,
.field-fade-leave-active {
  transition: all 0.25s ease;
}
.field-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.field-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
  position: absolute; 
  width: 100%;
}

@media (max-width: 576px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end; 
  }
  
  .modal-card {
    max-height: 94vh;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  }
  
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  
  .modal-content-wrap {
    padding: 32px 24px 40px;
  }
  
  .social-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
