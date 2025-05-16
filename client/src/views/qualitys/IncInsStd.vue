<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">자재검사기준서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      LOT번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openMatModal">🔍</button>
      <!-- 자재명은 필요시 추가 -->
      자재번호 <input :value="selectedMatNo" class="form-control" id="input" readonly style="background-color: #eee;" />
      자재명 <input :value="selectedMatNm" class="form-control" id="input" readonly style="background-color: #eee;" />
    </div>
    <br>

    <!-- 테이블 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>NO</th>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>규격</th>
          <th>사용장비</th>
          <th>작성자</th>
          <th>비고</th>
          <th>수정</th>
        </tr>
      </thead>
      <tbody>
        <!-- 추가 입력 행 -->
        <tr>
          <td></td>
          <td><input v-model="newItem.ins_itm" class="form-control" placeholder="검사항목" /></td>
          <td><input v-model="newItem.ins_mthd" class="form-control" placeholder="검사기준" /></td>
          <td><input v-model="newItem.ins_spc" class="form-control" placeholder="규격" /></td>
          <td><input v-model="newItem.ins_eqp" class="form-control" placeholder="사용장비" /></td>
          <td><input v-model="newItem.crt_by" class="form-control" placeholder="작성자" readonly
              style="background-color: #eee;" /></td>
          <td><input v-model="newItem.rmk" class="form-control" placeholder="비고" /></td>
          <td>
            <button @click="incInsStdInsert" class="btn btn-primary btn-sm">추가</button>
          </td>
        </tr>
        <tr v-for="(item, index) in incInsStdList" :key="item.inc_ins_std_no">
          <td>{{ index + 1 }}</td>
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
      </tbody>
    </table>
  </div>

  <!-- 자재 검색 모달 -->
  <MatSelModal v-if="showMatModal" :matList="matList" @select-mat="handleSelectedMat" @close="showMatModal = false" />
</template>

<script>
import axios from 'axios';
import MatSelModal from '@/views/qualitys/MatSelModal.vue';

export default {
  components: { MatSelModal },
  data() {
    return {
      searchQuery: '',
      searchMatNo: '',
      incInsStdList: [],
      matList: [],
      showMatModal: false,
      newItem: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
        crt_by: '',
        rmk: '',
      },
    };
  },
  methods: {
    // 등록
    async incInsStdInsert() {
      if (!this.searchMatNo) {
        alert('자재를 먼저 선택하세요.');
        return;
      }
      console.log('등록할 자재번호:', this.searchMatNo);
      let obj = {
        ...this.newItem,
        mat_no: this.searchMatNo,
        crt_by: this.newItem.crt_by,
      };
      try {
        let result = await axios.post("/api/incInsStd", obj);
        let addRes = result.data;
        if (addRes.isSuccessed) {
          alert('등록되었습니다.');
          this.getIncInsStdList(this.searchMatNo); // 등록한 자재번호로 목록 새로고침
          this.newItem = { ins_itm: '', ins_mthd: '', ins_spc: '', ins_eqp: '', crt_by: '', rmk: '' };
        } else {
          alert('모든 필드를 확인하세요.');
        }
      } catch (err) {
        alert('등록 중 오류가 발생했습니다.');
      }
    },
    // 수정 활성화
    enableEditMode(index) {
      this.incInsStdList[index].originalData = { ...this.incInsStdList[index] };
      this.incInsStdList[index].editMode = true;
    },
    // 수정 비활성화(취소)
    disableEditMode(index) {
      if (this.incInsStdList[index].originalData) {
        this.incInsStdList[index] = {
          ...this.incInsStdList[index].originalData,
          editMode: false,
        };
        delete this.incInsStdList[index].originalData;
      } else {
        this.incInsStdList[index].editMode = false;
      }
    },
    // 수정
    async saveRow(index) {
      let obj = {
        ins_itm: this.incInsStdList[index].ins_itm || '',
        ins_mthd: this.incInsStdList[index].ins_mthd || '',
        ins_spc: this.incInsStdList[index].ins_spc || '',
        ins_eqp: this.incInsStdList[index].ins_eqp || '',
        crt_by: this.incInsStdList[index].crt_by || '',
        inc_ins_std_no: this.incInsStdList[index].inc_ins_std_no || '',
      };
      if (!this.incInsStdList[index].inc_ins_std_no) {
        alert('inc_ins_std_no 값이 없습니다. 데이터를 확인하세요.');
        return;
      }
      try {
        let result = await axios.put(`/api/incInsStd/${this.incInsStdList[index].inc_ins_std_no}`, obj);
        let updateRes = result.data;
        if (updateRes.isUpdated) {
          alert('수정되었습니다.');
          this.incInsStdList[index].editMode = false;
          delete this.incInsStdList[index].originalData;
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
          let result = await axios.delete(`/api/incInsStd/${this.incInsStdList[index].inc_ins_std_no}`);
          let deleteRes = result.data;
          if (deleteRes.isDeleted) {
            alert('삭제되었습니다.');
            this.incInsStdList.splice(index, 1);
          } else {
            alert('삭제되지 않았습니다.\n데이터를 확인해보세요.');
          }
        } catch (err) {
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    },
    // 모달
    openMatModal() {
      axios.get('/api/incInsStd/matList')
        .then(res => {
          this.matList = Array.isArray(res.data) ? res.data : [];
          this.showMatModal = true;
        })
        .catch(err => {
          console.error('자재 목록 불러오기 실패', err);
          this.matList = [];
        });
    },
    // 자재 선택 시
    handleSelectedMat(item) {
      this.searchQuery = item.lot_no;
      this.selectedMatNo = item.mat_no;
      this.selectedMatNm = item.mat_nm;
      this.searchMatNo = item.mat_no;
      this.showMatModal = false;
      this.getIncInsStdList(item.mat_no);
    },
    // 기준서 목록 가져오기
    async getIncInsStdList(mat_no) {
      try {
        const result = await axios.get('/api/incInsStd', { params: { mat_no } });
        this.incInsStdList = result.data;
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
  padding-left: 240px;
}

.form-control {
  display: inline-block;
  width: 130px;
}

#input {
  margin-right: 50px;

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
  margin-right: 50px;
}
</style>