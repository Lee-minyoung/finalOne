<template>
  <!-- 우측 영역 시작 -->
  <div class="col-md-7">
    <!-- 우측 버튼 모음 영역 -->
    <div class="d-flex justify-content-between mb-3">
      <div> <!-- 버튼 왼쪽 정렬 -->
        <button class="btn btn-primary me-2" @click="addLn">등록</button>
        <button class="btn btn-danger" @click="deleteLn(ln_no)">삭제</button>
      </div>
      <div> <!-- 버튼 오른쪽 정렬 -->
        <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
        <button class="btn btn-success" @click="saveLn">저장</button>
      </div>
    </div> <!-- 우측 버튼 모음 영역 끝 -->
    <!-- 우측 상세보기 영역 시작 -->
    <div class="card p-3">
      <h4>상세 보기</h4>
      <div v-if="ln">
        <div>
          <div class="row mb-4">
            <!-- 라인번호 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnNo" class="form-label me-3" style="min-width: 100px;">라인번호</label>
                <input id="lnNo" type="text" class="form-control" v-model="ln_no" readonly disabled />
              </div>
            </div>
            <!-- 라인명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnNm" class="form-label me-3" style="min-width: 100px;">라인명</label>
                <input id="lnNm" type="text" class="form-control" v-model="ln_nm" />
              </div>
            </div>
            <!-- 제품명 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="prdNm" class="form-label me-3" style="min-width: 100px;">제품명</label>
                <input id="prdNm" type="text" class="form-control" v-model="prd_nm" readonly disabled />
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
            <!-- 라인상태 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="lnSts" class="form-label me-3" style="min-width: 100px;">라인상태</label>
                <select id="lnSts" class="form-select form-control" v-model="ln_sts">
                  <option value="l1">비가동</option>
                  <option value="l2">대기중</option>
                  <option value="l3">공정중</option>
                  <option value="l4">공정완료</option>
                  <option value="l5">수리중</option>
                  <option value="l6">점검중</option>
                </select>
              </div>
            </div>
            <!-- 일평균생산량 -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="dlyQty" class="form-label me-3" style="min-width: 100px;">일평균생산량</label>
                <input id="dlyQty" type="text" class="form-control" v-model="dly_avg_pdn_qty" />
              </div>
            </div>
          </div>
          <table class="table table-bordered text-center">
            <thead class="table-light">
              <tr class="small-text">
                <th style="font-weight: normal; width: 10%;">순서</th>
                <th style="font-weight: normal; width: 15%;">공정코드</th>
                <th style="font-weight: normal;">공정코드명</th>
                <th style="font-weight: normal; width: 20%;">설비번호</th>
                <th style="font-weight: normal;">설비명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in lnDtlRows" :key="'new-' + index">
                <td><input v-model="row.seq" type="text" class="form-control" readonly disabled /></td>
                <td><input v-model="row.proc_code_no" type="text" class="form-control" readonly disabled /></td>
                <td><input v-model="row.proc_code_nm" type="text" class="form-control" readonly disabled /></td>
                <td>
                  <div class="input-group"><input v-model="row.eqp_no" type="text" class="form-control" readonly />
                    <button class="btn btn-outline-secondary" @click="openEqpModal(index)">🔍</button>
                  </div>
                </td>
                <td><input v-model="row.eqp_nm" type="text" class="form-control" readonly disabled /></td>
              </tr>
            </tbody>
          </table>

          <eqpSelectModal v-if="showEqpModal" :eqpList="eqpList" :selected="lnDtlRows" @select-eqp="handleSelectedEqp"
            @close="showEqpModal = false" />

        </div>
      </div>
      <div v-else> <!-- 리스트에서 선택된 데이터가 없을 때 -->
        <p>라인을 선택하세요!</p>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div>
</template>

<script>
// AJAX 모듈
import axios from 'axios';
import eqpSelectModal from '@/views/modal/eqpSelectModal.vue';

