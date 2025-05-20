<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex gap-4">
        <h2 class="mb-4">출하조회</h2>
      </div>
    </div>
  </div>
  <div class="input">
    수주번호 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
    <button class="btn btn-outline-secondary" id="icon-btn" @click="openOrdModal"
      style="margin-right:100px;">🔍</button>
  </div>
  <br>
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
          <input class="info-input" v-model="detailInfo.mgr" readonly />
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
          <label>출하일자</label>
          <input class="info-input" :value="formatDateTime(detailInfo.spm_dt)" readonly />
        </div>
        <div class="info-col info-right">
          <label>주소</label>
          <input class="info-input" value="대구광역시 중구 중앙대로 403" readonly />
        </div>
      </div>
    </div>
  </div>
  <br>
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
          <td colspan="5">데이터가 없습니다.</td>
        </tr>
    </tbody>
  </table>
  <OrdSelModal v-if="showOrdModal" :ordList="ordList" @select-mat="handleSelectedOrd" @close="showOrdModal = false" />
</template>

<script>
import axios from 'axios';
import OrdSelModal from '@/views/spm/OrdSelModal.vue';

export default {
  components: { OrdSelModal },
  data() {
    return {
      showOrdModal: false,
      ordList: [],
      productList: [],
      searchQuery: '',
      selectedMatNo: '',
      selectedMatNm: '',
       detailInfo: {
      cpy_nm: '',
      ceo_nm: '',
      mgr_ctt: '',
      mgr: '',
      ofc_addr: '',
      spm_dt: ''
      }
    };
  },
  methods: {
    // 모달
    openOrdModal() {
      axios.get('/api/spmFns/complete/product')
        .then(res => {
          this.ordList = Array.isArray(res.data) ? res.data : [];
          this.showOrdModal = true;
        })
        .catch(err => {
          console.error('수주 목록 불러오기 실패', err);
          this.ordList = [];
        });
    },
    // 자재 선택 시
   async handleSelectedOrd(item) {
  try {
    // 거래처/납품처 정보
    const res = await axios.get('/api/spmFns/complete/product/detail', { params: { ord_no: item.ord_no } });
    if (res.data && res.data.length > 0) {
      const info = res.data[0];
      this.detailInfo = {
        cpy_nm: info.cpy_nm || '',
        ceo_nm: info.ceo_nm || '',
        mgr_ctt: info.mgr_ctt || '',
        mgr: info.mgr || '',
        ofc_addr: info.ofc_addr || '',
        spm_dt: info.spm_dt || ''
      };
    } else {
      this.detailInfo = {
        cpy_nm: '', ceo_nm: '', mgr_ctt: '', mgr: '', ofc_addr: '', spm_dt: ''
      };
    }
    // ★ 제품상세정보 받아오기
    const res2 = await axios.get('/api/spmFns/complete/product/detail/product', { params: { ord_no: item.ord_no } });
    this.productList = Array.isArray(res2.data) ? res2.data : [];
    this.searchQuery = item.ord_no;
  } catch (err) {
    alert('상세정보 조회 실패');
    this.detailInfo = {
      cpy_nm: '', ceo_nm: '', mgr_ctt: '', mgr: '', ofc_addr: '', spm_dt: ''
    };
    this.productList = [];
  }
  this.showOrdModal = false;
},
    async fetchDetail(item) {
      try {
        const res = await axios.get('/api/spmFns/complete/product/detail', { params: { ord_no: item.ord_no } });
        if (res.data && res.data.length > 0) {
          const info = res.data[0];
          this.detailInfo = {
            cpy_nm: info.cpy_nm || '',
            ceo_nm: info.ceo_nm || '',
            mgr_ctt: info.mgr_ctt || '',
            mgr: info.mgr || '',
            ofc_addr: info.ofc_addr || '',
            spm_dt: info.spm_dt || ''
          };
        } else {
          this.detailInfo = {
            cpy_nm: '', ceo_nm: '', mgr_ctt: '', mgr: '', ofc_addr: '', spm_dt: ''
          };
        }
      } catch (err) {
        alert('상세정보 조회 실패');
        this.detailInfo = {
          cpy_nm: '', ceo_nm: '', mgr_ctt: '', mgr: '', ofc_addr: '', spm_dt: ''
        };
      }
    },
    formatDateTime(dt) {
      if (!dt) return '';
      const date = new Date(dt);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }
}

</script>

<style scoped>
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 100px;
}

.form-control {
  display: inline-block;
  width: 150px;
}

#input {
  margin-right: 52px;

}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
}

#table {
  width: 650px;
  height: 130px;
  margin-right: 20px;
}

.rslInput {
  width: 100px;
}

.middle {
  display: flex;
}

.rst {
  width: 650px;
  height: 130px;
  border: 1px solid lightgray;
  padding: 10px;
}

.jdg-btn.btn-green {
  background-color: #4caf50 !important;
  color: #fff !important;
}

.jdg-btn.btn-red {
  background-color: #e53935 !important;
  color: #fff !important;
}

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
