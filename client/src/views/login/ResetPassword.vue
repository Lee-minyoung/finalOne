<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">
              <form @submit.prevent="resetPwd">
                <div class="text-center mb-3">
                  <p class="welcome-text">
                    새 비밀번호를 입력해 주세요.<br>
                    <span class="form-text">보안을 위해 8자 이상, 영문/숫자/특수문자 조합을 권장합니다.</span>
                  </p>
                </div>
                <div class="form-section">
                  <div class="input-wrapper">
                    <label class="form-label">새 비밀번호</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-key"></i>
                      </span>
                    <input 
                        :type="showPwd ? 'text' : 'password'"
                      class="form-control"
                      v-model="passwordInfo.newPassword"
                        placeholder="새 비밀번호를 입력하세요"
                        :class="{ 'is-invalid': newPwdError }"
                      :disabled="isLoading"
                    />
                      <button class="btn btn-outline-secondary" type="button" @click="showPwd = !showPwd">
                        <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="input-wrapper">
                    <label class="form-label">새 비밀번호 확인</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-key-fill"></i>
                      </span>
                    <input 
                        :type="showPwd ? 'text' : 'password'"
                      class="form-control"
                      v-model="passwordInfo.confirmPassword"
                        placeholder="비밀번호를 한 번 더 입력하세요"
                        :class="{ 'is-invalid': confirmPwdError }"
                      :disabled="isLoading"
                    />
                    </div>
                  </div>
                  <div class="text-end mb-3">
                    <button 
                      type="button" 
                      class="btn-forgot"
                      @click="goToLogin"
                      :disabled="isLoading"
                    >
                      <i class="bi bi-arrow-left me-1"></i>
                      로그인으로 돌아가기
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
      isLoading: false,
      showPwd: false
    };
  },
  computed: {
    newPwdError() {
      if (!this.passwordInfo.newPassword) return "새 비밀번호를 입력하세요.";
      if (this.passwordInfo.newPassword.length < 8) return "8자 이상 입력하세요.";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.passwordInfo.newPassword)) return "특수문자를 포함하세요.";
      return "";
    },
    confirmPwdError() {
      if (!this.passwordInfo.confirmPassword) return "비밀번호를 한 번 더 입력하세요.";
      if (this.passwordInfo.newPassword !== this.passwordInfo.confirmPassword) return "비밀번호가 일치하지 않습니다.";
      return "";
    },
    isValidForm() {
      return (
        this.passwordInfo.newPassword.length >= 8 &&
        /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordInfo.newPassword) &&
        this.passwordInfo.newPassword === this.passwordInfo.confirmPassword
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

.welcome-text {
  color: #1a1d1f;
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
}

.form-section {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.input-wrapper {
  margin-bottom: 1.2rem;
}

.input-group {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  }

  .input-group-text {
    background-color: white;
    border: none;
    color: #6c757d;
    padding: 0.75rem 1rem;
    transition: color 0.3s ease;
    i { font-size: 1.1rem; }
  }

  &:focus-within .input-group-text {
    color: #0d6efd;
}

.form-control {
  border: none;
  padding: 0.75rem 0.8rem;
  font-size: 0.95rem;
  background-color: white;
  &:focus { box-shadow: none; }
  &::placeholder { color: #adb5bd; font-size: 0.92rem; }
  }
}

.form-label {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.4rem;
  margin-left: 0.5rem;
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

  i {
    font-size: 0.9rem;
  }
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
