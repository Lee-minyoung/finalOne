<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">
              <form @submit.prevent="findPwd">
                <div class="text-center mb-4">
                  <img src="@/assets/icons/login_bobe.png" alt="밥먹고하시조" class="login-logo" />
                  <p class="welcome-text">비밀번호를 잊으셨나요?<br>사원번호와 이메일을 입력해 주세요.</p>
                </div>

                <div class="form-section">
                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-person-fill"></i>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="findInfo.empNo" 
                        placeholder="사원번호"
                        :disabled="isLoading"
                      />
                    </div>
                  </div>

                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="findInfo.email" 
                        placeholder="이메일"
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
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? '처리 중...' : '비밀번호 찾기' }}
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
        empNo: "",
        email: "",
      },
      isLoading: false,
    };
  },
  methods: {
    async findPwd() {
      if (!this.findInfo.empNo.trim() || !this.findInfo.email.trim()) {
        alert("사원번호와 이메일을 모두 입력해 주세요.");
        return;
      }
      this.isLoading = true;
      try {
        const result = await axios.post(`/api/find-password`, this.findInfo);
        const findPwdRes = result.data;

        if (findPwdRes.result) {
          alert("임시 비밀번호가 이메일로 발송되었습니다.\n임시 비밀번호로 로그인하여 새 비밀번호를 설정해주세요.");
          this.$router.push({ 
            name: "resetPwd",
            params: { empNo: this.findInfo.empNo }
          });
        } else {
          alert(findPwdRes.message || "사원 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("비밀번호 찾기 오류:", err);
        alert("서버 오류가 발생했습니다.");
      } finally {
        this.isLoading = false;
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