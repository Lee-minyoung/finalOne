<template>
  <!-- 전체 화면을 수직 및 수평으로 중앙 정렬 -->
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <!-- 중앙 정렬된 행 -->
      <CRow class="justify-content-center">
        <!-- 화면 너비의 8칸을 차지하는 열 -->
        <CCol :md="8">
          <CCardGroup>
            <!-- 로그인 카드 -->
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <!-- 로그인 제목 -->
                  <h1>Login 밥먹고하시조</h1>
                  <!-- 부제목 -->
                  <p class="text-body-secondary">Sign In to your account</p>
                  <!-- 사용자명 입력 필드 -->
                  <CInputGroup class="mb-3">
                    <!-- 사용자 아이콘 -->
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <!-- 사용자명 입력 -->
                    <CFormInput
                      v-model="loginInfo.emp_no"
                      placeholder="사원번호를 입력하세요"
                      autocomplete="emp_no"
                    />
                  </CInputGroup>
                  <!-- 비밀번호 입력 필드 -->
                  <CInputGroup class="mb-4">
                    <!-- 비밀번호 아이콘 -->
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <!-- 비밀번호 입력 -->
                    <CFormInput
                      v-model="loginInfo.pwd"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <!-- 버튼 그룹 -->
                  <CRow>
                    <!-- 로그인 버튼 -->
                    <CCol :xs="6">
                      <CButton
                        color="primary"
                        class="px-4"
                        @click="userLogin"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <!-- 비밀번호 찾기 버튼 -->
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
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
          alert("사랑합니다!.");
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