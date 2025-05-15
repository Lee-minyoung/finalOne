<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addBom">등록</button>
        <button class="btn btn-danger" @click="deleteBom(bomMatInfo[0].bom_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveBom">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="bom">
        <div>
          <div class="row mb-4">
            <!-- BOM번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="bomNo" class="form-label me-3" style="min-width: 100px;">BOM번호</label>
                <input id="bomNo" type="text" class="form-control" v-model="bom_no" readonly disabled />
              </div>
            </div>
            <!-- 사용여부 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="useYn" class="form-label me-3" style="min-width: 100px;">사용여부</label>
                <select id="useYn" class="form-select form-control" v-model="use_yn">
                  <option value="f1">여</option>
                  <option value="f2">부</option>
                </select>
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
                @click="openMatModal">자재추가</button>
            </div>
          </div>
          <table class="table table-bordered text-center">
            <thead class="table-light">
              <tr>
                <th style="font-weight: normal;">자재번호</th>
                <th style="font-weight: normal;">자재명</th>
                <th style="font-weight: normal;">용량</th>
                <th style="font-weight: normal;">단위</th>
                <th style="font-weight: normal;">비고</th>
                <th style="font-weight: normal;">X</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="bomMatInfo.length > 0">
                <tr v-for="(row, index) in bomMatInfo" :key="'new-' + index">
                  <td><input v-model="row.mat_no" type="text" class="form-control text-center" readonly disabled /></td>
                  <td><input v-model="row.mat_nm" type="text" class="form-control" readonly disabled /></td>
                  <td><input v-model.number="row.cap" type="number" class="form-control text-end" /></td>
                  <td><input v-model="row.unit" type="text" class="form-control" readonly disabled /></td>
                  <td><input v-model="row.rmk" type="text" class="form-control" /></td>
                  <td>
                    <button class="btn btn-outline-danger me-1" @click="removeMatRow(index)"> X </button>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="6">자재추가 버튼을 눌러 자재를 추가해주세요.</td>
                </tr>
              </template>
            </tbody>
          </table>

          <matSelectModal v-if="showMatModal" :matList="matList" :selected="bomMatInfo" @select-mat="handleSelectedMats"
            @close="showMatModal = false" />

        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>BOM을 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import matSelectModal from '@/views/modal/matSelectModal.vue';

export default {
  props: {
    bom: Object,
  },
  components: {
    matSelectModal,
  },
  data() {
    return {
      bom_no: '', // bom번호
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명
      use_yn: '', // 사용여부

      bomMatInfo: [],

      showMatModal: false, // 자재 선택 모달 초기화값 = 닫힘
      matList: [], // 자재 리스트 (showMatModal에서 사용)
    };
  },
  watch: { // props로 받은 bom 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    bom: { // bom props의 변화를 감시, props로 받은 bom 값이 변경될 때마다 실행
      handler(newVal) { // bom 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 bom 값
        if (newVal) {
          this.getBomMatInfo(newVal.bom_no);
        } else {
          this.bomMatInfo = [];
          this.bom_no = '';
          this.prd_no = '';
          this.prd_nm = '';
          this.use_yn = '';
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  methods: {
    // bom_no를 받아 데이터 받아오는 함수
    async getBomMatInfo(selected) {
      let result = await axios.get(`/api/bomMat/${selected}`)
        .catch(err => console.log(err));
      this.bomMatInfo = result.data;
      this.bom_no = result.data[0].bom_no;
      this.prd_no = result.data[0].prd_no;
      this.prd_nm = result.data[0].prd_nm;
      this.use_yn = result.data[0].use_yn;
    },
    // 수정된 내용을 DB에 저장
    async bomUpdate() {
      // bom 은 수정 (수정될게 사용여부 뿐임)
      // bom_mat이 일부가 삭제될 수도 있고 추가될 수도 있는데 그걸 체크하기가 번거로움
      // bom_mat은 전부 삭제시키고 새로 insert

      // 자재 목록 존재 여부 검증
      if (this.bomMatInfo.length === 0) {
        alert('자재를 추가해주세요.');
        return;
      };

      // 자재별 용량 검증
      for (const mat of this.bomMatInfo) {
        if (!mat.cap || mat.cap <= 0) {
          alert(`${mat.mat_nm}의 용량을 입력해주세요.`);
          return;
        }
      };

      // 사용여부 검증
      if (!this.use_yn) {
        alert('사용여부를 선택해주세요.');
        return;
      };

      let bomInfo = { // bom 수정할 사용여부 내용 저장
        use_yn: this.use_yn,
      };

      let bomMatInfoArray = [];
      for (let i = 0; i < this.bomMatInfo.length; i++) {
        bomMatInfoArray[i] = {
          bom_no: this.bom_no,
          mat_no: this.bomMatInfo[i].mat_no,
          cap: this.bomMatInfo[i].cap,
          unit: this.bomMatInfo[i].unit,
          rmk: this.bomMatInfo[i].rmk,
        };
      };
      // 서버에 데이터를 요청 : PUT + http://localhost:3000/dept/100 => proxy ) /api/dept/100
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.put(`/api/bomAndBomMat/${this.bom_no}`, [bomInfo, bomMatInfoArray])
        .catch(err => console.log(err));

      if (result.data.message == '수정 완료') {
        alert('수정되었습니다.');
        this.$emit('bom-reload');
        this.getBomMatInfo(this.bomMatInfo[0].bom_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    saveBom() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.bomUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addBom() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteBom(bomNo) {
      if (bomNo > 0) { // 선택된 dept가 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/bom/${bomNo}`)
            .catch(err => console.log(err));
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            // 정상적으로 삭제된 경우 존재하지 않는 데이터이므로 전체조회로 페이지 전환
            this.$emit('bom-reload');
            this.bomMatInfo = [];
            this.bom_no = '';
            this.prd_no = '';
            this.prd_nm = '';
            this.use_yn = '';
            this.$emit('clear-selection'); // 선택 초기화
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 BOM이 없을 경우
        alert("삭제할 BOM을 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getBomMatInfo(this.bomMatInfo[0].bom_no);
    },
    // 입력 행 제거
    removeMatRow(index) {
      this.bomMatInfo.splice(index, 1)
    },
    // 자재 선택 모달 열기
    openMatModal() {
      axios.get('/api/mat')
        .then(res => {
          this.matList = res.data;
          this.showMatModal = true; // 모달 열기
        })
        .catch(err => {
          console.error('자재 목록 불러오기 실패', err);
        });
    },
    handleSelectedMats(selectedList) { // 자재 선택 모달에서 선택된 자재 목록
      let updatedRows = [...this.bomMatInfo]
      // updatedRows.map(row => row.mat_no) => updatedRows에서 각 row의 Key인 mat_no의 Value값을 받아옴(배열)
      // new set() => 중복된 값 제거 * 자바스크립트의 자료형 중 하나 (set객체) 
      // 요약 : updatedRows에서 mat_no의 중복된 값 제거
      const existingMatNos = new Set(updatedRows.map(row => row.mat_no))
      // 1 선택된 자재에 대한 행 추가
      updatedRows = this.appendSelectedMats(updatedRows, selectedList, existingMatNos)
      // 2. 선택된 자재만 남기기 (bomRows를 선택된 자재로 초기화) 
      this.bomMatInfo = this.filterOnlySelectedRows(updatedRows, selectedList)
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
            unit: mat.unit, // 단위
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
</style>
