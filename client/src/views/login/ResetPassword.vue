<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">              <form @submit.prevent="resetPwd">
                <div class="text-center mb-4">
                  <img src="@/assets/icons/login_bobe.png" alt="밥먹고하시조" class="login-logo" />
                  <p class="welcome-text">임시 비밀번호를 입력하고<br>새로운 비밀번호를 설정해주세요.</p>
                </div>

                <div class="form-section">
                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-shield-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="passwordInfo.tempPassword" 
                        placeholder="임시 비밀번호"
                        :disabled="isLoading"
                      />
                    </div>
                  </div>

                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-key"></i>
                      </span>
                      <input 
                        type="password"                        class="form-control"                        v-model="passwordInfo.newPassword" 
                        placeholder="새 비밀번호 (8자 이상)"
                        :disabled="isLoading"
                      />
                    </div>
                  </div>

                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-key-fill"></i>
                      </span>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="passwordInfo.confirmPassword" 
                        placeholder="새 비밀번호 확인"
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
                      로그인으로 돌아가기
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    class="btn-login"
                    :disabled="isLoading || !isValidForm"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? '처리 중...' : '비밀번호 변경' }}
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
        tempPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      isLoading: false
    };
  },
  computed: {
    isValidForm() {
      return this.passwordInfo.tempPassword.trim() &&
             this.passwordInfo.newPassword.trim() &&
             this.passwordInfo.confirmPassword.trim() &&
             this.passwordInfo.newPassword === this.passwordInfo.confirmPassword &&
             this.passwordInfo.newPassword.length >= 8;
    }
  },  methods: {
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
        const result = await axios.post('/api/reset-password', this.passwordInfo);
        if (result.data.result) {
          alert("비밀번호가 성공적으로 변경되었습니다.\n새로운 비밀번호로 로그인해주세요.");
          this.$router.push({ name: "login" });
        } else {
          alert(result.data.message || "임시 비밀번호가 일치하지 않습니다.");
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
  background-color: #f8f9fa;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  min-height: 480px;
  display: flex;
  flex-direction: column;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 2.8rem !important;
}

.login-logo {
  width: 200px;
  height: auto;
  margin-bottom: 1rem;
}

.welcome-text {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 2.2rem;
  font-weight: 500;
}

.form-section {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.input-wrapper {
  margin-bottom: 1.2rem;

  .form-text {
    font-size: 0.85rem;
    margin-top: 0.4rem;
    margin-left: 0.5rem;
  }
}

.input-group {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
  }
  
  .input-group-text {
    background-color: white;
    border: none;
    color: #6c757d;
    padding: 0.75rem 1rem;
    
    i {
      font-size: 1.1rem;
    }
  }

  .form-control {
    border: none;
    padding: 0.75rem 0.8rem;
    font-size: 0.95rem;
    background-color: white;

    &:focus {
      box-shadow: none;
    }

    &::placeholder {
      color: #adb5bd;
      font-size: 0.92rem;
    }
  }
}

.btn-forgot {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 0.9rem;
  padding: 0;
  transition: color 0.2s;
  margin-bottom: 1.2rem;

  &:hover {
    color: #0d6efd;
  }
}

.btn-login {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background: #0d6efd;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #0b5ed7;
    transform: translateY(-1px);
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
</style>
