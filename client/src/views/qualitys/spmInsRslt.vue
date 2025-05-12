<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사성적서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
       제품검색 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openProductModal" style="margin-right:505px;">🔍</button>
      성적서번호 <input :value="selectedRsltNo" class="form-control" id="input" readonly style="background-color: #eee;" />
      <hr style="margin-left:-75px;">

      라인번호 <input :value="selectedLineId" class="form-control" id="input" readonly style="background-color: #eee;" />
      제품명 <input :value="selectedProductName" class="form-control" id="input" readonly style="background-color: #eee;" />
      작성일자 <input :value="selectedInsDate" class="form-control" id="input" readonly style="background-color: #eee;" />
      검사자 <input :value="selectedInsDev" class="form-control" id="input" readonly style="background-color: #eee;" />
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
              <td><input v-model="newItem.mgr_count" class="rslInput" placeholder="검사량" /></td>
              <td><input v-model="newItem.succ_count" class="rslInput" placeholder="합격량" /></td>
              <td><input v-model="newItem.dft_count" class="rslInput" placeholder="불량량" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 종합판정 -->
      <div class="rst">
  <div class="hstack gap-3">
    <div style="padding-left:50px;">종합판정</div>
    <div class="vr"></div>
    <button
      :class="['jdg-btn', overallJdg === '합격' ? 'btn-green' : '']"
      @click="overallJdg = '합격'"
      style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;"
    >합격</button>
    <button
      :class="['jdg-btn', overallJdg === '불합격' ? 'btn-red' : '']"
      @click="overallJdg = '불합격'"
      style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;"
    >불합격</button>
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
        <tr v-for="(item, index) in spmInsStdList" :key="item.spm_ins_std_no">
          <td>{{ item.ins_itm }}</td>
    <td>{{ item.ins_mthd }}</td>
    <td>
      <input v-model="newItemList[index].mgr_rslt" class="form-control" placeholder="검사결과" />
    </td>
    <td>
      {{ getJdg(item, newItemList[index].mgr_rslt) }}
    </td>
    <td>
      <input v-model="newItemList[index].rmk" class="form-control" placeholder="결점원인, 결점코드 등"/>
    </td>
        </tr>
      </tbody>
    </table>
    <div class="center-button">
  <button class="btn btn-primary" @click="spmInsStdInsert">성적서 반영</button>
</div>
  </div>

  <!-- 제품 검색 모달 -->
  <PrdSelModal v-if="showProductModal" :prodList="prodList" @select-product="handleSelectedProduct"
    @close="showProductModal = false" />
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import PrdSelModal from '@/views/qualitys/PrdRsltSelModal.vue'; // 모달

import { ref, onBeforeMount } from 'vue';

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false);

