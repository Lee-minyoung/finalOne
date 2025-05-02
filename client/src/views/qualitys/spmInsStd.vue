<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사기준서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      제품ID <input class="form-control" id="input" placeholder="" v-model="searchQuery"/>
      제품명 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;"/>
      작성자 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;"/>
      수정일자 <input class="form-control" placeholder="" readonly style="background-color: #eee;"/>
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
      <!-- <div style="max-height: 600px; overflow-y:auto">  -->
      <tbody>
        <!-- 등록용 입력 라인 -->
        <tr v-for="spm_ins_std in form" v-bind:key="spm_ins_std.prd_no"
          @click="selectDept(spm_ins_std.prd_no)">
          <td>{{ spm_ins_std.ins_itm }}</td>
          <td>{{ spm_ins_std.ins_mthd }}</td>
          <td>{{ spm_ins_std.ins_spc }}</td>
          <td>{{ spm_ins_std.ins_eqp }}</td>
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
      spmInsStdList: [],
      form: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
      },
    }
  },
  computed: {
    filteredDeptList() { // 필터된 DeptList 보여줌
      return this.spmInsStdList.filter(spm_ins_std =>
        spm_ins_std.prd_no.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // count(){
    //     return this.spmInsStdList.length;
    // }
  },
  //   created(){
  //     this.getSpmInsStdList();
  // },
  methods: {
    async getSpmInsStdList(dddd) {
      try {
        let result = await axios.get(`/api/spmInsStd/${dddd}`)
          .catch(err => console.log(err))
        this.from = result.data
      } catch (err) {
        console.error('리스트 불러오기 실패', err)
      }
    },
  }
}

</script>
<style>
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 180px;

}

.form-control {
  display: inline-block;
  width: 130px;
}

#input {
  margin-right: 30px;

}

.btn {
  margin: 15px;
}

.btn1 {
  float: right;
}
</style>