<template>
  <div class="admin-login-wrapper">
    <div class="background-decorations">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>

    <div class="login-card anim-slide-up">
      <header class="login-header">
        <div class="logo-icon">◈</div>
        <h1 class="logo-text">AURÊ</h1>
        <p class="panel-subtitle">PAINEL ADMINISTRATIVO</p>
      </header>

      <form @submit.prevent="handleLoginSubmit" class="login-form">
        <transition name="alert-fade">
          <div v-if="errorMsg" class="login-error-alert">
            <svg class="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span class="error-text">{{ errorMsg }}</span>
          </div>
        </transition>

        <div class="input-group">
          <input 
            type="email" 
            id="admin-email" 
            v-model="email" 
            required 
            placeholder=" "
            autocomplete="email"
            :disabled="loading"
          />
          <label for="admin-email">E-mail de Acesso</label>
          <span class="focus-bar"></span>
        </div>

        <div class="input-group password-group">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="admin-password" 
            v-model="password" 
            required 
            placeholder=" "
            autocomplete="current-password"
            :disabled="loading"
          />
          <label for="admin-password">Senha de Segurança</label>
          
          <button 
            type="button" 
            class="toggle-pwd-btn" 
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            :disabled="loading"
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
          
          <span class="focus-bar"></span>
        </div>

        <button type="submit" class="submit-login-btn" :disabled="loading">
          <span v-if="!loading" class="btn-content-wrap">
            Autenticar e Entrar
            <svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
          <span v-else class="btn-spinner-wrap">
            <span class="loading-spinner"></span>
            Autenticando...
          </span>
        </button>
      </form>

      <footer class="login-footer">
        <button class="back-home-link" @click="goHome">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Voltar para a Loja
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginAdmin, navigateTo } from '../store'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function handleLoginSubmit() {
  if (loading.value) return
  errorMsg.value = ''
  loading.value = true

  try {
    const result = await loginAdmin(email.value, password.value)
    if (!result.success) {
      errorMsg.value = result.error || 'Falha ao autenticar. Tente novamente.'
    } else {
      navigateTo('#/admin')
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Ocorreu um erro de rede. Verifique seu servidor.'
  } finally {
    loading.value = false
  }
}

function goHome() {
  navigateTo('#/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.admin-login-wrapper {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #120d0a; 
  font-family: 'DM Sans', sans-serif;
  color: #faf8f5;
  overflow: hidden;
  padding: 24px;
}

.background-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}

.orb-1 {
  top: -10%;
  left: 20%;
  width: 400px;
  height: 400px;
  background: #8b6f47;
}

.orb-2 {
  bottom: -10%;
  right: 15%;
  width: 450px;
  height: 450px;
  background: #3a2e26;
}

.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  background: rgba(26, 20, 16, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(139, 111, 71, 0.15);
  border-radius: 4px;
  padding: 48px 40px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  font-size: 28px;
  color: #8b6f47;
  margin-bottom: 8px;
  line-height: 1;
  text-shadow: 0 0 10px rgba(139, 111, 71, 0.3);
}

.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: #faf8f5;
  margin: 0 0 6px 0;
  line-height: 1.1;
}

.panel-subtitle {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: #8b6f47;
  text-transform: uppercase;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-group input {
  width: 100%;
  padding: 12px 0 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #faf8f5;
  border: none;
  border-bottom: 1px solid rgba(232, 224, 213, 0.2);
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}

.input-group label {
  position: absolute;
  top: 12px;
  left: 0;
  font-size: 13.5px;
  color: #a89880;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -12px;
  font-size: 10.5px;
  color: #8b6f47;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.focus-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #8b6f47;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(139, 111, 71, 0.4);
}

.input-group input:focus ~ .focus-bar {
  transform: scaleX(1);
}

.password-group input {
  padding-right: 32px;
}

.toggle-pwd-btn {
  position: absolute;
  right: 0;
  top: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(168, 152, 128, 0.7);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-pwd-btn:hover:not(:disabled) {
  color: #8b6f47;
}

/* Alert Box */
.login-error-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(181, 41, 31, 0.12);
  border-left: 3px solid #ea4335;
  padding: 12px 16px;
  font-size: 12.5px;
  color: #fca5a5;
  border-radius: 0 4px 4px 0;
  box-sizing: border-box;
}

.alert-icon {
  flex-shrink: 0;
  color: #ea4335;
}

.error-text {
  line-height: 1.4;
}

.submit-login-btn {
  width: 100%;
  background: #8b6f47;
  color: #faf8f5;
  border: 1px solid #8b6f47;
  padding: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(139, 111, 71, 0.15);
}

.submit-login-btn:hover:not(:disabled) {
  background: transparent;
  color: #8b6f47;
  box-shadow: 0 4px 20px rgba(139, 111, 71, 0.3);
}

.submit-login-btn:disabled {
  background: #4e3f2d;
  border-color: #4e3f2d;
  color: #8a7a6a;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-content-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.arrow-icon {
  transition: transform 0.25s ease;
}

.submit-login-btn:hover:not(:disabled) .arrow-icon {
  transform: translateX(4px);
}

.btn-spinner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.back-home-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #a89880;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
}

.back-home-link:hover {
  color: #8b6f47;
}

.back-home-link svg {
  transition: transform 0.2s ease;
}

.back-home-link:hover svg {
  transform: translateX(-3px);
}

.anim-slide-up {
  animation: slideUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
