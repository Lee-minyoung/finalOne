<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autocomplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4"> Login </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>


<!-- 
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
</style>  -->