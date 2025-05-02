<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사기준서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      제품번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder=""  readonly/>
        <button class="btn btn-outline-secondary" id="icon-btn" @click="openProductModal">🔍</button>
      제품명 <input :value="selectedProductName" class="form-control" id="input"  readonly style="background-color: #eee;" />
      <!-- 하단 데이터 입력-->
      작성자 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
      수정일자 <input class="form-control" placeholder="" readonly style="background-color: #eee;" />
    </div>


    <!-- 버튼 -->
    <div class="btn1">
      <button type="button" button class="btn btn-primary">기준서 수정</button>
    </div>

    <!-- 테이블 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>규격</th>
          <th>사용장비</th>
          <th>비고</th>
        </tr>
      </thead>

      <tbody>   
        <tr v-for="spm_ins_std in filterSpmInsStdList" v-bind:key="spm_ins_std_no">
          <td>{{ spm_ins_std.ins_itm  }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <PrdSelModal
  v-if="showProductModal"
  :prodList="prodList"
  @select-product="handleSelectedProduct"
  @close="showProductModal = false"
/>
</template>

<script>
import axios from 'axios'
import PrdSelModal from '@/views/qualitys/PrdSelModal.vue'

export default {
  components: { PrdSelModal },
  data() {
    return {
      searchQuery: "",             // 제품 ID
      selectedProductName: "",     // 제품명
      selectedFilter: "",
      spmInsStdList: [],
      showProductModal: false,
      form: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
        ins_prd_nm: '',
      },
      showProductModal: false,
      prodList: [],
    }
  },
  computed: {
    filterSpmInsStdList() { // 필터된 DeptList 보여줌
      return this.spmInsStdList.filter(spm_ins_std =>
        spm_ins_std.prd_no.toLowerCase().includes(this.searchQuery.toLowerCase() &&
          (this.selectedFilter === "" || spm_ins_std.prd_no === this.selectedFilter))
      );
    },
  },
  methods: {
    async getSpmInsStdList() {
      let result = await axios.get(`/api/spmInsStd`)
        .catch(err => console.log(err));

      this.SpmInsStdList = result.data;
      //this.form = result.data
    },
    showModal() {
      this.showProductModal = true
    },
    hideModal() {
      this.showProductModal = false
    },
    handleSelectedProduct(item) {
      this.searchQuery = item.prd_no
      this.selectedProductName = item.prd_nm
      this.showProductModal = false
    // 필요한 경우 이름도 같이 세팅
    // this.selectedProductName = item.prd_nm
  },
    // 제품 선택 모달 열기
    openProductModal() {
      axios.get('/api/prodpln/prdList')
        .then(res => {
          this.prodList = res.data
          this.showProductModal = true
        })
        .catch(err => {
          console.error('제품 목록 불러오기 실패', err)
        })
    },
  },

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

.input-group{
  display: inline-block;
  width: 130px;
}

.icon-btn {
  line-height: 30px;
  background-color: #ffffff;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  width: 30px;
  height: 33px;
  margin-left: 5px;

  &::before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 20px;
    background-image: url(https://cdn-icons-png.flaticon.com/512/8944/8944245.png);
    background-size: 100%;
    background-repeat: no-repeat;
    vertical-align: top;
    margin-top: 7px;
  }

  margin-right:30px;
}
</style>

