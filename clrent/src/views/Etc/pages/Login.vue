<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow" style="width: 400px;">
      <div class="card-body">
        <form @submit.prevent="handleLogin">
          <h1 class="text-center mb-4">Login</h1>
          <div class="input-group mb-3">
            <span class="input-group-text">
              <i class="bi bi-person"></i>
            </span>
            <input
              v-model="loginInfo.username"
              type="text"
              class="form-control"
              placeholder="Username"
              autocomplete="username"
            />
          </div>
          <div class="input-group mb-4">
            <span class="input-group-text">
              <i class="bi bi-lock"></i>
            </span>
            <input
              v-model="loginInfo.password"
              type="password"
              class="form-control"
              placeholder="Password"
              autocomplete="current-password"
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">
              Login
            </button>
            <button type="button" class="btn btn-link text-center">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    async handleLogin() {
      try {
        const response = await axios.get("http://localhost:3000/login", this.loginInfo);
        alert(`환영합니다! ${response.data.user.name}`);
        // 로그인 성공 시 페이지 이동
        this.$router.push({ name: "dashboard" });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    },
  },
};
</script>