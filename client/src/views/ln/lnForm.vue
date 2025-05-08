<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 --> </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="lnInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>라인 등록</h4>

      <div>
        <div>
          <div class="row mb-4">
            <!-- 라인번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnNo" class="form-label fw-bold me-3" style="min-width: 100px;">라인번호</label>
                <input id="lnNo" type="text" class="form-control" v-model="ln_no" readonly disabled/>
              </div>
            </div>
            <!-- 라인명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnNm" class="form-label fw-bold me-3" style="min-width: 100px;">라인명</label>
                <input id="lnNm" type="text" class="form-control" v-model="ln_nm" />
              </div>
            </div>
            <!-- 제품명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="prdNm" class="form-label fw-bold me-3" style="min-width: 100px;">제품명</label>
                <div class="input-group">
                  <input id="prdNm" type="text" class="form-control" v-model="prd_nm" readonly
                    placeholder="제품을 선택해주세요." />
                  <button class="btn btn-outline-secondary" @click="openPrdModal">🔍</button>
                </div>
              </div>
            </div>
            <!-- 사용여부 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="useYn" class="form-label fw-bold me-3" style="min-width: 100px;">사용여부</label>
                <input id="useYn" type="text" class="form-control" value="여" readonly disabled />
              </div>
            </div>
            <!-- 라인상태 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnSts" class="form-label fw-bold me-3" style="min-width: 100px;">라인상태</label>
                <input id="lnSts" type="text" class="form-control" value="비가동" readonly disabled />
              </div>
            </div>
            <!-- 일평균생산량 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="dlyQty" class="form-label fw-bold me-3" style="min-width: 100px;">일평균생산량</label>
                <input id="dlyQty" type="text" class="form-control" v-model="dly_avg_pdn_qty" />
              </div>
            </div>
          </div>
          <table class="table table-bordered text-center">
            <thead class="table-light">
              <tr class="small-text">
                <th style="width: 10%;">순서</th>
                <th style="width: 15%;">공정코드</th>
                <th>공정코드명</th>
                <th style="width: 20%;">설비번호</th>
                <th>설비명</th>
              </tr>
            </thead>
            <tbody v-if="lnDtlRows && lnDtlRows.length > 0" class="small-text">
              <tr v-for="(row, index) in lnDtlRows" :key="'new-' + index">
                <td><input v-model="row.seq" type="text" class="form-control" readonly disabled /></td>
                <td><input v-model="row.proc_code_no" type="text" class="form-control" readonly disabled /></td>
                <td><input v-model="row.proc_code_nm" type="text" class="form-control" readonly disabled /></td>
                <td>
                  <div class="input-group">
                    <input v-model="row.eqp_no" type="text" class="form-control" readonly/>
                    <button class="btn btn-outline-secondary" @click="openEqpModal(index)">🔍</button>
                  </div>
                </td>
                <td><input v-model="row.eqp_nm" type="text" class="form-control" readonly disabled /></td>
              </tr>
            </tbody>
            <tbody v-else class="small-text">
              <tr>
                <td colspan="5">제품을 선택하여 공정을 추가해주세요.</td>
              </tr>
            </tbody>
          </table>

          <eqpSelectModal v-if="showEqpModal" :eqpList="eqpList" :selected="lnDtlRows" @select-eqp="handleSelectedEqp"
            @close="showEqpModal = false" />
          <prdSelectModal v-if="showPrdModal" :prdList="prdList" :selected="prd_no" @select-prd="handleSelectedPrd"
            @close="showPrdModal = false" />

        </div>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';

import CommonCodeFormat from '@/utils/useCommonCode.js'

import prdSelectModal from '@/views/modal/prdSelectModal.vue';
import eqpSelectModal from '@/views/modal/eqpSelectModal.vue';

