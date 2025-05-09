<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사성적서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      LOT번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openProductModal">🔍</button>
      제품번호 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      제품명 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      <br>
      납품업체 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      검사일자 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      검사자 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
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
              <td><input v-model="newItem.ins_itm" class="rslInput" placeholder="검사량" /></td>
              <td><input v-model="newItem.ins_itm" class="rslInput" placeholder="합격량" /></td>
              <td><input v-model="newItem.ins_mthd" class="rslInput" placeholder="불량량" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 종합판정 -->
      <div class="rst">
        <div class="hstack gap-3">
        <div>종합판정</div>
        <div class="vr"></div>
        <button class="btn btn-success me-2" style="width:150px; height:100px">합격</button>
        <button class="btn btn-danger" style="width:150px; height:100px">불합격</button>
      </div>
      </div>
    </div>
    <!-- 테이블 -->
    <!-- 테이블 헤더 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>NO</th>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>규격</th>
          <th>사용장비</th>
          <th>작성자</th>
          <th>수정일자</th>
          <th>비고</th>
          <th>수정</th>
        </tr>
      </thead>

      <!-- 테이블 바디 -->
      <tbody>
        <tr v-for="(item, index) in spmInsStdList" :key="item.spm_ins_std_no">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.ins_itm" class="form-control" />
            </template>
            <template v-else>
              {{ item.ins_itm }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.ins_mthd" class="form-control" />
            </template>
            <template v-else>
              {{ item.ins_mthd }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.ins_spc" class="form-control" />
            </template>
            <template v-else>
              {{ item.ins_spc }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.ins_eqp" class="form-control" />
            </template>
            <template v-else>
              {{ item.ins_eqp }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.crt_by" class="form-control" readonly style="background-color: #eee;" />
            </template>
            <template v-else>
              {{ item.crt_by }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.mdf_dt" class="form-control" readonly style="background-color: #eee;" />
            </template>
            <template v-else>
              {{ dateFormat(item.mdf_dt, 'yyyy-MM-dd') }}
            </template>
          </td>
          <td>
            <template v-if="item.editMode">
              <input v-model="item.rmk" class="form-control" />
            </template>
            <template v-else>
              {{ item.rmk }}
            </template>
          </td>
          <td>
            <button v-if="!item.editMode" @click="enableEditMode(index)" class="btn btn-warning btn-sm">수정</button>
            <button v-if="item.editMode" @click="saveRow(index)" class="btn btn-success btn-sm">저장</button>
            <button v-if="item.editMode" @click="disableEditMode(index)" class="btn btn-secondary btn-sm">취소</button>
            <button @click="deleteRow(index)" class="btn btn-danger btn-sm">삭제</button>
          </td>
        </tr>

        <!-- 기준서 항목 추가 시 테이블 입력칸 -->
        <tr>
          <td></td>
          <td><input v-model="newItem.ins_itm" class="form-control" placeholder="검사항목" /></td>
          <td><input v-model="newItem.ins_mthd" class="form-control" placeholder="검사기준" /></td>
          <td><input v-model="newItem.ins_spc" class="form-control" placeholder="규격" /></td>
          <td><input v-model="newItem.ins_eqp" class="form-control" placeholder="사용장비" /></td>
          <td><input v-model="newItem.crt_by" class="form-control" placeholder="작성자" readonly
              style="background-color: #eee;" />
          </td>
          <td><input v-model="newItem.mdf_dt" class="form-control" placeholder="수정일자" readonly
              style="background-color: #eee;" /></td>
          <td><input v-model="newItem.rmk" class="form-control" placeholder="비고" /></td>
          <td>
            <button @click="spmInsStdInsert" class="btn btn-primary btn-sm">추가</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 제품 검색 모달 -->
  <PrdSelModal v-if="showProductModal" :prodList="prodList" @select-product="handleSelectedProduct"
    @close="showProductModal = false" />
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import PrdSelModal from '@/views/qualitys/PrdSelModal.vue'; // 모달

import { ref, onBeforeMount } from 'vue';

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false);

export default {
  components: { PrdSelModal },
  data() {
    return {
      searchQuery: '',             // 제품 ID
      selectedProductName: '',     // 제품명
      spmInsStdList: [],
      prodList: [],
      showProductModal: false,
      newItem: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
        rmk: '',
        crt_by: '',
        mdf_dt: '',
      },
      // updateItem: {
      //   ins_itm: '',
      //   ins_mthd: '',
      //   ins_spc: '',
      //   ins_eqp: '',
      //   rmk: '',
      //   spm_ins_std_no: '',
      // },
    };
  },
  methods: {
    // 등록
    async spmInsStdInsert() {
      if (!this.searchQuery) {
        alert('제품을 먼저 선택하세요.');
        return;
      }

      let obj = {
        ...this.newItem,
        prd_no: this.searchQuery, // 선택된 제품 번호
        crt_by: this.selectedCrtBy, // 작성자
        rgt_dt: new Date(), // 등록일자
        mdf_dt: new Date(), // 수정일자
      };

      try {
        let result = await axios.post("/api/spmInsStd", obj);
        let addRes = result.data;

        if (addRes.isSuccessed) {
          alert('등록되었습니다.');
          this.spmInsStdList.push({ ...obj, spm_ins_std_no: addRes.prdNo }); // 테이블에 추가
          this.newItem = { ins_itm: '', ins_mthd: '', ins_spc: '', ins_eqp: '', rmk: '', crt_by: '', mdf_dt: '' }; // 입력 필드 초기화
        } else {
          alert('모든 필드를 확인하세요.');
        }
      } catch (err) {
        alert('등록 중 오류가 발생했습니다.');
      }
    },

    // 날짜 포맷
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    // 수정 활성화
    enableEditMode(index) {
      // 현재 데이터를 originalData에 저장
      this.spmInsStdList[index].originalData = { ...this.spmInsStdList[index] };
      this.spmInsStdList[index].editMode = true; // 수정 모드 활성화
    },
    // 수정 비활성화(취소)
    disableEditMode(index) {
      // originalData를 사용하여 데이터를 복원
      if (this.spmInsStdList[index].originalData) {
        this.spmInsStdList[index] = {
          ...this.spmInsStdList[index].originalData,
          editMode: false, // 수정 모드 비활성화
        };
        delete this.spmInsStdList[index].originalData; // 복원 후 originalData 삭제
      } else {
        this.spmInsStdList[index].editMode = false; // 수정 모드 비활성화
      }
    },

    // 수정
    async saveRow(index) {
      let obj = {
        ins_itm: this.spmInsStdList[index].ins_itm || '', // null 값 방지
        ins_mthd: this.spmInsStdList[index].ins_mthd || '',
        ins_spc: this.spmInsStdList[index].ins_spc || '',
        ins_eqp: this.spmInsStdList[index].ins_eqp || '',
        rmk: this.spmInsStdList[index].rmk || '',
        spm_ins_std_no: this.spmInsStdList[index].spm_ins_std_no || '', // 수정할 기준항목번호
      };

      if (!this.spmInsStdList[index].spm_ins_std_no) {
        alert('spm_ins_std_no 값이 없습니다. 데이터를 확인하세요.');
        return;
      }

      try {
        let result = await axios.put(`/api/spmInsStd/${this.spmInsStdList[index].spm_ins_std_no}`, obj);
        let updateRes = result.data;

        if (updateRes.isUpdated) {
          alert('수정되었습니다.');
          this.spmInsStdList[index].editMode = false; // 수정 모드 비활성화
          delete this.spmInsStdList[index].originalData; // 저장 후 originalData 삭제
        } else {
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        alert('수정 중 오류가 발생했습니다.');
      }
    },

    // 삭제
    async deleteRow(index) {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          let result = await axios.delete(`/api/spmInsStd/${this.spmInsStdList[index].spm_ins_std_no}`);
          let deleteRes = result.data;

          if (deleteRes.isDeleted) {
            alert('삭제되었습니다.');
            this.spmInsStdList.splice(index, 1); // 테이블에서 삭제
          } else {
            alert('삭제되지 않았습니다.\n데이터를 확인해보세요.');
          }
        } catch (err) {
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    },
    // 모달
    showModal() {
      this.showProductModal = true; // 모달 열기
    },
    hideModal() {
      this.showProductModal = false; // 모달 닫기
    },
    openProductModal() {
      axios.get('/api/spmInsStd/prdList') // 제품 목록 가져오기
        .then(res => {
          this.prodList = Array.isArray(res.data) ? res.data : []; // 배열인지 확인 후 설정
          this.showProductModal = true; // 모달 열기
        });
    },

    // 제품 선택 시
    handleSelectedProduct(item) {
      this.searchQuery = item.prd_no;
      this.selectedProductName = item.prd_nm;

      this.showProductModal = false;

      this.getSpmInsStdList(item.prd_no); // 검사 기준서 목록 가져오기
    },

    // 기준서 목록 가져오기
    async getSpmInsStdList(prd_no) {
      try {
        const result = await axios.get('/api/spmInsStd', { params: { prd_no } });
        this.spmInsStdList = result.data; // 가져온 데이터를 테이블에 바인딩
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
  width: 200px;
}

#input {
  margin-right: 100px;

}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
}

.input-group {
  display: inline-block;
  width: 150px;
}

#icon-btn {
  margin-right: 55px;
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
  align-items: center;
}
.rst{
  width:650px;
  
  border: 1px solid lightgray;
  padding: 10px;
}
</style>