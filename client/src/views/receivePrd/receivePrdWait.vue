<template>
  <div class="col-md-12">
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
            <th>신규 입고</th>
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
            <td>
              <button class="btn btn-primary btn-sm" @click="registerItem(item)">신규 입고</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td colspan="7" class="text-muted">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script scoped>
import axios from 'axios';

export default {

  data() {
    return {
      instructionList: ['JSH-001', 'JSH-002'], // 예시
      items: [],
      form: {
        date: '',
        instruction: '',
        productId: '',
        productName: '',
        quantity: '',
        worker: ''
      },
    }
  },
  methods: {
    registerItem(item) {
      if (item) {
        alert(`${item.productName} 신규 입고 처리!`);
      } else if (
        this.form.date &&
        this.form.instruction &&
        this.form.productId &&
        this.form.productName &&
        this.form.quantity &&
        this.form.worker
      ) {
        this.items.push({ ...this.form });
        Object.keys(this.form).forEach(key => (this.form[key] = ''));
      } else {
        alert('모든 항목을 입력해주세요.');
      }
    }
  }
}
</script>