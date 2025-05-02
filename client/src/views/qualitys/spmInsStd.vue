<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">완제품검사기준서</h2>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      제품번호 <input class="form-control" id="input_id" placeholder="" v-model="searchQuery"/>
      <button type="button" class="icon-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
      
      <!-- 모달 -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">제품번호 찾기</h5>
            </div>
            <div class="modal-body">
              <!-- 제품명 입력 -->
              <div class="border rounded p-3 mb-4">
                <div class="row g-3">
                  <div class="col-md-4"><label class="form-label">제품명</label><input type="text" class="form-control" v-model="vdr" />
                    <button type="button" class="icon-btn" data-bs-toggle="modal"></button>
                  </div>
                </div>
              </div>

              <!-- 제품 리스트 테이블 -->
              <table class="table table-bordered text-center align-middle">
                <thead class="table-light">
                  <tr>
                    <th>선택</th>
                    <th>제품번호</th>
                    <th>제품명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prd in filterSpmInsStdList" v-bind:key="prd.prd_nm">
                    <td><input type="radio"/></td>
                    <td>{{ prd.prd_no }}</td>
                    <td>{{ prd.prd_nm }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- FOOTER 버튼 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="addPrd"> 선택</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 모달 끝-->

      제품명 <input class="form-control" id="input" placeholder="" readonly style="background-color: #eee;" />
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
        <!-- 등록용 입력 라인 -->
        <tr v-for="spm_ins_std in filterSpmInsStdList" v-bind:key="spm_ins_std.prd_no">
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
      selectedFilter: "",
      spmInsStdList: [],
      isModalOpen: false,
      form: {
        ins_itm: '',
        ins_mthd: '',
        ins_spc: '',
        ins_eqp: '',
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