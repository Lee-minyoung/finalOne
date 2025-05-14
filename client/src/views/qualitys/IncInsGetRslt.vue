<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">입고검사성적서 조회</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      자재검색 <input v-model="searchQuery" class="form-control" placeholder="" readonly />
      <button class="btn btn-outline-secondary" @click="openMatModal" style="margin-right:501px;">🔍</button>
      성적서번호 <input :value="selectedRsltNo" class="form-control" readonly style="background-color: #eee;" />
      <hr style="margin-left:-75px;">
      LOTNo <input :value="selectedLotNo" class="form-control" readonly
        style="background-color: #eee; margin-right: 180px;" />
      발주번호 <input v-model="searchPurOrdNo" class="form-control" readonly
        style="background-color: #eee; margin-right: 180px;" />
      납입업체 <input v-model="selectedVdrNm" class="form-control" readonly style="background-color: #eee;" />
      <br>
      자재명 <input :value="selectedMatNm" class="form-control" readonly
        style="background-color: #eee; margin-right: 180px;" />
      작성일자 <input :value="selectedInsDate" class="form-control" readonly
        style="background-color: #eee; margin-right: 197px;" />
      검사자 <input :value="selectedInsDev" class="form-control" readonly style="background-color: #eee;" />
    </div>
    <br>
    <div class="middle">
      <!-- 결점구분 -->
      <div>
        <table class="table table-bordered text-center" id="table">
          <thead class="table-light">
            <tr>
              <th>결점구분</th>
              <th>검사량</th>
              <th>합격량</th>
              <th>불량량</th>
            </tr>
          </thead>

          <!-- 수량 입력칸 -->
          <tbody>
            <tr>
              <td>수량</td>
              <td>{{ rsltMaster?.mgr_count }}</td>
              <td>{{ rsltMaster?.succ_count }}</td>
              <td>{{ rsltMaster?.dft_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 종합판정 -->
      <div class="rst">
        <div class="hstack gap-3">
          <div style="padding-left:50px;">종합판정</div>
          <div class="vr"></div>
          <button :class="['jdg-btn', rsltMaster?.ovr_jdg === 'n1' ? 'btn-green' : '']"
            style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;">합격</button>
          <button :class="['jdg-btn', rsltMaster?.ovr_jdg === 'n2' ? 'btn-red' : '']"
            style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;">불합격</button>
        </div>
      </div>
    </div>
    <h5>검사결과</h5>
    <!-- 테이블 -->
    <!-- 테이블 헤더 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>검사결과</th>
          <th>판정</th>
          <th>비고</th>
        </tr>
      </thead>

      <!-- 테이블 바디 : 검사결과  -->
      <tbody>
        <tr v-for="(item, index) in rsltDetailList" :key="index">
          <td>{{ item.ins_itm }}</td>
          <td>{{ item.ins_mthd }}</td>
          <td>{{ item.mgr_rslt }}</td>
          <td>{{ getJdgName(item.jdg) }}</td>
          <td>{{ item.rmk }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 제품 검색 모달 -->
  <MatGetRsltSelModal v-if="showMatModal" :matList="prodList" @select-lot="handleSelectedProduct"
    @close="showMatModal = false" />
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import MatGetRsltSelModal
  from '@/views/qualitys/MatGetRsltSelModal.vue'; // 모달

import { ref, onBeforeMount } from 'vue';

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false);

export default {
  components: { MatGetRsltSelModal },
  data() {
    return {
      searchQuery: '',             // 제품검색
      selectedLineId: '',          // 라인번호
      selectedProductName: '',     // 제품명
      selectedInsDate: this.getToday(),     // 날짜
      newItemList: [],
      spmInsStdList: [],
      prodList: [],
      rsltMaster: null,
      rsltDetailList: [],
      showMatModal: false,
      newItem: [],
      overallJdg: '',
      selectedRsltNo: '', // 성적서 번호
    };
  },
  created() {
    this.selectedInsDev = localStorage.getItem('username') || ''; // 검사자(로그인 사용자)
  },
  computed: {
    filteredLots() {
      if (!this.matList) return [];
      return this.matList.filter(m => m.mat_nm?.includes(this.search));
    }
  },
  methods: {
    // 공통코드 변환
    getJdgName(code) {
      if (code === 'o1') return '적합';
      if (code === 'o2') return '부적합';
      return code || '';
    },

    getToday() {
      const today = new Date();
      // YYYY-MM-DD 형식
      return today.toISOString().slice(0, 10);
    },
    // 날짜 포맷
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    async fetchRsltDetail(prd_no, ln_opr_no) {
      const res = await axios.get('/api/spmInsGetRslt/detail', { params: { prd_no, ln_opr_no } });
      this.rsltMaster = res.data.master; // rslt_no, mgr_count, succ_count, dft_count, ovr_jdg
      this.rsltDetailList = res.data.detail; // [{ ins_itm, ins_mthd, mgr_rslt, jdg, rmk }, ...]
      this.selectedRsltNo = this.rsltMaster?.rslt_no || '';
      console.log(this.rsltDetailList)
    },

    // 모달
    showModal() {
      this.showMatModal = true; // 모달 열기
    },
    hideModal() {
      this.showMatModal = false; // 모달 닫기
    },
    openMatModal() {
      axios.get('/api/incInsGetRslt/rsltPrd', { params: { lot_no: this.selectedLotNo } })
        .then(res => {
          this.prodList = Array.isArray(res.data) ? res.data : [];
          this.showMatModal = true;
        })
        .catch(err => {
          this.prodList = [];
          alert('리스트 불러오기 실패');
        });
    },

    // 제품 선택 시
    async handleSelectedProduct(item) {
      this.selectedLineId = item.ln_opr_no;
      this.selectedProductName = item.prd_nm;
      this.searchQuery = item.prd_no;
      this.selectedInsDate = this.getToday();
      this.showMatModal = false;

      // 성적서 상세정보 불러오기
      await this.fetchRsltDetail(item.prd_no, item.ln_opr_no);
    },
    // 기준서 목록 가져오기
    async getSpmInsStdList(prd_no) {
      try {
        const res = await axios.get('/api/incInsGetRslt/rsltPrdDtl', { params: { lot_no: item.lot_no } });
        if (res.data && res.data.length > 0) {
          const info = res.data[0];
          this.selectedLotNo = info.lot_no || '';
          this.selectedMatNo = info.mat_no || '';
          this.selectedMatNm = info.mat_nm || '';
          this.searchPurOrdNo = info.pur_ord_no || '';
          this.selectedVdrNm = info.cpy_nm || '';
        }
      } catch (err) {
        alert('LOT 상세정보 조회 실패');
      }
      this.showMatModal = false;

      // 성적서 상세정보 불러오기 등 기존 코드...
      await this.fetchRsltDetail(item.prd_no, item.ln_opr_no);
    }
  }
};


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
  width: 650px;
  height: 130px;
  margin-right: 20px;
}

.rslInput {
  width: 100px;
}

.middle {
  display: flex;
}

.rst {
  width: 650px;
  height: 130px;
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