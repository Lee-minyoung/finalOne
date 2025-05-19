<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">
              <form @submit.prevent="resetPwd">
                <div class="text-center mb-3">
                  <p class="welcome-text">새 비밀번호를 입력해 주세요.</p>
                </div>
                <div class="form-section">
                  <div class="input-wrapper">
                    <input 
                      type="password" 
                      class="form-control"
                      v-model="passwordInfo.newPassword"
                      placeholder="8자 이상, 특수문자 포함"
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="input-wrapper">
                    <input 
                      type="password" 
                      class="form-control"
                      v-model="passwordInfo.confirmPassword"
                      placeholder="새 비밀번호를 다시 입력하세요"
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <button 
                      type="button" 
                      class="btn-forgot"
                      @click="goToLogin"
                      :disabled="isLoading"
                    >
                      ← 로그인으로 돌아가기
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    class="btn-login"
                    :disabled="isLoading || !isValidForm"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    비밀번호 변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      passwordInfo: {
        empNo: this.$route.params.empNo,
        newPassword: "",
        confirmPassword: ""
      },
      isLoading: false
    };
  },
  computed: {
    isValidForm() {
      return (
        this.passwordInfo.newPassword.trim() &&
        this.passwordInfo.confirmPassword.trim() &&
        this.passwordInfo.newPassword === this.passwordInfo.confirmPassword &&
        this.passwordInfo.newPassword.length >= 8 &&
        /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordInfo.newPassword)
      );
    }
  },
  methods: {
    async resetPwd() {
      if (!this.isValidForm) {
        alert("모든 필드를 올바르게 입력해주세요.");
        return;
      }
      if (this.passwordInfo.newPassword !== this.passwordInfo.confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      this.isLoading = true;
      try {
        const result = await axios.post('/api/reset-password', {
          empNo: this.passwordInfo.empNo,
          newPassword: this.passwordInfo.newPassword
        });
        if (result.data.result) {
          alert("비밀번호가 성공적으로 변경되었습니다.\n새로운 비밀번호로 로그인해주세요.");
          this.$router.push({ name: "login" });
        } else {
          alert(result.data.message || "비밀번호 변경에 실패했습니다.");
        }
      } catch (err) {
        console.error("비밀번호 변경 오류:", err);
        alert("서버 오류가 발생했습니다.");
      } finally {
        this.isLoading = false;
      }
    },
    goToLogin() {
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
@use "@/styles/style" as *;

.login-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  min-height: 480px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}
.login-card::before,
.login-card::after {
  display: none !important;
  content: none !important;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 2.8rem !important;
}

.form-section {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.input-wrapper {
  margin-bottom: 1.2rem;
}

.input-group, .form-control {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-control {
  border: none;
  padding: 0.75rem 0.8rem;
  font-size: 0.95rem;
  background-color: white;
  &:focus { box-shadow: none; }
  &::placeholder { color: #adb5bd; font-size: 0.92rem; }
}

.btn-login {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: #0d6efd;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }
}

.btn-forgot {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 0.9rem;
  padding: 0.5rem;
  transition: color 0.2s;
  margin-bottom: 1.2rem;
  border-radius: 6px;

  &:hover {
    color: #0d6efd;
    background: none;
  }
}

.invalid-feedback {
  display: block;
  font-size: 0.85rem;
  margin: 0.35rem 0 0 0.75rem;
  color: #dc3545;
}

@media (max-width: 768px) {
  .login-card {
    margin: 1rem;
    min-height: 450px;
  }

  .card-body {
    padding: 2rem !important;
  }

  .form-section {
    max-width: 100%;
  }
}
</style>