export default {
  props: {
    ln: Object,
  },
  components: {
    eqpSelectModal,
  },
  data() {
    return {
      ln_no: '', // 라인번호
      ln_nm: '', // 라인명
      prd_no: '', // 제품번호
      prd_nm: '', // 제품명
      ln_sts: '',// 라인상태
      use_yn: '',// 사용여부
      dly_avg_pdn_qty: '',// 일평균생산량

      lnDtlRows: [],
      selectedRowIndex: null, // 선택된 행의 인덱스

      showEqpModal: false, // 자재 선택 모달 초기화값 = 닫힘
      eqpList: [], // 설비 리스트 (showEqpModal에서 사용)
    };
  },
  watch: { // props로 받은 ln 객체의 변화를 감시(watch)하는 부분
    // watch는 특정 데이터의 변화를 감시
    // handler는 그 감시하던 데이터가 변경될 때 실행되는 함수(콜백 함수)
    ln: { // ln props의 변화를 감시, props로 받은 ln 값이 변경될 때마다 실행
      handler(newVal) { // ln 값이 변경될 때 실행되는 함수, newVal은 변경된 새로운 ln 값
        if (newVal) {
          this.getLnDtlList(newVal.ln_no);
        } else {
          this.ln_no = '';
          this.ln_nm = '';
          this.prd_no = '';
          this.prd_nm = '';
          this.ln_sts = '';
          this.use_yn = '';
          this.dly_avg_pdn_qty = '';
          this.lnDtlRows = [];
        }
      },
      immediate: true //이 옵션이 있으면 컴포넌트가 처음 생성될 때도 watch 핸들러를 즉시 실행
    }
  },
  methods: {
    // ln_no를 받아 데이터 받아오는 함수
    async getLnDtlList(selected) {
      let result = await axios.get(`/api/ln/${selected}`)
        .catch(err => console.log(err));
      this.lnDtlRows = result.data;
      this.ln_no = result.data[0].ln_no;
      this.ln_nm = result.data[0].ln_nm;
      this.prd_no = result.data[0].prd_no;
      this.prd_nm = result.data[0].prd_nm;
      this.ln_sts = result.data[0].ln_sts;
      this.use_yn = result.data[0].use_yn;
      this.dly_avg_pdn_qty = result.data[0].dly_avg_pdn_qty;
    },
    // 수정된 내용을 DB에 저장
    async lnUpdate() {
      // 라인명 검증
      if (!this.ln_nm?.trim()) {
        alert('라인명을 입력해주세요.');
        return;
      }

      // 라인상태 검증
      if (!this.ln_sts) {
        alert('라인상태를 선택해주세요.');
        return;
      }

      // 사용여부 검증
      if (!this.use_yn) {
        alert('사용여부를 선택해주세요.');
        return;
      }

      // 일평균생산량 검증
      if (!this.dly_avg_pdn_qty || isNaN(Number(this.dly_avg_pdn_qty))) {
        alert('일평균생산량은 숫자로 입력해주세요.');
        return;
      }

      // 설비 선택 검증
      for (let i = 0; i < this.lnDtlRows.length; i++) {
        if (!this.lnDtlRows[i].eqp_no) {
          alert(`${i + 1}번째 공정의 설비를 선택해주세요.`);
          return;
        }
      }
      // 서버에 전달할 정보를 객체로 따로 구성
      let lnInfo = { // ln수정
        ln_nm: this.ln_nm.trim(), // 라인명
        ln_sts: this.ln_sts, // 라인상태
        use_yn: this.use_yn, // 사용여부
        dly_avg_pdn_qty: Number(this.dly_avg_pdn_qty) // 일평균생산량
      }

      let lndtlInfoArray = []; // ln_dtl 수정
      for (let i = 0; i < this.lnDtlRows.length; i++) {
        lndtlInfoArray[i] = {
          eqp_no: this.lnDtlRows[i].eqp_no, // 설비번호만 수정가능
          ln_dtl_no: this.lnDtlRows[i].ln_dtl_no // 수정대상
        };
      };

      let result = await axios.put(`/api/lnAndLnDtl/${this.ln_no}`, [lnInfo, lndtlInfoArray])
        .catch(err => console.log(err));

      if (result.data.message == '수정 완료') {
        alert('수정되었습니다.');
        this.$emit('ln-reload');
        this.getLnDtlList(this.ln_no);
      } else {
        alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
      };
    },
    saveLn() { // 저장 버튼 클릭시 실행할 함수
      if (confirm('정말로 수정하시겠습니까?\n변경된 내용은 즉시 적용됩니다.')) {
        this.lnUpdate(); // 수정내용 저장
      }
    },
    // 추가 버튼 클릭시 실행할 함수
    addLn() {
      this.$emit("goToForm", false);
    },
    // 삭제 버튼 클릭시 실행할 함수
    async deleteLn(lnNo) {
      if (lnNo) { // 선택된 ln이 있을 경우 
        if (confirm('정말로 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
          let result = await axios.delete(`/api/ln/${lnNo}`)
            .catch(err => console.log(err));
          let sqlRes = result.data;
          let sqlResult = sqlRes.affectedRows;
          if (sqlResult > 0) {
            alert('정상적으로 삭제되었습니다.');
            this.$emit('ln-reload');
            this.ln_no = '';
            this.ln_nm = '';
            this.prd_no = '';
            this.prd_nm = '';
            this.ln_sts = '';
            this.use_yn = '';
            this.dly_avg_pdn_qty = '';
            this.lnDtlRows = [];
            this.$emit('clear-selection'); // 선택된 부서 초기화
          } else {
            alert('삭제되지 않았습니다.');
          }
        }
      } else { // 선택된 proc이 없을 경우
        alert("삭제할 라인을 선택하세요");
      }
    },
    resetForm() { // 초기화 버튼 클릭시 실행할 함수
      this.getLnDtlList(this.ln_no);
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
  },

}
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
