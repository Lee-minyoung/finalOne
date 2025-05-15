<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">출하표지</h2>
      </div>
    </div>
  </div>
  <div>
    <!-- 출하이력 불러오기 버튼 -->
    <button class="btn btn-primary mb-2" @click="fetchSpmRcdList">출하이력 불러오기</button>

    <!-- 출하이력 테이블 -->
    <table class="table table-bordered text-center" style="margin-top:5px;">
      <thead class="table-light">
        <tr>
          <th>수주번호</th>
          <th>납품처</th>
          <th>출하일자</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in spmRcdList" :key="item.ord_no" @click="selectRow(item)"
          :class="{ 'table-active': selectedOrdNo === item.ord_no }">
          <td>{{ item.ord_no }}</td>
          <td>{{ item.cpy_nm }}</td>
          <td>{{ formatDateTime(item.spm_dt) }}</td>
        </tr>
        <tr v-if="spmRcdList.length === 0">
          <td colspan="5">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>

    <!-- 추가 버튼 -->
    <div class="text-end mb-3">
      <button class="btn btn-primary" @click="handleSpmComplete" :disabled="!selectedOrdNo">출하완료 처리</button>
    </div>

    <!-- 납품처/공급처 정보 입력 폼 -->
    <div class="info-box">
      <div style="margin-left:50px; margin-right:50px; padding-bottom: 10px; padding-top: 10px;">
        <div class="info-row">
          <div class="info-col" style="margin-left:190px;">
            <div class="info-title">납품처 정보</div>
          </div>
          <div class="info-col info-right" style="margin-right:15px; margin-top:-3px">
            <div class="info-title">공급처 정보</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-col">
            <label>상호명</label>
            <input class="info-input" v-model="detailInfo.cpy_nm" readonly />
          </div>
          <div class="info-col info-right">
            <label>상호명</label>
            <input class="info-input" value="(주)밥먹고하시조" readonly />
          </div>
        </div>

        <div class="info-row">
          <div class="info-col info">
            <label>대표</label>
            <input class="info-input" v-model="detailInfo.ceo_nm" readonly />
          </div>
          <div class="info-col info-right">
            <label>전화</label>
            <input class="info-input" value="053-421-2460" readonly />
          </div>
        </div>

        <div class="info-row">
          <div class="info-col">
            <label>전화</label>
            <input class="info-input" v-model="detailInfo.mgr_ctt" readonly />
          </div>
          <div class="info-col info-right">
            <label>대표</label>
            <input class="info-input" value="서강중" readonly />
          </div>
        </div>

        <div class="info-row">
          <div class="info-col">
            <label>담당자</label>
            <input class="info-input" v-model="detailInfo.mgr_nm" readonly />
          </div>
          <div class="info-col info-right">
            <label>담당자</label>
            <input class="info-input" value="2조" readonly />
          </div>
        </div>

        <div class="info-row">
          <div class="info-col">
            <label>주소</label>
            <input class="info-input" v-model="detailInfo.ofc_addr" readonly />
          </div>
          <div class="info-col info-center" style="margin-left: 11px;">
            <label>출하일</label>
            <input class="info-input" :value="formatDateTime(detailInfo.spm_dt)" readonly />
          </div>
          <div class="info-col info-right">
            <label>주소</label>
            <input class="info-input" value="대구광역시 중구 중앙대로 403" readonly />
          </div>
        </div>

        <hr>
        <table class="table table-bordered text-center" style="margin-top:5px;">
          <thead class="table-light">
            <tr>
              <th>제품번호</th>
              <th>제품명</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in productList" :key="item.prd_no">
              <td>{{ item.prd_no }}</td>
              <td>{{ item.prd_nm }}</td>
              <td>{{ item.qty }}</td>
            </tr>
            <tr v-if="productList.length === 0">
              <td colspan="3">데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <br>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      spmRcdList: [],
      selectedOrdNo: null,
      detailInfo: {
        cpy_nm: '',
        ceo_nm: '',
        mgr_ctt: '',
        mgr_nm: '',
        ofc_addr: '',
        spm_dt: ''
      },
      productInfo: {
        prd_no: '',
        prd_nm: '',
        qty: ''
      },
       productList: []
    }
  },
  methods: {
    async fetchSpmRcdList() {
      try {
        const res = await axios.get('/api/spmMrk');
        this.spmRcdList = res.data;
      } catch (err) {
        alert('출하이력 불러오기 실패');
      }
    },
    async fetchDetail(item) {
      try {
        // 납품처 정보
        const res = await axios.get('/api/spmMrk/detail', { params: { ord_no: item.ord_no } });
        if (res.data && res.data.length > 0) {
          this.detailInfo = res.data[0];
        }
        // 제품상세정보
        const res2 = await axios.get('/api/spmMrk/detail/product', { params: { ord_no: item.ord_no } });
    if (res2.data && res2.data.length > 0) {
      this.productList = res2.data; // 여러 제품 모두 할당
    } else {
      this.productList = [];
    }
  } catch (err) {
    alert('상세정보 불러오기 실패');
    this.productList = [];
      }
    },
    formatDateTime(dt) {
      if (!dt) return '';
      const date = new Date(dt);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    },
    selectRow(item) {
      this.selectedOrdNo = item.ord_no;
      this.fetchDetail(item);
    },
    async handleSpmComplete() {
    if (!this.selectedOrdNo) {
      alert('리스트를 선택하세요.');
      return;
    }
    try {
      const res = await axios.post('/api/spmMrk/complete', { ord_no: this.selectedOrdNo });
      alert('출하완료 처리되었습니다.');
      this.fetchSpmRcdList(); // 리스트 갱신
    } catch (err) {
      alert('출하완료 처리 실패');
    }
  },
  }
}

</script>

<style>
.table-active {
  background-color: #e3f2fd !important;
  /* 밝은 하늘색 */
}

.info-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 18px 18px 10px 18px;
  background: #fff;
  width: 100%;
  margin: 0 auto;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-col {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

.info-center {
  justify-content: center;
}

.info-right {
  justify-content: flex-end;
}

.info-title {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 2px;
}

.info-input {
  margin-left: 8px;
  margin-right: 16px;
  min-width: 120px;
  max-width: 220px;
  width: 100%;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #eee;
  font-size: 0.95rem;
  padding: 2px 8px;
}

.info-col label {
  min-width: 48px;
  font-size: 0.95rem;
  color: #444;
}

.product-row {
  display: flex;
  /* gap: 16px; */
  margin-top: 12px;
  margin-bottom: 6px;
}

.product-row .info-input {
  max-width: 180px;
  margin-right: 60px;
}

hr {
  margin: 30px 0 30px 0;
  border: none;
  border-top: 1px solid #424242;
}

.table-active {
  background-color: #e3f2fd !important;
  /* 원하는 색상으로 변경 */
}
</style>