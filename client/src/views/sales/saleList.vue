<template>
  <div class="container">
    <!-- 상단 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">주문조회</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">주문 등록</button>
    </div>
    <!-- 주문 등록 모달 -->
    <div class="modal fade" id="exampleModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold">주문등록</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <!-- 기본 정보 입력 영역 -->
            <div class="border rounded p-4 mb-4 shadow-sm">
              <h6 class="mb-3 fw-bold text-primary">기본 정보</h6>
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label fw-bold">납기예정일</label>
                  <input type="date" class="form-control" v-model="dueDt" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">거래처</label>
                  <div class="input-group">
                    <input type="text" class="form-control" :value="selectVdr?.cpy_nm || ''" readonly />
                    <button class="btn btn-primary" @click="showVdrModal = true">
                      <i class="bi bi-search"></i> 선택
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">거래처코드</label>
                  <input type="text" class="form-control" :value="selectVdr?.vdr_no || ''" readonly />
                </div>
              </div>
            </div>

            <!-- 주문 상품 영역 -->
            <div class="border rounded p-4 shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0 fw-bold text-primary">주문 상품</h6>
                <button class="btn btn-outline-primary" @click="showPrdModal = true">
                  <i class="bi bi-plus-circle"></i> 상품 추가
                </button>
              </div>
              <table class="table table-bordered text-center align-middle">
                <thead class="table-light">
                  <tr>
                    <th class="bg-light">No</th>
                    <th class="bg-light">제품 ID</th>
                    <th class="bg-light">제품명</th>
                    <th class="bg-light">수량</th>
                    <th class="bg-light">관리</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prd, idx) in selectPrdList" :key="prd.prd_no">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <input type="text" class="form-control" v-model="prd.prd_no" readonly />
                    </td>
                    <td>
                      <input type="text" class="form-control" v-model="prd.prd_nm" readonly />
                    </td>
                    <td>
                      <input type="number" class="form-control" v-model.number="prd.qty" min="1" />
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-danger" @click="removePrd(idx)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 모달 컴포넌트 -->
            <vdr-select-modal v-if="showVdrModal" :vdr-list="vdrList" :selected="selectVdr"
              @select-vdr="handleVdrSelect" @close="showVdrModal = false" />
            <prd-select-modal v-if="showPrdModal" :prod-list="prdList" :selected="selectPrdList"
              @select-product="handlePrdSelect" @close="showPrdModal = false" />
          </div>
          <div class="modal-footer bg-light">
            <button class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <button class="btn btn-primary" @click="addOrd">
              <i class="bi bi-check-circle"></i> 주문등록
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>

      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button class="btn btn-primary" @click="fetchOrdByDate"><span>조회</span></button>
    </div>

    <!-- 주문 리스트 테이블 -->
    <!--전체조회-->
    <table v-if="!dateShow" class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th>주문번호</th>
          <th>제품명</th>
          <th>거래처코드</th>
          <th>요청수량</th>
          <th>LOT재고량</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in ordList" :key="index">
          <td>{{ item.ord_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.vdr_no }}</td>
          <td>{{ item['요청수량'] }}</td>
          <td>{{ item['lot수량'] !== null ? item['lot수량'] : 0 }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else class="table table-bordered text-center mt-4">
      <thead class="table-light">
        <tr>
          <th>주문번호</th>
          <th>제품명</th>
          <th>거래처명</th>
          <th>요청수량</th>
          <th>LOT재고량</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in ordListByDate" :key="item.ord_no + '-' + item.prd_no">
          <td>{{ item.ord_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.cpy_nm }}</td>
          <td>{{ item['요청수량'] }}</td>
          <td>{{ item['lot수량'] !== null ? item['lot수량'] : 0 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from 'axios';
import vdrSelectModal from '@/views/modal/vdrSelectModal.vue';
import prdSelectModal from '@/views/production/ProductSelectModal.vue';

export default {
  components: { vdrSelectModal, prdSelectModal },
  data() {
   const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  return {
    showVdrModal: false,
    showPrdModal: false,
    selectVdr: null,
    selectPrd: null,
    vdrCd: '',
    prdNo: '',
    prdQty: 1,
    dueDt: '',
    ordList: [],
    vdrList: [],
    prdList: [],
    selectPrdList: [],
    ordListByDate: [],
    startDate: todayStr,   // ← 오늘로 기본값
    endDate: todayStr,     // ← 오늘로 기본값
    dateShow: false,
    };
  },
  async created() {
    await this.getOrdList();
    this.vdrList = (await axios.get('/api/vdr')).data || [];
    this.prdList = (await axios.get('/api/prd')).data || [];
  },
  methods: {
    removePrd(idx) {
      this.selectPrdList.splice(idx, 1);
    },
    async getOrdList() {
      try {
        const res = await axios.get('/api/ord');
        this.ordList = res.data;
      } catch (err) {
        console.error('주문 불러오기 실패', err);
      }
    },
    async addOrd() {
      if (!this.vdrCd || !this.dueDt || !this.selectPrdList.length) {
        alert('필수 정보를 모두 입력해주세요.');
        return;
      }
      try {
        const res = await axios.post('/api/ord', {
          vdr_no: this.vdrCd,
          due_dt: this.dueDt,
          products: this.selectPrdList.map(p => ({
            prd_no: p.prd_no,
            prd_qty: p.qty
          }))
        });
        alert('주문등록 완료');
        this.getOrdList();
        // 등록 후 입력값 초기화
        this.selectPrdList = [];
        this.selectVdr = null;
        this.dueDt = '';
      } catch (err) {
        console.error('주문등록 실패', err);
        alert('등록 실패');
      }
    },
    handleVdrSelect(vdr) {
      this.selectVdr = vdr;
      this.vdrCd = vdr.vdr_no;
      this.showVdrModal = false;
    },

    handlePrdSelect(prdArr) {
      this.selectPrdList = prdArr.map(p => ({ ...p, qty: p.qty || 1 }));
      this.showPrdModal = false;
    },

    // handlePrdSelect(prd) {
    //   this.selectPrd = prd;
    //   this.prdNo = prd.prd_no;
    //   this.showPrdModal = false;
    // },
    async fetchOrdByDate() {
      console.log('날짜 확인:', this.startDate, this.endDate)
      this.dateArray = ['품명', '현재고']
      this.dateShow = true;

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
        console.log('기간별 주문리스트', this.ordListByDate)

      } catch (err) {
        console.log('기간별 주문리스트 불러오기 실패', err)
      }
    },


  },
};
</script>