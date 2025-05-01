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
                <!-- 비밀번호 찾기 제목 -->
                <h1 class="text-center">밥먹고하시조</h1>
                <!-- 부제목 -->
                <p class="text-muted text-center">비밀번호 찾기</p>

                <!-- 사원번호 입력 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control form-control-lg bg-light small-placeholder" 
                      v-model="findInfo.emp_no" 
                      placeholder="사원번호"
                      autocomplete="emp_no" 
                    />
                  </div>
                </div>

                <!-- 이름 입력 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person-badge"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control form-control-lg bg-light small-placeholder" 
                      v-model="findInfo.nm" 
                      placeholder="이름"
                      autocomplete="name" 
                    />
                  </div>
                </div>

                <!-- 로그인으로 돌아가기 링크 -->
                <div class="mb-3 text-end">
                  <button type="button" class="btn btn-link text-decoration-none px-0 small-text" @click="goToLogin">
                    로그인으로 돌아가기
                  </button>
                </div>

                <!-- 비밀번호 찾기 버튼 -->
                <div class="mb-0">
                  <button type="button" class="btn btn-primary w-100 py-2 small-text" @click="findPwd">
                    비밀번호 찾기
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
        emp_no: "",
        nm: "",
      },
    };
  },
  methods: {
    async findPwd() {
      try {
        const result = await axios.post(`/api/findPwd`, this.findInfo);
        console.log(result);

        const findPwdRes = result.data;
        console.log(findPwdRes);

        if (findPwdRes.result) {
          alert(findPwdRes.message || "임시 비밀번호가 발급되었습니다.");
          this.$router.push({ name: "login" });
        } else {
          alert(findPwdRes.message || "사원 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("비밀번호 찾기 오류:", err);
        alert("서버 오류가 발생했습니다.");
      }
    },
    goToLogin() {
      this.$router.push({ name: "login" });
    }
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

/* 버튼 텍스트 */
.small-text {
  font-size: 1.125rem;
}

/* 로그인으로 돌아가기 링크 스타일 */
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