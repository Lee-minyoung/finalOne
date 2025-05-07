<template>

<h3>발주서조회</h3>

<div class="d-flex justify-content-end align-items-center mb-3">  
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      주문 등록
    </button>
  </div>

  <!-- 주문 등록 모달 -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">주문등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <!-- 검색 옵션 -->
          <!-- <div class="d-flex align-items-center gap-3 mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchType" id="searchByName" checked />
              <label class="form-check-label" for="searchByName">업체명</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="searchType" id="searchByCode" />
              <label class="form-check-label" for="searchByCode">업체코드</label>
            </div>
            <input type="text" class="form-control w-50 ms-3" placeholder="Search..." />
          </div> -->

          <!-- 업체 정보 입력 -->
          <div class="border rounded p-3 mb-4">
            <div class="row g-3">
              <div class="col-md-4"><label class="form-label">업체명</label><input type="text" class="form-control" v-model="vdr" /></div>
              <div class="col-md-4"><label class="form-label">업체코드</label><input type="text" class="form-control" v-model="vdrCd" /></div>
              <div class="col-md-4"><label class="form-label">사업자등록번호</label><input type="text" class="form-control" v-model="bizNo" /></div>
              <div class="col-md-4"><label class="form-label">납기예정일</label><input type="date" class="form-control" v-model="dueDt" /></div>
              <div class="col-md-4"><label class="form-label">이름</label><input type="text" class="form-control" /></div>
              <div class="col-md-4"><label class="form-label">연락처</label><input type="text" class="form-control" /></div>
              <div class="col-md-12"><label class="form-label">주소</label><input type="text" class="form-control" /></div>
            </div>
          </div>

          <!-- 제품 리스트 테이블 -->
          <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
                <th>No</th>
                <th>제품 ID</th>
                <th>제품명</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><input type="text" class="form-control" v-model="prdNo" /></td>
                <td><input type="text" class="form-control" /></td>
                <td><input type="number" class="form-control" v-model="prdQty" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          <button type="button" class="btn btn-primary" @click="addOrd">주문등록</button>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
export default{
data(){
  return{
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
}




}


</script>