<template>
  <!-- 전체 화면을 수직 및 수평으로 중앙 정렬 -->
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="container">
      <!-- 중앙 정렬된 행 -->
      <div class="row justify-content-center">
        <!-- 화면 너비의 8칸을 차지하는 열 -->
        <div class="col-md-8">
          <div class="card shadow p-4">
            <div class="card-body">
              <form>
                <!-- 로그인 제목 -->
                <h1 class="text-center">밥먹고하시조</h1>
                <!-- 부제목 -->
                <p class="text-muted text-center">Sign In to your account</p>
                <!-- 사용자명 입력 필드 -->
                <div class="input-group mb-3">
                  <!-- 사용자 아이콘 -->
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <!-- 사용자명 입력 -->
                  <input
                    type="text"
                    class="form-control"
                    v-model="loginInfo.emp_no"
                    placeholder="사원번호"
                    autocomplete="emp_no"
                  />
                </div>
                <!-- 비밀번호 입력 필드 -->
                <div class="input-group mb-4">
                  <!-- 비밀번호 아이콘 -->
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <!-- 비밀번호 입력 -->
                  <input
                    type="password"
                    class="form-control"
                    v-model="loginInfo.pwd"
                    placeholder="비밀번호"
                    autocomplete="current-password"
                  />
                </div>
                <!-- 버튼 그룹 -->
                <div class="row">
                  <!-- 로그인 버튼 -->
                  <div class="col-6">
                    <button
                      type="button"
                      class="btn btn-primary w-100"
                      @click="userLogin"
                    >
                      로그인
                    </button>
                  </div>
                  <!-- 비밀번호 찾기 버튼 -->
                  <div class="col-6 text-end">
                    <button type="button" class="btn btn-link px-0">
                      비밀번호 찾기
                    </button>
                  </div>
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
import axios from "axios"; // 서버와 통신하기 위한 Axios 라이브러리
import { useEmpStore } from "../../stores"; // Pinia 저장소 가져오기
import { mapActions } from "pinia"; // Pinia의 actions를 매핑하기 위한 헬퍼 함수

export default {
  data() {
    return {
      // 로그인 정보를 저장하는 객체
      loginInfo: {
        emp_no: "", // 사용자명 (사원번호)
        pwd: "", // 비밀번호
      },
    };
  },
  methods: {
    // Pinia 저장소의 actions를 가져옴
    ...mapActions(useEmpStore, ["addLoginId"]),
    async userLogin() {
      try {
        // 서버로 로그인 요청
        const result = await axios.post(`/api/login`, this.loginInfo);
        console.log(result); // 서버 응답 로그 출력

        const loginRes = result.data; // 서버 응답 데이터
        console.log(loginRes); // 응답 데이터 로그 출력

        if (loginRes.result) {
          // 로그인 성공 시 Pinia 저장소에 사용자 정보 저장
          this.addLoginId(loginRes.id);
          alert("사랑합니다!"); // 로그인 성공 메시지
          // 홈 페이지로 이동
          this.$router.push({ name: "Home" });
        } else {
          // 로그인 실패 시 메시지 표시
          alert(loginRes.message);
        }
      } catch (err) {
        // 서버 요청 중 오류 발생 시 처리
        console.error("Login error:", err);
        alert("서버 오류가 발생했습니다.");
      }
    },
  },
};
</script>