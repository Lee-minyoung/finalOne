<template>


    <h3>발주서입력</h3>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
  <button class="btn btn-primary me-md-2" type="button">발주입력</button>
  <button class="btn btn-primary" type="button" @click="gotoOrdView">발주조회</button>
</div>
   <!--발주 지시 입력-->
   <div class="border rounded p-3 mb-4">
            <div class="row g-3">
              <div class="col-md-4"><label class="form-label">발주일자</label><input type="date" class="form-control" v-model="vdrCd" /></div>
              <div class="col-md-4"><label class="form-label">수령인</label><input type="text" class="form-control" v-model="bizNo" /></div>
              <div class="col-md-4"><label class="form-label">수령방법</label><input type="text" class="form-control" v-model="dueDt" /></div>
              <div class="col-md-4"><label class="form-label">담당자</label><input type="text" class="form-control" /></div>
              <div class="col-md-4"><label class="form-label">거래처</label><input type="text" class="form-control" /></div>
              <div class="col-md-12"><label class="form-label">거래처번호</label><input type="text" class="form-control" /></div>
            </div>
          </div>


    <table class="table">
  <thead>
    <tr>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">수량</th>
      <th scope="col">단가</th>
      <th scope="col">총가격</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr> 
  </tbody>
</table>

</template>

<script>
export default{
  data() {
    return {
      // ordList: [],
      // startDate: '',
      // endDate: '',
      // tableData: {},
      // ordListByDate: [],
      // dateArray: [],
      // vdr: '',
      // vdrCd: '',
      // bizNo: '',
      // dueDt: '',
      // prdNo: '',
      // prdQty: ''
    }
  },
  methods:{
    //클릭하면 발주서 조회 페이지로 이동 
    gotoOrdView() {
      this.$router.push({ name: 'OrdView' });
    },


  }, 

  // created() {
  //   this.getOrdList()
  // },
}

</script>