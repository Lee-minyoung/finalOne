<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">출고조회</h2>
      </div>
    </div>
  </div>
  <div class="input">
      주문번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openOrdModal" style="margin-right:505px;">🔍</button>
    <hr style="margin-left:-75px;">
      제품번호 <input :value="selectedLineId" class="form-control" id="input" readonly style="background-color: #eee; margin-right:60px;" />
      제품명 <input :value="selectedProductName" class="form-control" id="input" readonly style="background-color: #eee; margin-right:60px;" />
      납품업체 <input :value="selectedInsDate" class="form-control" id="input" readonly style="background-color: #eee; margin-right:60px;" />
      수량 <input :value="selectedInsDev" class="form-control" id="input" readonly style="background-color: #eee;" />
    </div>
    <br>
  <table class="table table-bordered text-center" style="margin-top:5px;">
      <thead class="table-light">
        <tr>
          <th>주문번호</th>
          <th>납품처</th>
          <th>제품번호</th>
          <th>제품명</th>
          <th>수량</th>
          <th>출하일자</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="item in spmRcdList" :key="item.spm_no" @click="fetchDetail(item)">
          <td>{{ item.spm_no }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item.prd_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ formatDateTime(item.spm_dt) }}</td>
        </tr>
        <tr v-if="spmRcdList.length === 0">
          <td colspan="5">데이터가 없습니다.</td>
        </tr> -->
      </tbody>
    </table>
    <OrdSelModal v-if="showOrdModal" :ordList="ordList" @select-mat="handleSelectedOrd" @close="showOrdModal = false" />
</template>

<script>
import axios from 'axios';
import OrdSelModal from '@/views/spm/OrdSelModal.vue';

export default {
    components: { OrdSelModal },
  data() {
    return {
        showOrdModal: false
    };
   },
 methods: {
    // 모달
    openOrdModal() {
      axios.get('/api/spmFns/ordList')
        .then(res => {
          this.ordList = Array.isArray(res.data) ? res.data : [];
          this.showOrdModal = true;
        })
        .catch(err => {
          console.error('자재 목록 불러오기 실패', err);
          this.ordList = [];
        });
    },
    // 자재 선택 시
    handleSelectedOrd(item) {
      this.searchQuery = item.lot_no;
      this.selectedMatNo = item.mat_no;
      this.selectedMatNm = item.mat_nm;
      this.showOrdModal = false;
      this.getIncInsStdList(item.mat_no);
    },
}  
}

</script>

<style>
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 100px;
}

.form-control {
  display: inline-block;
  width: 150px;
}

#input {
  margin-right: 52px;

}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
}

#table {
  width:650px;
  height:130px;
  margin-right:20px;
}
.rslInput{
  width:100px;
}
.middle {
  display: flex;
}
.rst{
  width:650px;
  height:130px;
  border: 1px solid lightgray;
  padding: 10px;
}
.jdg-btn.btn-green {
  background-color: #4caf50 !important;
  color: #fff !important;
}
.jdg-btn.btn-red {
  background-color: #e53935 !important;
  color: #fff !important;
}
</style>