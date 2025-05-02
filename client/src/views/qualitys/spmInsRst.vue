<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사성적서 작성</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      LOT 번호 <input class="form-control" id="input" placeholder="" v-model="searchQuery" style="background-color: #eee;" />
      제품번호 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
      제품명 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
      납품업체 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
      검사일자 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
      검사자 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
    </div>

    <!-- 버튼 -->
    <div class="btn1">
      <button type="button" button class="btn btn-primary">수정반영</button>
    </div>

    <!-- 테이블 -->
    <table class="table table-bordered text-center ">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사일자</th>
          <th>검사기준</th>
          <th>검사결과</th>
          <th>판정</th>.
          <th>비고</th>
        </tr>
      </thead>

      <tbody>
        <!-- 등록용 입력 라인 -->
        <tr v-for="spm_ins_std in filterSpmInsStdList" v-bind:key="spm_ins_std.prd_no">
          <td>{{ spm_ins_std.ins_itm }}</td>
          <td>{{ spm_ins_std.mgr_date }}</td>
          <td>{{ spm_ins_std.ins_mthd }}</td>
          <td>{{ spm_ins_std.mgr_rslt }}</td>
          <td>{{ spm_ins_std.jdg }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      searchQuery: "",
      selectedFilter: "",
      spmInsStdList: [],
      isModalOpen: false,
      form: {
        ins_itm: '',
        prd_nm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
        crt_by: '',
        mdf_dt: '',
      },        
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
      this.isModalOpen = true
    },
    hideModal() {
      this.isModalOpen = false
    }
  },

}
</script>
<style>
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 260px;

}

.form-control {
  display: inline-block;
  width: 130px;
}

#input {
  margin-right: 60px;

}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
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