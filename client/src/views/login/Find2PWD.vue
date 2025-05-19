<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">
              <form @submit.prevent="findPwd">
                <div class="text-center mb-3">
                  <p class="welcome-text">비밀번호를 잊으셨나요?<br>가입 시 등록한 이메일 주소를 입력해 주세요.</p>
                </div>

                <div class="form-section">
                  <div class="input-wrapper">
                    <label class="form-label">이메일 주소</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="findInfo.email" 
                        placeholder="이메일 주소를 입력하세요"
                        :disabled="isLoading || isEmailSent"
                      />
                    </div>
                    <div class="form-text">입력하신 이메일로 임시 비밀번호가 발송됩니다.</div>
                  </div>

                  <div v-if="isEmailSent" class="input-wrapper">
                    <label class="form-label">임시 비밀번호</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-key"></i>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="findInfo.tempPassword" 
                        placeholder="이메일로 받은 임시 비밀번호를 입력하세요"
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
                    {{ getButtonText }}
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
      findInfo: {
        email: "",
        tempPassword: "",
      },
      isLoading: false,
      isEmailSent: false,
      empNo: null
    };
  },
  computed: {
    isValidForm() {
      if (!this.isEmailSent) {
        return this.findInfo.email?.trim();
      }
      return this.findInfo.email?.trim() && this.findInfo.tempPassword?.trim();
    },
    getButtonText() {
      if (this.isLoading) return '처리 중...';
      if (this.isEmailSent) return '비밀번호 변경하기';
      return '임시 비밀번호 받기';
    }
  },
  methods: {
    async findPwd() {
      if (!this.isEmailSent) {
        // 이메일 전송 단계
        if (!this.findInfo.email?.trim()) {
          alert("이메일 주소를 입력해 주세요.");
        return;
      }
      this.isLoading = true;
      try {
          const response = await axios.post(`/api/find-password`, { email: this.findInfo.email });
          console.log("서버 응답:", response.data);

          if (response.data && response.data.empNo) {
            this.empNo = response.data.empNo;
            this.isEmailSent = true;
            alert("임시 비밀번호가 이메일로 발송되었습니다.\n이메일을 확인하여 임시 비밀번호를 입력해주세요.");
        } else {
            alert(response.data.message || "등록된 이메일 주소를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("비밀번호 찾기 오류:", err);
          if (err.response?.data?.message) {
            alert(err.response.data.message);
          } else {
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
      } finally {
        this.isLoading = false;
        }
      } else {
        // 임시 비밀번호 확인 단계
        if (!this.findInfo.tempPassword?.trim()) {
          alert("임시 비밀번호를 입력해 주세요.");
          return;
        }
        this.$router.push({ 
          name: "resetPwd",
          params: { 
            empNo: this.empNo,
            tempPassword: this.findInfo.tempPassword
          }
        });
      }
    },
    goToLogin() {
      this.$router.push({ name: "login" });
    }
  },
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

.login-logo {
  width: 200px;
  height: auto;
  margin-bottom: 1rem;
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

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  padding: 0 1rem;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #adb5bd;
    font-size: 0.8rem;
    
    i {
      font-size: 1.5rem;
      margin-bottom: 0.3rem;
    }

    &.active {
      color: #0d6efd;
    }
  }

  .step-line {
    width: 40px;
    height: 2px;
    background: #dee2e6;
    margin: 0 0.5rem;
    position: relative;
    top: -0.5rem;
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