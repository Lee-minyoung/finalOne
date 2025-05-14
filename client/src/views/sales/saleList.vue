<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div class="d-flex gap-4">
      <h2 class="mb-4">주문조회</h2>
    </div>
  </div>

  <!-- 상단 검색 -->
  <div class="d-flex justify-content-end align-items-center mb-3">
    <!-- <form class="d-flex" role="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form> -->
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

  <!-- 주문 리스트 테이블 -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">주문번호</th>
        <th scope="col">제품명</th>
        <th scope="col">거래처명</th>
        <th scope="col">제품</th>
        <th scope="col">요청수량</th>
        <th scope="col">lot재고량</th>
        <!-- <th scope="col">수량</th>
        <th scope="col">주문일자</th>
        <th scope="col">현재수량</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in ordList" :key="index">
        <th scope="row">{{ item.ord_no }}</th>
        <th>{{ item.prd_nm }}</th>
        <td>{{ item.cpy_nm }}</td>
        <td>{{ item.prd_nm }}</td>
        <td>{{item['요청수량'] }}</td>
        <td v-if="item['lot수량']>0" >{{ item['lot수량'] }}</td>
        <td v-else>0</td>
        <!-- <td>{{ item.prd_qty }}</td>
        <td>{{ item.rgt_dt.substring(0,10) }}</td>
        <td>{{ item.due_dt.substring(0,10) }}</td> -->
      </tr>
    </tbody>
  </table>

  <!-- 총 주문 수량 -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <div class="d-flex gap-4">
      <h2 class="mb-4">총 주문 수량</h2>
    </div>
  </div>
  <input type="date" v-model="startDate" />
  <input type="date" v-model="endDate" />
  <button class="btn btn-primary" @click="fetchOrdByDate">조회</button>

  <table class="table">
    <thead>
      <tr>
        <th>날짜</th>
        <th>제품명</th>
        <th>현재고</th>
        <th>총 주문수량</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in ordListByDate" :key="index">
        <td>{{ item['DATE(o.due_dt)'].substring(0,10) }}</td>
        <td>{{ item.prd_nm }}</td>
        <td>{{ item.cur_stk }}</td>
        <td>{{ item['SUM(od.prd_qty)'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      ordList: [],
      startDate: '',
      endDate: '',
      tableData: {},
      ordListByDate: [],
      dateArray: [],
      vdr: '',
      vdrCd: '',
      bizNo: '',
      dueDt: '',
      prdNo: '',
      prdQty: ''
    }
  },

  created() {
    this.getOrdList()
  },
  methods: {
    async getOrdList() {
      try {
        const result = await axios.get('/api/ord')
        this.ordList = result.data
        console.log('주문리스트:', this.ordList)
      } catch (err) {
        console.log('주문리스트 불러오기 실패', err)
      }
    },

    async fetchOrdByDate() {
      console.log('날짜 확인:', this.startDate, this.endDate)
      this.dateArray = ['품명', '현재고']
      try {
        const result = await axios.get('/api/ord/by-date', {
          params: {
            startDate: this.startDate,
            endDate: this.endDate
          }
        })
        this.ordListByDate = result.data
        const current = new Date(this.startDate)
        const end = new Date(this.endDate)
        while (current <= end) {
          const dateStr = current.toISOString().slice(0, 10)
          this.dateArray.push(dateStr)
          current.setDate(current.getDate() + 1)
        }
      } catch (err) {
        console.log('기간별 주문리스트 불러오기 실패', err)
      }
    },

    async addOrd() {
      try {
        const result = await axios.post('/api/ord', {
          vdr_no: this.vdrCd,
          due_dt: this.dueDt,
          prd_no: this.prdNo,
          prd_qty: this.prdQty
        })
        console.log(result.data)
        this.getOrdList()
        alert('주문등록 완료')
      } catch (err) {
        console.log('주문등록 실패', err)
      }
    }
  }
}
</script>