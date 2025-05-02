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
        <button class="btn btn-success" @click="deptInsert">저장</button>
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
                  <input id="prdNm" type="text" class="form-control" v-model="prd_nm" placeholder="제품을 선택해주세요." readonly />
                  <button class="btn btn-outline-secondary" @click="openProductModal">제품검색</button>
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
              <tr v-for="(row, index) in bomRows" :key="'new-' + index">
                <td><input v-model="row.mat_no" type="text" class="form-control" /></td>
                <td><input v-model="row.mat_nm" type="text" class="form-control" /></td>
                <td><input v-model.number="row.cap" type="number" class="form-control" /></td>
                <td><input v-model="row.unit" type="text" class="form-control" /></td>
                <td><input v-model="row.rmk" type="text" class="form-control" /></td>
                <td>
                  <button class="btn btn-outline-danger me-1" @click="removePlanRow(index)"> X </button>
                </td>
              </tr>

              <!-- <tr v-for="item in prodPlanList" :key="item.pdn_pln_no" @click="togglePlanSelection(item)"
                :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                <td>{{ item.pdn_pln_no }}</td>
                <td>{{ item.prd_nm }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ dateFormat(item.st_dt, 'yyyy-MM-dd') }}</td>
                <td>{{ dateFormat(item.end_dt, 'yyyy-MM-dd') }}</td>
                <td>{{ item.situ }}</td>
                <td>{{ item.rmk }}</td>
                <td></td>
              </tr> -->
            </tbody>
          </table>

          <matSelectModal v-if="showMatModal" :matList="matList" :selected="bomRows" @select-mat="handleSelectedMats"
            @close="showMatModal = false" />

        </div>
      </div>
    </div> <!-- 우측 상세보기 영역 끝 -->
  </div> <!-- 우측 영역 끝 -->
</template>

<script>
// AJAX 모듈
import axios from 'axios';

import matSelectModal from '@/views/modal/matSelectModal.vue';

export default {
  components: {
    matSelectModal,
  },
  data() {
    return {
      bom_No: '', // bom번호
      prd_no: '', // 제품번후
      prd_nm: '', // 제품명

      bomRows: [ // 사용자 입력용 계획 행
        {
          mat_no: '', // 자재번호
          mat_nm: '', // 자재명
          cap: '', // 용량
          unit: '', // 단위
          rmk: '', // 비고
        }
      ],

      showMatModal: false, // 자재 선택 모달 초기화값 = 닫힘
      matList: [], // 자재 리스트 (showMatModal에서 사용)
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
      this.deptInfo.dept_nm = null;
      this.deptInfo.dept_mgr = null;
    },
    // 저장 버튼 클릭시 실행할 함수 
    async deptInsert() {
      // Form에 입력된 정보를 기준으로 등록하는 경우
      // 서버에 전달할 정보를 객체로 따로 구성
      let obj = {
        dept_nm: this.deptInfo.dept_nm,
        dept_mgr: this.deptInfo.dept_mgr,
      }
      // 서버에 데이터를 요청 : POST + http://localhost:3000/books => proxy ) /api/books
      // axios 모듈을 활용해 AJAX하는 경우 POST와 PUT은 두번째 매개변수로 서버에 보낼 데이터를 전달, 자동으로 JSON 적용
      let result = await axios.post("/api/dept", obj)
        .catch(err => console.log(err));
      let addRes = result.data;
      if (addRes.isSuccessed) {
        alert('등록되었습니다.');
        this.$emit('dept-reload');
      } else {
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
      };
      this.$emit("goToInfo", true);
    },
    // 입력 행 제거
    removePlanRow(index) {
      this.planRows.splice(index, 1)
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