export default {
  components: {
    prdSelectModal,
    eqpSelectModal,
  },
  data() {
    return {
      ln_no: '', // 라인번호
      ln_nm: '', // 라인명
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명
      use_yn: 'f1',// 사용여부
      ln_sts: 'l2',// 라인상태
      dly_avg_pdn_qty: null,// 일평균생산량

      lnDtlRows: [],
      selectedRowIndex: null, // 선택된 행의 인덱스

      showPrdModal: false, // 제품 선택 모달 초기화값 = 닫힘
      prdList: [], // 제품 리스트 (showPrdModal에서 사용)
      showEqpModal: false, // 자재 선택 모달 초기화값 = 닫힘
      eqpList: [], // 설비 리스트 (showEqpModal에서 사용)
    };
  },
  watch: {
    // prd_no가 변경될 때 getLnDtl 실행
    prd_no(newVal) {
      if (newVal) {
        this.getLnDtl();
      }
    },
  },
  created() {
    this.getLnNo();
  },
  methods: {
    // 라인번호를 받아오는 함수
    async getLnNo() {
      let result = await axios.get(`/api/lnNo`)
        .catch(err => console.log(err));
      // padStart = SQL에서의 LPAD와 동일한 기능을 가진 문자열함수 => .padStart(원하는 길이, 채우려는 문자)
      this.ln_no = 'LINE-' + (result.data[0].lnNo).padStart(3, '0');
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.lnDtlRows = [];
      this.ln_nm = ''; // 라인명
      this.prd_no = ''; // 제품번호
      this.prd_nm = ''; // 제품명
      this.use_yn = 'f1';// 사용여부
      this.ln_sts = 'l2';// 라인상태
      this.dly_avg_pdn_qty = null;// 일평균생산량
    },
    // 저장 버튼 클릭시 실행할 함수 
    async lnInsert() {
      // 서버에 전달할 정보를 객체로 따로 구성
      let lnInfo = {
        ln_no: this.ln_no,
        ln_nm: this.ln_nm,
        prd_no: this.prd_no,
        dly_avg_pdn_qty: this.dly_avg_pdn_qty
      };

      let lnDtlInfoArray = [];
      for (let i = 0; i < this.lnDtlRows.length; i++) {
        lnDtlInfoArray[i] = {
          ln_dtl_no: this.ln_no + '-' + (i + 1).toString().padStart(2, '0'),
          ln_no: this.ln_no,
          proc_srl_no: this.lnDtlRows[i].proc_srl_no,
          eqp_no: this.lnDtlRows[i].eqp_no
        };
      };

      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/lnAndLnDtl", [lnInfo, lnDtlInfoArray])
        .catch(err => console.log(err));

      if (result.data.message == '등록 완료') {
        alert('등록되었습니다.');
        this.$emit('ln-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
    // 제품 선택 모달 열기
    openPrdModal() {
      axios.get('/api/prd')
        .then(res => {
          this.prdList = res.data;
          this.showPrdModal = true;
        })
        .catch(err => {
          console.error('제품 목록 불러오기 실패', err)
        })
    },
    handleSelectedPrd(selectedPrd) { // 제품 선택 모달에서 선택된 제품
      this.prd_no = selectedPrd.prd_no; // 모달에서 선택한 제품의 번호를 this.prd_no에 초기화
      this.prd_nm = selectedPrd.prd_nm; // 모달에서 선택한 제품의 이름을 this.prd_nm에 초기화
      // 모달 닫기
      this.showPrdModal = false;
    },
    // 제품 번호로 제품공정흐름도 조회 => 조회한 공정흐름도를 lnDtlRows에서 사용
    async getLnDtl() {
      try {
        const result = await axios.get(`/api/lnDtlList/${this.prd_no}`);
        this.lnDtlRows = result.data || []; // 데이터가 없으면 빈 배열로 초기화
      } catch (err) {
        console.error('공정 흐름도 조회 실패', err);
        this.lnDtlRows = []; // 에러 발생 시 빈 배열로 초기화
      }
    },
    // 설비 선택 모달 열기
    openEqpModal(index) {
      axios.get('/api/eqp')
        .then(res => {
          this.selectedRowIndex = index; // 클릭한 인덱스를 저장
          this.eqpList = res.data;
          this.showEqpModal = true;
        })
        .catch(err => {
          console.error('설비 목록 불러오기 실패', err)
        })
    },
    handleSelectedEqp(selectedEqp) { // 설비 선택 모달에서 선택된 설비
      if (this.selectedRowIndex !== null) {
        // 클릭한 인덱스의 lnDtlRows 업데이트
        this.lnDtlRows[this.selectedRowIndex].eqp_no = selectedEqp.eqp_no;
        this.lnDtlRows[this.selectedRowIndex].eqp_nm = selectedEqp.eqp_nm;
      }
      this.showEqpModal = false;
    },
  }
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.drag-handle {
  cursor: grab;
}

.small-text {
  font-size: 0.875rem;
  /* 글씨 크기를 줄임 (14px) */
}
</style>
