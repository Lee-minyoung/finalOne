<template>
  <!-- 로그인 화면을 만드는 부분 -->
  <!-- 전체 화면을 수직 및 수평으로 중앙 정렬 -->
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="container">
      <!-- 중앙 정렬된 행 -->
      <div class="row justify-content-center">
        <!-- 화면 너비의 5칸을 차지하는 열 -->
        <div class="col-md-5">
          <!-- 카드 컴포넌트 -->
          <!-- 로그인 폼을 감싸는 카드 -->
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-body p-5">
              <form>
                <!-- 로그인 제목 -->
                <h1 class="text-center">밥먹고하시조</h1>
                <!-- 부제목 -->
                <p class="text-muted text-center">오늘도 당신 덕분에 따뜻한 밥이 완성됩니다!</p>

                <!-- 사원번호 입력하는 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input type="text" class="form-control form-control-lg bg-light small-placeholder"
                      v-model="loginInfo.emp_no" placeholder="사원번호" autocomplete="emp_no" />
                  </div>
                </div>

                <!-- 비밀번호 입력 필드 -->
                <div class="mb-3">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input type="password" class="form-control form-control-lg bg-light small-placeholder"
                      v-model="loginInfo.pwd" placeholder="비밀번호" autocomplete="current-password"
                      @keyup.enter="userLogin" />
                  </div>
                </div>

                <!-- 비밀번호 찾기 링크 -->
                <div class="mb-3 text-end">
                  <button type="button" class="btn btn-link text-decoration-none px-0 small-text"
                    @click="$router.push({ name: 'findPwd' })">
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
// 로그인 화면을 담당
// 1. 사용자가 사원번호(emp_no)와 비밀번호(pwd)를 입력
// 2. 로그인 버튼 클릭 시 userLogin 메서드가 실행되어 서버에 로그인 요청
// 3. 로그인 성공 시 사용자 정보를 Pinia 스토어(stores/empStore)에 저장하고, 메인 화면으로 이동
// 4. 실패 시 알림창으로 오류 메시지 표시
// 5. 비밀번호 찾기 버튼 클릭 시 비밀번호 찾기 화면으로 이동

import axios from "axios";
import { useEmpStore } from "../../stores/empStore";
import { mapActions } from "pinia";

export default {
  data() {
    return {
      loginInfo: {
        emp_no: "", // 사원번호 저장할 곳
        pwd: "",    // 비밀번호 저장할 곳
      },
    };
  },
  methods: {
    ...mapActions(useEmpStore, ["setLoginInfo"]),
    async userLogin() {
      try {
        // 1. 서버에 로그인 정보를 POST로 전송
        // 2. 서버에서 로그인 성공 여부를 응답
        const result = await axios.post(`/api/login`, this.loginInfo);
        console.log(result);

        const loginRes = result.data;
        console.log(loginRes);

        // 로그인이 성공했다면
        if (loginRes.result) {

          // 3. 로그인한 사용자 정보를 Pinia 스토어(stores/empStore)에 저장
          this.setLoginInfo({
            emp_no: loginRes.emp_no,
            nm: loginRes.nm,
            pst_nm: loginRes.pst_nm,
            pst_no: loginRes.pst_no,
            dept_no: loginRes.dept_no,
          });
          alert("사랑합니다!");
          // 4. 메인(Home) 화면으로 이동
          this.$router.push({ name: "Home" });
        } else {
          // 로그인 실패 시 알림 창
          alert(loginRes.message || "사원번호 혹은 비밀번호가 일치하지 않습니다. \n입력한 내용을 다시 확인해 주세요.");
        }
      } catch (err) {
        // 오류가 발생했을 때
        console.error("Login error:", err);
        alert("서버 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
/* 입력 필드 포커스 시 스타일 */
/* 입력칸을 클릭했을 때 파란색 테두리 효과 */
.form-control:focus {
  border-color: #0D6EFD;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

/* placeholder 텍스트 */
/* 입력칸에 아무것도 입력하지 않았을 때 보이는 글자 스타일 */
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