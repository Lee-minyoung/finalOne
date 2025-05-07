<template>
  <div class="container d-flex min-vh-100 align-items-center">
    <div class="row justify-content-center w-100">
      <div class="col-md-8">
        <div class="row g-0">
          <div class="col-md-8">
            <div class="card p-4">
              <div class="card-body">
                <h1 class="card-title">Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <form>
                  <div class="input-group mb-3">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input type="text" class="form-control" placeholder="Username" autocomplete="username" />
                  </div>
                  <div class="input-group mb-4">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input type="password" class="form-control" placeholder="Password" autocomplete="current-password" />
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <button class="btn btn-primary px-4" type="submit">Login</button>
                    </div>
                    <div class="col-6 text-end">
                      <a href="#" class="btn btn-link px-0">Forgot password?</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-4 bg-primary text-white d-flex flex-column justify-content-center p-4">
            <div class="text-center">
              <h2>Sign up</h2>
              <p class="small">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.
              </p>
              <button class="btn btn-outline-light mt-3">Register Now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Bootstrap Icons를 사용하려면 index.html 또는 main.js에 link 추가 필요
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
</style> 