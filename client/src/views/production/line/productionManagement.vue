  <template>
    <div class="container mt-4">
      <h2>생산지시현황</h2>
  

      <!-- 생산지시현황 테이블 -->
      <table class="table table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>라인번호</th>
            <th>지시ID</th>
            <th>생산품목</th>
            <th>생산수량</th>
            <th>지시일자</th>
            <th>계획종료일</th>
            <th>지시자</th>
            <th>진행상황</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <td colspan="8" class="text-muted">-</td>
          </tr>
        </tbody>
      </table>
  
      <!-- 페이징 -->
      <nav class="d-flex justify-content-center mt-3">
        <ul class="pagination">
          <li class="page-item disabled"><a class="page-link">이전</a></li>
          <li class="page-item active"><a class="page-link">1</a></li>
          <li class="page-item disabled"><a class="page-link">다음</a></li>
        </ul>
      </nav>
  
  
      <div class="mt-5 p-4 border rounded bg-white">
        <h5>라인관리</h5>
        <ul class="nav nav-tabs mt-3" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#prod" role="tab">생산지시</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#line" role="tab">라인관리</a>
          </li>
        </ul>
  
        <div class="tab-content p-3 border border-top-0">
          <div class="tab-pane fade show active" id="prod" role="tabpanel">
            <ProductionInstruction />
          </div>
          <div class="tab-pane fade" id="line" role="tabpanel">
            <LineManagement />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ProductionInstruction from '@/views/production/line/ProductionInstruction.vue'
  import LineManagement from '@/views/production/line/LineManagement.vue'
  
  export default {
    components: {
      ProductionInstruction,
      LineManagement
    }
  }
  </script>