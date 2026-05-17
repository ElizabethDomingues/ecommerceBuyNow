<template>
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
</template>

<script setup>
// Sem lógica reativa necessária
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

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
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #a89880;
  text-align: center;
}
.footer-links {
  font-family: 'DM Sans', sans-serif;
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
</style>
