<template>
    <div class="container mt-5">
      <h3>자재요청 페이지</h3>
      <p><strong>자재ID:</strong> {{ matId }}</p>
      <p><strong>자재명:</strong> {{ matNm }}</p>
      <!-- 여기에 필요한 추가 UI나 요청 입력 폼 붙이면 됨 -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'MaterialRequestPage',
    computed: {
      matId() {
        return this.$route.query.matId;
      },
      matNm() {
        return this.$route.query.matNm;
      }
    }
  }
  </script>
  