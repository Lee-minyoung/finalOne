<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 --> </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="procInsert">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>제품공정흐름도 등록</h4>
      <div>
        <div>
          <div class="row mb-4">
            <!-- Proc번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="procNo" class="form-label fw-bold me-3" style="min-width: 100px;">공정번호</label>
                <input id="procNo" type="text" class="form-control" v-model="proc_no" readonly disabled />
              </div>
            </div>
            <!-- 사용여부 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="procNm" class="form-label fw-bold me-3" style="min-width: 100px;">공정명</label>
                <input id="procNm" type="text" class="form-control" v-model="proc_nm" placeholder="공정명을 입력해주세요." />
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
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-secondary align-items-center" style="width: 100%;"
                @click="openPrcCodeModal">공정코드추가</button>
            </div>
          </div>
          <table class="table table-bordered text-center">
            <thead class="table-light">
              <tr class="small-text">
                <th style="white-space: nowrap">순서</th> <!-- style="white-space: nowrap" => 줄바꿈없음 -->
                <th>공정코드명</th>
                <th>공정기준</th>
                <th>기준값</th>
                <th>ST</th>
                <!-- <th>외주거래처</th>
                <th>외주여부</th> -->
                <th>X</th>
              </tr>
            </thead>
            <tbody v-if="procRows.length === 0" class="small-text">
              <tr>
                <td colspan="8">공정코드추가 버튼을 눌러 공정코드를 추가해주세요.</td>
              </tr>
            </tbody>
            <draggable v-else tag="tbody" v-model="procRows" handle=".drag-handle" @end="onDragEnd" class="small-text"
              itemKey="prco_srl_no">
              <template #item="{ element, index }">
                <tr>
                  <td class="drag-handle small-text"><i class="bi bi-grip-vertical">{{ element.seq }}</i></td>
                  <td><input v-model="element.proc_code_nm" type="text" class="form-control small-text" readonly
                      disabled /></td>
                  <td><input v-model="element.proc_std" type="text" class="form-control small-text" readonly disabled />
                  </td>
                  <td><input v-model="element.std_val" type="text" class="form-control small-text" /></td>
                  <td><input v-model="element.std_tm" type="text" class="form-control small-text" /></td>
                  <!-- <td><input v-model="element.outs_vdr" type="text" class="form-control small-text" /></td>
                  <td><input v-model="element.outs_yn" type="text" class="form-control small-text" /></td> -->
                  <td>
                    <button class="btn btn-outline-danger me-1" @click="removePrcCodeRow(index)"> X </button>
                  </td>
                </tr>
              </template>
            </draggable>
          </table>

          <prcCodeSelectModal v-if="showPrcCodeModal" :prcCodeList="prcCodeList" :selected="procRows"
            @select-prcCode="handleSelectedPrcCodes" @close="showPrcCodeModal = false" />
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
import draggable from 'vuedraggable'; // vue.draggable 라이브러리 추가

import prcCodeSelectModal from '@/views/modal/prcCodeSelectModal.vue';
import prdSelectModal from '@/views/modal/prdSelectModal.vue';

