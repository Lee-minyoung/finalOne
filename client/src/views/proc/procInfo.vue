<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addProc">등록</button>
        <button class="btn btn-danger" @click="deleteProc(proc_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveProc">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="proc">
        <div>
          <div class="row mb-4">
            <!-- 공정번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="procNo" class="form-label me-3" style="min-width: 100px;">공정번호</label>
                <input id="procNo" type="text" class="form-control" v-model="proc_no" readonly disabled />
              </div>
            </div>
            <!-- 공정명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="procNm" class="form-label me-3" style="min-width: 100px;">공정명</label>
                <input id="procNm" type="text" class="form-control" v-model="proc_nm" />
              </div>
            </div>
            <!-- 제품명 -->
            <div class="col-md-12 mb-3">
              <div class="d-flex align-items-center">
                <label for="prdNm" class="form-label me-3" style="min-width: 100px;">제품명</label>
                <input id="prdNm" type="text" class="form-control" v-model="prd_nm" readonly disabled />
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
                <th style="white-space: nowrap; font-weight: normal;">순서</th> <!-- style="white-space: nowrap" => 줄바꿈없음 -->
                <th style="font-weight: normal;">공정코드명</th>
                <th style="font-weight: normal;">공정기준</th>
                <th style="font-weight: normal;">기준값</th>
                <th style="font-weight: normal;">ST(초)</th>
                <th style="font-weight: normal;">X</th>
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
                  <td>
                    <button class="btn btn-outline-danger me-1" @click="removePrcCodeRow(index)"> X </button>
                  </td>
                </tr>
              </template>
            </draggable>
          </table>

          <prcCodeSelectModal v-if="showPrcCodeModal" :prcCodeList="prcCodeList" :selected="procRows"
            @select-prcCode="handleSelectedPrcCodes" @close="showPrcCodeModal = false" />

        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>제품공정을 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import draggable from 'vuedraggable'; // vue.draggable 라이브러리 추가
import prcCodeSelectModal from '@/views/modal/prcCodeSelectModal.vue';

export default {
  props: {
    proc: Object,
  },
  components: {
    draggable,
    prcCodeSelectModal,
  },
  data() {
    return {
      proc_no: '', // proc번호
      proc_nm: '', // 공정명
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명

      procRows: [],

      showPrcCodeModal: false, // 자재 선택 모달 초기화값 = 닫힘
      prcCodeList: [], // 공정코드 리스트 (showPrcCodeModal에서 사용)

      useLine: [], // 해당공정을 사용하고 있는 라인의 정보
    };
  },
  watch: { // props로 받은 dept 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    proc: { // dept props의 변화를 감시, props로 받은 dept 값이 변경될 때마다 실행
      handler(newVal) { // dept 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 dept 값
        if (newVal) {
          this.getProcList(newVal.proc_no);
        } else {
          this.proc_no = '';
          this.proc_nm = '';
          this.prd_no = '';
          this.prd_nm = '';
          this.procRows = [];
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  methods: {
    // 라인에서 사용하고 있는 공정인지 확인 (조건 : 제품번호)
    async getUseLine() {
      let result = await axios.get(`/api/useLine/${this.prd_no}`)
        .catch(err => console.log(err));
      this.useLine = result.data;
    },
    // proc_no를 받아 데이터 받아오는 함수
    async getProcList(selected) {
      let result = await axios.get(`/api/proc/${selected}`)
        .catch(err => console.log(err));
      this.procRows = result.data;
      this.proc_no = result.data[0].proc_no;
      this.proc_nm = result.data[0].proc_nm;
      this.prd_no = result.data[0].prd_no;
      this.prd_nm = result.data[0].prd_nm;
    },
    // 수정된 내용을 DB에 저장
    async procUpdate() {
      try {
        // 공정명 검증
        if (!this.proc_nm?.trim()) {
          alert('공정명을 입력해주세요.');
          return;
        }

        // 공정코드 목록 검증
        if (!this.procRows || this.procRows.length === 0) {
          alert('공정코드를 추가해주세요.');
          return;
        }

        // 각 공정코드의 기준값과 ST 검증
        for (const row of this.procRows) {
          // 숫자 타입 검증
          if (!row.std_val || isNaN(Number(row.std_val))) {
            alert(`[${row.proc_code_nm}] 기준값은 숫자만 입력 가능합니다.`);
            return;
          }
          if (!row.std_tm || isNaN(Number(row.std_tm))) {
            alert(`[${row.proc_code_nm}] ST(초)는 숫자만 입력 가능합니다.`);
            return;
          }
        }

        await this.onDragEnd();
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
        }

        const result = await axios.put(`/api/proc/${this.proc_no}`, procObj);

        if (result.data.message === '수정 완료') {
          alert('수정되었습니다.');
          this.$emit('proc-reload');
          await this.getProcList(this.proc_no);
        } else {
          throw new Error('서버 응답이 올바르지 않습니다.');
        }
      } catch (err) {
        console.error('수정 중 오류 발생:', err);
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      }
    },
    async saveProc() { // 저장 버튼 클릭시 실행할 함수
      await this.getUseLine();
      if (this.useLine.length > 0) { // 해당 공정이 사용되고 있는 라인이 있을 경우
        let outMsg = '아래의 라인에서 사용중입니다. 라인을 삭제 후 수정해주세요.\n';
        for (let i = 0; i < this.useLine.length; i++) {
          outMsg += `${i + 1}. 라인번호: ` + this.useLine[i].ln_no + ', ';
          outMsg += '라인명: ' + this.useLine[i].ln_nm + '\n';
        }
        alert(outMsg);
        this.getProcList(this.proc_no);
        return;
      } else {
        if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
          this.procUpdate(); // 수정내용 저장
        }
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addProc() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteProc(procNo) {
      await this.getUseLine();
      if (this.useLine.length > 0) { // 해당 공정이 사용되고 있는 라인이 있을 경우
        let outMsg = '아래의 라인에서 사용중입니다. 라인을 삭제 후 삭제해주세요.\n';
        for (let i = 0; i < this.useLine.length; i++) {
          outMsg += `${i + 1}. 라인번호: ` + this.useLine[i].ln_no + ', ';
          outMsg += '라인명: ' + this.useLine[i].ln_nm + '\n';
        }
        alert(outMsg);
        return;
      } else {
        if (procNo != null) { // 선택된 proc가 있을 경우 
          if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
            let result = await axios.delete(`/api/proc/${procNo}`)
              .catch(err => console.log(err));
            let sqlRes = result.data;
            let sqlResult = sqlRes.affectedRows;
            if (sqlResult > 0) {
              alert('정상적으로 삭제되었습니다.');
              this.proc_no = '';
              this.proc_nm = '';
              this.prd_no = '';
              this.prd_nm = '';
              this.procRows = [];
              this.$emit('clear-selection'); // 선택된 부서 초기화
              this.$emit('proc-reload');
            } else {
              alert('삭제되지 않았습니다.');
            }
          }
        } else { // 선택된 proc이 없을 경우
          alert("삭제할 제품공정을 선택하세요");
        }
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getProcList(this.proc_no);
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

<style scoped>
.table-hover:hover {
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.small-text {
  font-size: 0.875rem;
  /* 글씨 크기를 줄임 (14px) */
}
</style>
