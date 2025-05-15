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
                        <i class="bi bi-person-fill"></i>
                      </span>
                      <input type="text" class="form-control" v-model="loginInfo.emp_no" placeholder="사원번호"
                        :disabled="isLoading" />
                    </div>
                    <div class="invalid-feedback" v-if="errors.emp_no">{{ errors.emp_no }}</div>
                  </div>

                  <div class="input-wrapper">
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-lock-fill"></i>
                      </span>
                      <input type="password" class="form-control" v-model="loginInfo.pwd" placeholder="비밀번호"
                        @keyup.enter="userLogin" :disabled="isLoading" />
                    </div>
                    <div class="invalid-feedback" v-if="errors.pwd">{{ errors.pwd }}</div>
                  </div>

                  <div class="text-end mb-3">
                    <button type="button" class="btn-forgot" @click="$router.push({ name: 'find2pwd' })"
                      :disabled="isLoading">
                      비밀번호 찾기
                    </button>
                  </div>

                  <button type="submit" class="btn-login" :disabled="isLoading">
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
  methods: {
    ...mapActions(useEmpStore, ["setLoginInfo"]),

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
        const result = await axios.post(`/api/login`, this.loginInfo);
        const loginRes = result.data;

        if (loginRes.result) {
          this.setLoginInfo({
            emp_no: loginRes.emp_no,
            nm: loginRes.nm,
            pst_nm: loginRes.pst_nm,
            pst_no: loginRes.pst_no,
            dept_no: loginRes.dept_no,
          });

          alert("사랑합니다!");
          this.$router.push({ name: "Home" });
        } else {
          this.errors.pwd = loginRes.message || "사원번호 혹은 비밀번호가 일치하지 않습니다.";
        }
      } catch (err) {
        console.error("Login error:", err);

        if (err.response) {
          switch (err.response.status) {
            case 401:
              this.errors.pwd = "사원번호 혹은 비밀번호가 일치하지 않습니다.";
              break;
            case 429:
              this.errors.pwd = "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
              break;
            case 500:
              alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
              break;
            default:
              alert("로그인 중 오류가 발생했습니다.");
          }
        } else if (err.request) {
          alert("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
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
