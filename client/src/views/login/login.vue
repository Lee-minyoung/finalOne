<template>
  <!-- 전체 화면을 수직 및 수평으로 중앙 정렬 -->
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="container">
      <!-- 중앙 정렬된 행 -->
      <div class="row justify-content-center">
        <!-- 화면 너비의 5칸을 차지하는 열 -->
        <div class="col-md-5">
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-body p-5">
              <form>
                <!-- 로그인 제목 -->
                <h1 class="text-center">밥먹고하시조</h1>
                <!-- 부제목 -->
                <p class="text-muted text-center">Sign In to your account</p>

                <!-- 사용자명 입력 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control form-control-lg bg-light small-placeholder" 
                      v-model="loginInfo.emp_no" 
                      placeholder="사원번호"
                      autocomplete="emp_no" 
                    />
                  </div>
                </div>

                <!-- 비밀번호 입력 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      class="form-control form-control-lg bg-light small-placeholder" 
                      v-model="loginInfo.pwd" 
                      placeholder="비밀번호"
                      autocomplete="current-password" 
                    />
                  </div>
                </div>

                <!-- 비밀번호 찾기 링크 -->
                <div class="mb-3 text-end">
                  <button type="button" class="btn btn-link text-decoration-none px-0 small-text" @click="$router.push({ name: 'findPwd' })">
                    비밀번호 찾기
                  </button>
                </div>

                <!-- 로그인 버튼 -->
                <div class="mb-0">
                  <button type="button" class="btn btn-primary w-100 py-2 small-text" @click="userLogin">
                    로그인
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

export default {
  data() {
    return {
      loginInfo: {
        emp_no: "",
        pwd: "",
      },
    };
  },
  methods: {
    ...mapActions(useEmpStore, ["setLoginInfo"]),
    async userLogin() {
      try {
        const result = await axios.post(`/api/login`, this.loginInfo);
        console.log(result);

        const loginRes = result.data;
        console.log(loginRes);

        if (loginRes.result) {
          this.setLoginInfo({
            emp_no: loginRes.emp_no,
            nm: loginRes.nm,
            pst_nm: loginRes.pst_nm,
            pst_no: loginRes.pst_no,
            dept_no: loginRes.dept_no,
          });
          alert("환영합니다!");
          this.$router.push({ name: "Home" });
        } else {
          alert(loginRes.message || "로그인에 실패했습니다.");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("서버 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
/* 입력 필드 포커스 시 스타일 */
.form-control:focus {
  border-color: #0D6EFD;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

/* placeholder 텍스트 */
.small-placeholder::placeholder {
  font-size: 1.125rem;
}

/* 로그인 버튼 텍스트 */
.small-text {
  font-size: 1.125rem;
}

/* 비밀번호 찾기 링크 스타일 */
.btn-link {
  color: #0D6EFD;
  font-size: 0.875rem;
}
.btn-link:hover {
  color: #0a58ca;
}

/* 카드 스타일 */
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
</style>