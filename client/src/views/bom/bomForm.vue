<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-6">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-outline-secondary" @click="openMatModal">자재추가</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="bomInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>BOM 등록</h4>
      <div>
        <div>
          <div class="row mb-4">
            <!-- BOM번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="bomNo" class="form-label fw-bold me-3" style="min-width: 100px;">BOM번호</label>
                <input id="bomNo" type="text" class="form-control" v-model="bom_No" readonly />
              </div>
            </div>
            <!-- 사용여부 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="useYn" class="form-label fw-bold me-3" style="min-width: 100px;">사용여부</label>
                <input id="useYn" type="text" class="form-control" value="여" readonly />
              </div>
            </div>
            <!-- 제품명 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="prdNm" class="form-label fw-bold me-3" style="min-width: 100px;">제품명</label>
                <div class="input-group">
                  <input id="prdNm" type="text" class="form-control" v-model="prd_nm" placeholder="제품을 선택해주세요."
                    readonly />
                  <button class="btn btn-outline-secondary" @click="openPrdModal">제품검색</button>
                </div>
              </div>
            </div>
          </div>
          <table class="table table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th>자재번호</th>
                <th>자재명</th>
                <th>용량</th>
                <th>단위</th>
                <th>비고</th>
                <th>X</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="bomRows[0].mat_no === ''">
                <tr>
                  <td colspan="6">자재추가 버튼을 눌러 자재를 추가해주세요.</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, index) in bomRows" :key="'new-' + index">
                  <td><input v-model="row.mat_no" type="text" class="form-control" /></td>
                  <td><input v-model="row.mat_nm" type="text" class="form-control" /></td>
                  <td><input v-model.number="row.cap" type="number" class="form-control" /></td>
                  <td><input v-model="row.unit" type="text" class="form-control" /></td>
                  <td><input v-model="row.rmk" type="text" class="form-control" /></td>
                  <td>
                    <button class="btn btn-outline-danger me-1" @click="removeMatRow(index)"> X </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <matSelectModal v-if="showMatModal" :matList="matList" :selected="bomRows" @select-mat="handleSelectedMats"
            @close="showMatModal = false" />
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

import matSelectModal from '@/views/modal/matSelectModal.vue';
import prdSelectModal from '@/views/modal/prdSelectModal.vue';

export default {
  components: {
    matSelectModal,
    prdSelectModal,
  },
  data() {
    return {
      bom_No: '', // bom번호
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명

      bomRows: [
        {
          mat_no: '', // 자재번호
          mat_nm: '', // 자재명
          cap: '', // 용량
          unit: '', // 단위
          rmk: '', // 비고
        }
      ],

      showMatModal: false, // 자재 선택 모달 초기화값 = 닫힘
      showPrdModal: false, // 제품 선택 모달 초기화값 = 닫힘
      matList: [], // 자재 리스트 (showMatModal에서 사용)
      prdList: [], // 제품 리스트 (showPrdModal에서 사용)
      allMatList: [], // 자재추가 모달에서 선택한 자재들 리스트 (저장하기 전)
    };
  },
  created() {
    this.getBomNo();
  },
  methods: {
    // dept_no를 받아 데이터 받아오는 함수
    async getBomNo() {
      let result = await axios.get(`/api/bomNo`)
        .catch(err => console.log(err));
      this.bom_No = result.data[0].addBomNo;
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.bomRows = [
        {
          mat_no: '', // 자재번호
          mat_nm: '', // 자재명
          cap: '', // 용량
          unit: '', // 단위
          rmk: '', // 비고
        }
      ],
        this.prd_no = ''; // 제품번호
      this.prd_nm = ''; // 제품명
    },
    // 저장 버튼 클릭시 실행할 함수 
    async bomInsert() {
      // 서버에 전달할 정보를 객체로 따로 구성
      let bomObj = {
        prd_no: this.prd_no,
      };
      let bomMatObj = [];
      for (let i = 0; i < this.bomRows.length; i++) {
        bomMatObj[i] = {
          bom_no: this.bom_No,
          mat_no: this.bomRows[i].mat_no,
          cap: this.bomRows[i].cap,
          unit: this.bomRows[i].unit,
          rmk: this.bomRows[i].rmk,
        };
      };

      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/bomAndBomMat", [bomObj, bomMatObj])
        .catch(err => console.log(err));
        
      if (result.data.message == '등록 완료') {
        alert('등록되었습니다.');
        this.$emit('dept-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
    // 입력 행 제거
    removeMatRow(index) {
      this.bomRows.splice(index, 1)
    },
    // 자재 선택 모달 열기
    openMatModal() {
      axios.get('/api/mat')
        .then(res => {
          this.matList = res.data;
          this.showMatModal = true;
        })
        .catch(err => {
          console.error('자재 목록 불러오기 실패', err)
        })
    },
    handleSelectedMats(selectedList) { // 자재 선택 모달에서 선택된 자재 목록
      let updatedRows = [...this.bomRows]
      // updatedRows.map(row => row.mat_no) => updatedRows에서 각 row의 Key인 mat_no의 Value값을 받아옴(배열)
      // new set() => 중복된 값 제거 * 자바스크립트의 자료형 중 하나 (set객체) 
      // 요약 : updatedRows에서 mat_no의 중복된 값 제거
      const existingMatNos = new Set(updatedRows.map(row => row.mat_no))
      // 1 선택된 자재에 대한 행 추가
      updatedRows = this.appendSelectedMats(updatedRows, selectedList, existingMatNos)
      // 2. 선택된 자재만 남기기 (bomRows를 선택된 자재로 초기화) 
      this.bomRows = this.filterOnlySelectedRows(updatedRows, selectedList)
      // 모달 닫기
      this.showMatModal = false
    },
    // 선택된 자재에 대한 행 추가
    appendSelectedMats(rows, selectedList, existingMatNos) {
      for (const mat of selectedList) {
        if (!existingMatNos.has(mat.mat_no)) { // has => set에 포함되어 있는지 확인
          rows.push({
            mat_no: mat.mat_no, // 자재번호
            mat_nm: mat.mat_nm, // 자재명
            cap: '', // 용량
            unit: '', // 단위
            rmk: '', // 비고
          })
          existingMatNos.add(mat.mat_no) // add => set에 추가등록
        }
      }
      return rows
    },
    // 선택된 자재만 남기기 (bomRows를 선택된 자재로 초기화) 
    filterOnlySelectedRows(rows, selectedList) {
      return rows.filter(row =>
        // some => 자바스크립트 배열 메서드(배열 안에 특정 조건을 만족하는 요소가 하나라도 있으면 true를 반환)
        row.mat_no && selectedList.some(select => select.mat_no === row.mat_no)
      )
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
      //console.log('선택된 제품:', selectedPrd.prd_no, selectedPrd.prd_nm);
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
</style>
