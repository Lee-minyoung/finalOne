<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="login-card">
            <div class="card-body px-4 py-5">
              <form @submit.prevent="userLogin">
                <div class="text-center mb-4">
                  <img src="@/assets/icons/login_bobe.png" alt="밥먹고하시조" class="login-logo" />
                  <p class="welcome-text">오늘도 당신 덕분에 따뜻한 밥이 완성됩니다!</p>
                </div>

                <div class="form-section">
                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-person"></i>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="loginInfo.emp_no" 
                        placeholder="사원번호를 입력하세요"
                        :disabled="isLoading"
                        @focus="clearError('emp_no')"
                      />
                    </div>
                    <div class="invalid-feedback" v-if="errors.emp_no">{{ errors.emp_no }}</div>
                  </div>

                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        class="form-control" 
                        v-model="loginInfo.pwd" 
                        placeholder="비밀번호를 입력하세요"
                        @keyup.enter="userLogin" 
                        :disabled="isLoading"
                        @focus="clearError('pwd')"
                      />
                    </div>
                    <div class="invalid-feedback" v-if="errors.pwd" v-html="errors.pwd"></div>
                  </div>

                  <div class="text-end mb-3">
                    <button 
                      type="button" 
                      class="btn-forgot" 
                      @click="$router.push({ name: 'find2pwd' })"
                      :disabled="isLoading"
                    >
                      <i class="bi bi-question-circle me-1"></i>
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    class="btn-login" 
                    :disabled="isLoading || !isValidForm"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? '로그인 중...' : '로그인' }}
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
import { useEmpStore } from "../../stores/empStore";
import { mapActions } from "pinia";
import 'bootstrap-icons/font/bootstrap-icons.css';  // Bootstrap Icons 추가

export default {
  data() {
    return {
      loginInfo: {
        emp_no: "",
        pwd: "",
      },
      isLoading: false,
      errors: {
        emp_no: '',
        pwd: ''
      }
    };
  },
  computed: {
    isValidForm() {
      return this.loginInfo.emp_no?.trim() && this.loginInfo.pwd?.trim();
    }
  },
  methods: {
    ...mapActions(useEmpStore, ["setLoginInfo"]),

    clearError(field) {
      this.errors[field] = '';
    },

    validateForm() {
      let isValid = true;
      this.errors = {
        emp_no: '',
        pwd: ''
      };

      if (!this.loginInfo.emp_no?.trim()) {
        this.errors.emp_no = '사원번호를 입력해주세요';
        isValid = false;
      }

      if (!this.loginInfo.pwd?.trim()) {
        this.errors.pwd = '비밀번호를 입력해주세요';
        isValid = false;
      }

      return isValid;
    },

    async userLogin() {
      // 폼 검증
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        console.log("로그인 시도:", this.loginInfo); // 디버깅용 로그 추가
        const result = await axios.post(`/api/login`, this.loginInfo);
        console.log("로그인 응답:", result.data); // 디버깅용 로그 추가

        if (result.data.result) {
          this.setLoginInfo({
            emp_no: result.data.emp_no,
            nm: result.data.nm,
            pst_nm: result.data.pst_nm,
            pst_no: result.data.pst_no,
            dept_no: result.data.dept_no,
            dept_nm: result.data.dept_nm,
          });

          alert("로그인 성공!");
          this.$router.push({ name: "Home" });
        } else {
          this.errors.pwd = "입력하신 사원번호 또는 비밀번호가 일치하지 않습니다.<br/>다시 한 번 확인해 주세요.";
        }
      } catch (err) {
        console.error("Login error:", err);
        if (err.response) {
          this.errors.pwd = err.response.data.message || "입력하신 사원번호 또는 비밀번호가 일치하지 않습니다.<br/>다시 한 번 확인해 주세요.";
        } else {
          this.errors.pwd = "서버와 통신할 수 없습니다.";
        }
      } finally {
        this.isLoading = false;
      }
    },
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
  color: #495057;
  font-size: 0.97rem;
  margin-bottom: 2.2rem;
  font-weight: 500;
  line-height: 1.6;
}

.form-section {
  max-width: 360px;
  margin: 0 auto;
  width: 100%;
}

.input-wrapper {
  margin-bottom: 1.2rem;
}

.form-label {
  color: #495057;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
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

    i {
      font-size: 1.1rem;
    }
  }

  &:focus-within .input-group-text {
    color: #0d6efd;
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

  .login-logo {
    width: 180px;
  }

  .card-body {
    padding: 2rem !important;
  }

  .form-section {
    max-width: 100%;
  }
}
</style>
