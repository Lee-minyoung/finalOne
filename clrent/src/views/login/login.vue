<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow" style="width: 400px;">
      <div class="card-body">
        <h1 class="text-center mb-4">Login</h1>
        <p class="text-muted text-center">Sign In to your account</p>
        <form>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person"></i>
              </span>
              <input
                type="text"
                id="username"
                class="form-control"
                placeholder="Username"
                autocomplete="username"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                class="form-control"
                placeholder="Password"
                autocomplete="current-password"
              />
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-primary px-4">Login</button>
            <button type="button" class="btn btn-link">Forgot password?</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
};
</script>

<style>
/* Optional: Add custom styles if needed */
</style>



<!-- 
<template>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="emp_no">사원번호:</label>
        <input type="text" class="form-control" id="emp_no" v-model="loginInfo.emp_no" />
      </div>
      <div class="form-group">
        <label for="pwd">비밀번호:</label>
        <input type="password" class="form-control" id="pwd" v-model="loginInfo.pwd" />
      </div>
      <button type="button" class="btn btn-info" v-on:click="userLogin">로그인</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "../../stores/index";
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
    ...mapActions(useUserStore, ["addLoginInfo"]),
    async userLogin() {
      try {
        // 입력값 검증
        if (!this.loginInfo.emp_no || !this.loginInfo.pwd) {
          alert("사원번호와 비밀번호를 입력하세요.");
          return;
        }

        console.log("Sending login data:", this.loginInfo); // 디버깅용 로그
        const result = await axios.post(`/api/login`, this.loginInfo);
        const loginRes = result.data;

        if (loginRes.result) {
          this.addLoginInfo({
            emp_no: loginRes.emp_no,
            nm: loginRes.nm,
          });
          this.$router.push({ name: "Home" });
        } else {
          alert(loginRes.message);
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("서버 오류가 발생했습니다.");
      }
    },
  },
};
</script> -->