export default {
  components: {
    prcCodeSelectModal,
    prdSelectModal,
    draggable, // 컴포넌트 등록
  },
  data() {
    return {
      proc_no: '', // proc번호
      proc_nm: '', // 공정명
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명

      procRows: [
        // { 
        //   prco_srl_no: '', // 공정 일련번호 (공정번호+진행순서)
        //   seq: '', // 진행순서
        //   proc_code_no: '', // 공정코드번호
        //   proc_code_nm: '', // 공정코드명
        //   proc_std: '', // 공정기준
        //   outs_vdr: '', // 외주 거래처 == 거래처 번호
        //   outs_nm: '', // 외주 거래처 이름
        //   outs_yn: '', // 외주 여부
        //   std_tm: '', // ST 스탠다드타임
        //   std_val: '', // 기준 값
        // }
      ],

      showPrcCodeModal: false, // 자재 선택 모달 초기화값 = 닫힘
      showPrdModal: false, // 제품 선택 모달 초기화값 = 닫힘
      prcCodeList: [], // 공정코드 리스트 (showPrcCodeModal에서 사용)
      prdList: [], // 제품 리스트 (showPrdModal에서 사용)
    };
  },
  created() {
    this.getProcNo();
  },
  methods: {
    // proc_no를 받아 데이터 받아오는 함수
    async getProcNo() {
      let result = await axios.get(`/api/procNo`)
        .catch(err => console.log(err));
      // padStart = SQL에서의 LPAD와 동일한 기능을 가진 문자열함수 => .padStart(원하는 길이, 채우려는 문자)
      this.proc_no = 'PRC-' + (result.data[0].procNo).padStart(3, '0');
    },
    // 초기화 버튼 클릭시 실행할 함수
    resetForm() {
      this.procRows = [],
        this.proc_nm = '', // 공정명
        this.prd_no = ''; // 제품번호
      this.prd_nm = ''; // 제품명
    },
    // 저장 버튼 클릭시 실행할 함수 
    async procInsert() {

      // 공정명 검증
      if (!this.proc_nm?.trim()) {
        alert('공정명을 입력해주세요.');
        return;
      }

      // 제품 선택 검증
      if (!this.prd_no) {
        alert('제품을 선택해주세요.');
        return;
      }

      // 공정코드 목록 검증
      if (!this.procRows || this.procRows.length === 0) {
        alert('공정코드를 추가해주세요.');
        return;
      }

      // 각 공정코드의 기준값과 ST 검증
      for (const row of this.procRows) {
        if (!row.std_val || isNaN(Number(row.std_val))) {
          alert(`[${row.proc_code_nm}] 기준값은 숫자만 입력 가능합니다.`);
          return;
        }
        if (!row.std_tm || isNaN(Number(row.std_tm))) {
          alert(`[${row.proc_code_nm}] ST(초)는 숫자만 입력 가능합니다.`);
          return;
        }
      }
      // 서버에 전달할 정보를 객체로 따로 구성
      let procObj = [];
      for (let i = 0; i < this.procRows.length; i++) {
        procObj[i] = {
          proc_srl_no: this.procRows[i].prco_srl_no,
          proc_no: this.proc_no,
          seq: this.procRows[i].seq,
          proc_code_no: this.procRows[i].proc_code_no,
          proc_nm: this.proc_nm.trim(),
          prd_no: this.prd_no,
          outs_vdr: this.procRows[i].outs_vdr,
          outs_yn: 'f2',
          std_tm: Number(this.procRows[i].std_tm),  // 숫자로 변환
          std_val: Number(this.procRows[i].std_val)  // 숫자로 변환
        };
      };

      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/proc", procObj)
        .catch(err => console.log(err));

      if (result.data.message == '등록 완료') {
        alert('등록되었습니다.');
        this.$emit('proc-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
    // 입력 행 제거
    removePrcCodeRow(index) {
      this.procRows.splice(index, 1);
      this.onDragEnd(); // seq재정렬
    },
    // 공정코드 선택 모달 열기
    openPrcCodeModal() {
      axios.get('/api/prcCode')
        .then(res => {
          this.prcCodeList = res.data;
          this.showPrcCodeModal = true;
        })
        .catch(err => {
          console.error('공정코드 목록 불러오기 실패', err)
        })
    },
    handleSelectedPrcCodes(selectedList) { // 공정코드 선택 모달에서 선택된 공정코드 목록
      let updatedRows = [...this.procRows]
      // updatedRows.map(row => row.mat_no) => updatedRows에서 각 row에서 proc_code_no의 Value값을 받아옴(배열)
      // new set() => 중복된 값 제거 * 자바스크립트의 자료형 중 하나 (set객체) 
      // 요약 : updatedRows에서 proc_code_no의 중복된 값 제거
      const existingProCodeNos = new Set(updatedRows.map(row => row.proc_code_no))
      // 1 선택된 공정코드에 대한 행 추가
      updatedRows = this.appendSelectedPrcCodes(updatedRows, selectedList, existingProCodeNos)
      // 2. 선택된 공정코드만 남기기 (procRows를 선택된 공정코드로 초기화) 
      this.procRows = this.filterOnlySelectedRows(updatedRows, selectedList)
      // 모달 닫기
      this.showPrcCodeModal = false
      this.onDragEnd(); // seq재정렬
    },
    // 선택된 공정코드에 대한 행 추가
    appendSelectedPrcCodes(rows, selectedList, existingProCodeNos) {
      for (const prcCode of selectedList) {
        if (!existingProCodeNos.has(prcCode.proc_code_no)) { // has => set에 포함되어 있는지 확인
          rows.push({
            prco_srl_no: this.proc_no + '-' + (rows.length + 1).toString().padStart(2, '0'), // 공정 일련번호 (공정번호+진행순서)
            seq: rows.length + 1, // 진행순서 (index 값)
            proc_code_no: prcCode.proc_code_no, // 공정코드번호
            proc_code_nm: prcCode.proc_code_nm, // 공정코드명
            proc_std: prcCode.proc_std, // 공정기준
            outs_vdr: null, // 외주 거래처
            outs_yn: 'f2', // 외주 여부
            std_tm: null, // ST 스탠다드타임
            std_val: null, // 기준 값
          });
          existingProCodeNos.add(prcCode.proc_code_no); // add => set에 추가등록
        }
      }
      return rows;
    },
    // 선택된 공정코드만 남기기 (bomRows를 선택된 자재로 초기화) 
    filterOnlySelectedRows(rows, selectedList) {
      return rows.filter(row =>
        // some => 자바스크립트 배열 메서드(배열 안에 특정 조건을 만족하는 요소가 하나라도 있으면 true를 반환)
        row.proc_code_no && selectedList.some(select => select.proc_code_no === row.proc_code_no)
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
    onDragEnd() {
      // 드래그로 순서가 바뀌었을 때 seq 재설정
      this.procRows.forEach((proc, index) => {
        proc.seq = index + 1; // 순서 설정
        proc.prco_srl_no = this.proc_no + '-' + proc.seq.toString().padStart(2, '0') // 번호 설정
      });
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
