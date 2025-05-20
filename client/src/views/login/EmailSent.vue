<template>
  <div class="email-sent-container">
    <div class="email-sent-content">
      <div class="icon-container">
        <i class="fas fa-envelope"></i>
      </div>
      <h1>이메일이 발송되었습니다</h1>
      <p>입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.</p>
      <p>이메일을 확인해주세요.</p>
      <button class="btn-back" @click="goToLogin">로그인으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.email-sent-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.email-sent-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}
</style> 