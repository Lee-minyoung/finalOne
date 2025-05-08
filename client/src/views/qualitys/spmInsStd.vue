/<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사기준서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      제품번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openProductModal">🔍</button>
      제품명 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      <!-- 하단 데이터 입력-->
      작성자 <input :value="selectedCrtBy" class="form-control" id="input" placeholder="" readonly
        style="background-color: #eee;" />
      수정일자 <input :value="selectedMdfDt" class="form-control" placeholder="" readonly style="background-color: #eee;" />
    </div>
    <br>
    <!-- 테이블 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>규격</th>
          <th>사용장비</th>
          <th>비고</th>
          <th>수정</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in spmInsStdList" :key="item.spm_ins_std_no">
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
          </td>
        </tr>
        <tr>
          <td><input v-model="newItem.ins_itm" class="form-control" placeholder="검사항목" /></td>
          <td><input v-model="newItem.ins_mthd" class="form-control" placeholder="검사기준" /></td>
          <td><input v-model="newItem.ins_spc" class="form-control" placeholder="규격" /></td>
          <td><input v-model="newItem.ins_eqp" class="form-control" placeholder="사용장비" /></td>
          <td><input v-model="newItem.rmk" class="form-control" placeholder="비고" /></td>
          <td>
            <button @click="addRow" class="btn btn-primary btn-sm">추가</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <PrdSelModal v-if="showProductModal" :prodList="prodList" @select-product="handleSelectedProduct"
    @close="showProductModal = false" />
</template>

<script>
import axios from 'axios';
import PrdSelModal from '@/views/qualitys/PrdSelModal.vue';

import { ref,  onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let spmInsStdInfo = ref({
  spm_ins_std_no: '',
  prd_no: '',
  ins_itm: '',
  ins_mthd: '',
  ins_spc: '',
  ins_eqp: '',
  crt_by: '',
  rgt_dt: '',
  mdf_dt: '',
  rmk: '',
  });

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false); 

export default {
  components: { PrdSelModal },
  data() {
    return {
      searchQuery: '',             // 제품 ID
      selectedProductName: '',     // 제품명
      selectedCrtBy: '',           // 작성자
      selectedMdfDt: '',          // 수정일자
      selectedFilter: '',
      spmInsStdList: [],
      prodList: [],
      showProductModal: false,
      form: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
        ins_prd_nm: '',
        crt_by: '',
        mdf_dt: '',
        rmk: '',
        prd_no: '',
        prd_nm: '',
        spm_ins_std_no: '',
      },
      search: '',
    };
  },
  setup() {
    const spmInsStdInfo = ref({
      ins_itm: '',
      ins_mthd: '',
      ins_spc: '',
      ins_eqp: '',
      rmk: '',
      prd_no: '',
      prd_nm: '',
    });
    return {
      spmInsStdInfo,
    };
  },
  computed: {
    filteredProducts() {
      if (!Array.isArray(this.prodList)) {
        return []; // prodList가 배열이 아니면 빈 배열 반환
      }
      return this.prodList.filter(p => p.prd_nm?.includes(this.search)); // 검색어로 필터링
    }
  },
  methods: {
    async spmInsStdInsert() {
      let obj = {
        spm_ins_std_no : spmInsStdInfo.value.spm_ins_std_no,
        prd_no : spmInsStdInfo.value.prd_no,
        ins_itm : spmInsStdInfo.value.ins_itm,
        ins_mthd : spmInsStdInfo.value.ins_mthd,
        ins_spc : spmInsStdInfo.value.ins_spc,
        ins_eqp : spmInsStdInfo.value.ins_eqp,
        rmk : spmInsStdInfo.value.rmk,
        crt_by : spmInsStdInfo.value.crt_by,
        rgt_dt : spmInsStdInfo.value.rgt_dt,
        mdf_dt : spmInsStdInfo.value.mdf_dt,
    }

    let result = await axios.post("/api/spmInsStd", obj)
       .catch(err => console.log(err));

    let addRes = result.data;
    if(addRes.isSuccessed){
        alert('등록되었습니다.');
        spmInsStdInfo.value.no = addRes.prdNo;
    }else{
        alert('등록되지 않았습니다.\n데이터를 확인해보세요.');
    };
    },
    /*
    enableEditMode(index) {
      this.spmInsStdList[index].editMode = true; // 수정 모드 활성화
    },
    disableEditMode(index) {
      this.spmInsStdList[index].editMode = false; // 수정 모드 비활성화
    },

    async saveRow(index) {
      let obj = {
        ins_itm: this.spmInsStdList[index].ins_itm,
        ins_mthd: this.spmInsStdList[index].ins_mthd,
        ins_spc: this.spmInsStdList[index].ins_spc,
        ins_eqp: this.spmInsStdList[index].ins_eqp,
        rmk: this.spmInsStdList[index].rmk,
      };

      console.log('수정 데이터:', obj);
      console.log('spm_ins_std_no:', this.spmInsStdList[index].spm_ins_std_no); // 로그 추가

      if (!this.spmInsStdList[index].spm_ins_std_no) {
        alert('spm_ins_std_no 값이 없습니다. 데이터를 확인하세요.');
        return;
      }

      try {
        let result = await axios.put(`/api/spmInsStd/${this.spmInsStdList[index].spm_ins_std_no}`, obj);
        let updateRes = result.data;

        if (updateRes.isUpdated) {
          alert('수정되었습니다.');
          this.disableEditMode(index); // 수정 모드 비활성화
        } else {
          alert('수정되지 않았습니다.\n데이터를 확인해보세요.');
        }
      } catch (err) {
        console.error('수정 실패:', err);
        alert('수정 중 오류가 발생했습니다.');
      }
    },
    */
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
      .catch(err => {
          console.error('제품 목록 불러오기 실패', err);
          this.prodList = []; // 실패 시 빈 배열로 설정
        });
  },
  handleSelectedProduct(item) {
    this.searchQuery = item.prd_no;
    this.selectedProductName = item.prd_nm;
    this.selectedCrtBy = item.crt_by;
    this.selectedMdfDt = item.mdf_dt;

    this.showProductModal = false;

    this.getSpmInsStdList(item.prd_no);
  },
  async getSpmInsStdList(prd_no) {
    try {
      const result = await axios.get('/api/spmInsStd', { params: { prd_no } });
      this.spmInsStdList = result.data; // 가져온 데이터를 테이블에 바인딩
    } catch (err) {
      console.error('검사 정보 불러오기 실패:', err);
    }
  }
  }
}
</script>
<style>
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 170px;
}

.form-control {
  display: inline-block;
  width: 130px;
}

#input {
  margin-right: 30px;

}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
}

.input-group {
  display: inline-block;
  width: 130px;
}
</style>