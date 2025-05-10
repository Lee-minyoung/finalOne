<template>
  <div class="container-fluid mt-4">
    <!-- 날짜 조회 -->
    <div class="bg-light p-3 border mb-3">
      <label class="form-label fw-bold me-2">일자 조회</label>
      <input type="date" class="form-control d-inline w-auto" v-model="queryDate" />
    </div>

    <div class="row">
      <!-- 테이블 영역 -->
      <div class="col-md-8">
        <ul class="nav nav-tabs mb-2">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab">입고대기</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab">입고완료</button>
          </li>
        </ul>

        <div class="table-responsive border">
          <table class="table table-bordered table-sm text-center mb-0">
            <thead class="table-light">
              <tr>
                <th>검사일자</th>
                <th>지시번호</th>
                <th>제품 ID</th>
                <th>제품명</th>
                <th>합격수량</th>
                <th>작업자</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.date }}</td>
                <td>{{ item.instruction }}</td>
                <td>{{ item.productId }}</td>
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.worker }}</td>
              </tr>
              <tr v-if="items.length === 0">
                <td colspan="6" class="text-muted">데이터가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 입력 폼 영역 -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="mb-2">
              <label class="form-label">일자</label>
              <input type="date" class="form-control" v-model="form.date" />
            </div>

            <div class="mb-2">
              <label class="form-label">지시번호</label>
              <select class="form-select" v-model="form.instruction">
                <option disabled value="">선택</option>
                <option v-for="code in instructionList" :key="code" :value="code">
                  {{ code }}
                </option>
              </select>
            </div>

            <div class="mb-2">
              <label class="form-label">제품 ID</label>
              <input type="text" class="form-control" v-model="form.productId" />
            </div>

            <div class="mb-2">
              <label class="form-label">제품명</label>
              <input type="text" class="form-control" v-model="form.productName" />
            </div>

            <div class="mb-2">
              <label class="form-label">합격수량</label>
              <input type="number" class="form-control" v-model="form.quantity" />
            </div>

            <div class="mb-3">
              <label class="form-label">작업자</label>
              <input type="text" class="form-control" v-model="form.worker" />
            </div>

            <button class="btn btn-primary w-100" @click="registerItem">신규 입고</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      queryDate: '',
      instructionList: ['JSH-001', 'JSH-002'], // 예시
      items: [],
      form: {
        date: '',
        instruction: '',
        productId: '',
        productName: '',
        quantity: '',
        worker: ''
      }
    }
  },
  methods: {
    registerItem() {
      if (
        this.form.date &&
        this.form.instruction &&
        this.form.productId &&
        this.form.productName &&
        this.form.quantity &&
        this.form.worker
      ) {
        this.items.push({ ...this.form })
        Object.keys(this.form).forEach(key => (this.form[key] = '')) // 폼 초기화
      } else {
        alert('모든 항목을 입력해주세요.')
      }
    }
  }
}
</script>