export default {
  components: { PrdSelModal },
  data() {
    return {
      searchQuery: '',             // 제품검색
      selectedLineId: '',          // 라인번호
      selectedProductName: '',     // 제품명
      selectedInsDate: this.getToday(),     // 날짜
      newItemList: [],
      spmInsStdList: [],
      prodList: [],
      showProductModal: false,
      newItem: [],
      overallJdg: '',
      selectedRsltNo: '', // 성적서 번호
    };
  },
  created() {
    this.selectedInsDev = localStorage.getItem('username') || ''; // 검사자(로그인 사용자)
  },
  methods: {
    // 등록
    async spmInsStdInsert() {
  if (!this.selectedRsltNo) {
    alert('성적서 번호가 없습니다.');
    return;
  }

  // 1. 성적서(마스터) 저장
  let obj = {
    rslt_no: this.selectedRsltNo,
    mgr_count: this.newItem.mgr_count,
    succ_count: this.newItem.succ_count,
    dft_count: this.newItem.dft_count,
    ovr_jdg: this.overallJdg,
    rmk: this.newItem.rmk || '',
    ln_opr_no: this.selectedLineId
  };

  try {
    let result = await axios.post("/api/spmInsRslt", obj);
    let addRes = result.data;

    if (addRes.isSuccessed) {
      // 2. 상세(행별) 저장
      const dtlList = this.spmInsStdList.map((item, idx) => ({
        spm_ins_rslt_dtl_no: null, // auto_increment면 null
        mgr_date: this.selectedInsDate, // 검사일자
        spm_ins_std_no: item.spm_ins_std_no,
        mgr_rslt: this.newItemList[idx].mgr_rslt, // ← 검사결과
        jdg: this.getJdg(item, this.newItemList[idx].mgr_rslt), // ← 판정
        dft_quy: null, // 필요시 입력
        rslt_no: this.selectedRsltNo,
        qrd_no: null, // 필요시 입력
        rmk: this.newItemList[idx].rmk // ← 비고
      }));
      await axios.post("/api/spmInsRslt/dtl", dtlList);

      alert('등록되었습니다.');
      // 필요시 화면 갱신
    } else {
      alert('모든 필드를 확인하세요.');
    }
  } catch (err) {
    alert('등록 중 오류가 발생했습니다.');
  }
},

    getJdg(item, mgr_rslt) {
       if (mgr_rslt === '' || mgr_rslt === null || mgr_rslt === undefined) return '';

  const std = Number(item.ins_mthd);
  const tol = Number(item.ins_spc);
  const result = Number(mgr_rslt);

  if (!isNaN(std) && !isNaN(tol) && !isNaN(result)) {
    const min = std - tol;
    const max = std + tol;
    return (result >= min && result <= max) ? '적합' : '부적합';
  }
  if (mgr_rslt === '1' || mgr_rslt === 1) return '적합';
  if (mgr_rslt === '0' || mgr_rslt === 0) return '부적합';

  return '';
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


    // 모달
    showModal() {
      this.showProductModal = true; // 모달 열기
    },
    hideModal() {
      this.showProductModal = false; // 모달 닫기
    },
    openProductModal() {
      axios.get('/api/spmInsRslt/prdList') // 제품 목록 가져오기
        .then(res => {
          console.log('제품목록:', res.data);
          this.prodList = Array.isArray(res.data) ? res.data : []; // 배열인지 확인 후 설정
          this.showProductModal = true; // 모달 열기
        })
      .catch(err => {
          console.error('제품 목록 불러오기 실패', err);
          this.prodList = []; // 실패 시 빈 배열로 설정
        });
    },

    // 제품 선택 시
    async handleSelectedProduct(item) { // ← async 추가!
  this.selectedLineId = item.ln_opr_no;
  this.selectedProductName = item.prd_nm;
  this.searchQuery = item.prd_no;  
  this.selectedInsDate = this.getToday(); // ← 제품 선택 시 오늘 날짜로 갱신

  this.showProductModal = false;
  // 성적서 번호 자동 할당
  try {
    const res = await axios.get('/api/spmInsRslt/lastRsltNo');
    const lastNo = res.data.lastNo || 0;
    const nextNo = String(Number(lastNo) + 1).padStart(3, '0');
    this.selectedRsltNo = `SJS-${nextNo}`;
  } catch (err) {
    this.selectedRsltNo = 'SJS-001'; // 실패 시 기본값
  }

  this.getSpmInsStdList(item.prd_no); // 검사 기준서 목록 가져오기
},
    // 기준서 목록 가져오기
    async getSpmInsStdList(prd_no) {
  try {
    const result = await axios.get('/api/spmInsStd', { params: { prd_no } });
    this.spmInsStdList = result.data;
    // 행 개수만큼 입력값 배열 초기화 (반응형)
    this.newItemList = this.spmInsStdList.map(() => ({
      mgr_rslt: '',
      rmk: ''
    }));
  } catch (err) {
    alert('기준서 목록을 가져오는 중 오류가 발생했습니다.');
  }
}
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