<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">자재검사성적서 조회</h2>
      <div class="center-button">
        <button class="btn btn-primary" @click="exportToPDF" style="margin-bottom:-40px;">PDF 내보내기</button>
        <div class="d-flex gap-4">
        </div>
      </div>
    </div>
    <div ref="pdfarea" >
    <!-- 조회 조건 -->
    <div class="input search-area" ref="searchArea">
  <div class="search-row">
    <label>자재검색</label>
    <input v-model="searchQuery" class="form-control" readonly />
    <button class="btn btn-outline-secondary search-btn" @click="openMatModal" style="margin-left: -15px;">🔍</button>
    <label style="margin-left:270px; margin-right:10px">성적서번호</label>
    <input :value="selectedRsltNo" class="form-control" readonly />
  </div>
  <hr>
  <div class="search-row">
    <label>LOTNo</label>
    <input :value="selectedLotNo" class="form-control" readonly />
    <label style="margin-left:40px;">발주번호</label>
    <input v-model="searchPurOrdNo" class="form-control" readonly />
    <label style="margin-left:40px;">납입업체</label>
    <input v-model="selectedVdrNm" class="form-control" readonly />
  </div>
  <div class="search-row">
    <label>자재명</label>
    <input :value="selectedMatNm" class="form-control" readonly />
    <label style="margin-left:40px;">작성일자</label>
    <input :value="selectedInsDate" class="form-control" readonly />
    <label style="margin-left:40px;">검사자</label>
    <input :value="selectedInsDev" class="form-control" readonly />
  </div>
</div>
    <br>
    <div class="middle">
      <!-- 결점구분 -->
      <div>
        <table class="table table-bordered text-center" id="table">
          <thead class="table-light">
            <tr>
              <th>결점구분</th>
              <th>검사량</th>
              <th>합격량</th>
              <th>불량량</th>
            </tr>
          </thead>

          <!-- 수량 입력칸 -->
          <tbody>
            <tr>
              <td>수량</td>
              <td>{{ rsltMaster?.mgr_count }}</td>
              <td>{{ rsltMaster?.succ_count }}</td>
              <td>{{ rsltMaster?.dft_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 종합판정 -->
      <div class="rst">
        <div class="hstack gap-3">
          <div style="padding-left:50px;">종합판정</div>
          <div class="vr"></div>
          <button :class="['jdg-btn', rsltMaster?.ovr_jdg === 'n1' ? 'btn-green' : '']"
            style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;">합격</button>
          <button :class="['jdg-btn', rsltMaster?.ovr_jdg === 'n2' ? 'btn-red' : '']"
            style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;">불합격</button>
        </div>
      </div>
    </div>
    <h5>검사결과</h5>
    <!-- 테이블 -->
    <!-- 테이블 헤더 -->
    <table class="table table-bordered text-center" ref="resultTable">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>검사결과</th>
          <th>판정</th>
          <th>비고</th>
        </tr>
      </thead>

      <!-- 테이블 바디 : 검사결과  -->
      <tbody>
        <tr v-for="(item, index) in rsltDetailList" :key="index">
          <td>{{ item.ins_itm }}</td>
          <td>{{ item.ins_mthd }}</td>
          <td>{{ item.mgr_rslt }}</td>
          <td>{{ getJdgName(item.jdg) }}</td>
          <td>{{ item.rmk }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>

  <!-- 제품 검색 모달 -->
  <MatGetRsltSelModal
  v-if="showMatModal"
  :matList="prodList"
  @select-lot="handleSelectedProduct"
  @close="showMatModal = false" />
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import html2pdf from 'html2pdf.js';
import { ref } from 'vue';
import MatGetRsltSelModal
  from '@/views/qualitys/MatGetRsltSelModal.vue'; // 모달

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false);

export default {
  components: { MatGetRsltSelModal },
  data() {
    return {
      searchQuery: '',             // 제품검색
      selectedLineId: '',          // 라인번호
      selectedProductName: '',     // 제품명
      selectedInsDate: '',     // 날짜
      newItemList: [],
      spmInsStdList: [],
      prodList: [],
      rsltMaster: null,
      rsltDetailList: [],
      showMatModal: false,
      newItem: [],
      overallJdg: '',
      selectedRsltNo: '', // 성적서 번호
    };
  },
  created() {
    this.selectedInsDev = localStorage.getItem('username') || ''; // 검사자(로그인 사용자)
  },
  computed: {
    filteredLots() {
      if (!this.matList) return [];
      return this.matList.filter(m => m.mat_nm?.includes(this.search));
    }
  },
  methods: {
    // 공통코드 변환
    getJdgName(code) {
      if (code === 'o1') return '적합';
      if (code === 'o2') return '부적합';
      return code || '';
    },

    getToday() {
      const today = new Date();
      // YYYY-MM-DD 형식
      return today.toISOString().slice(0, 10);
    },
    // 날짜 포맷
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    async fetchRsltDetail(prd_no, ln_opr_no) {
      const res = await axios.get('/api/spmInsGetRslt/detail', { params: { prd_no, ln_opr_no } });
      this.rsltMaster = res.data.master; // rslt_no, mgr_count, succ_count, dft_count, ovr_jdg
      this.rsltDetailList = res.data.detail; // [{ ins_itm, ins_mthd, mgr_rslt, jdg, rmk }, ...]
      this.selectedRsltNo = this.rsltMaster?.rslt_no || '';
      console.log(this.rsltDetailList)
    },

    // 모달
    showModal() {
      this.showMatModal = true; // 모달 열기
    },
    hideModal() {
      this.showMatModal = false; // 모달 닫기
    },
      openMatModal() {
    axios.get('/api/incInsGetRslt/rsltMat')
      .then(res => {
        this.prodList = Array.isArray(res.data) ? res.data : [];
        this.showMatModal = true;
      })
      .catch(() => {
        this.prodList = [];
        alert('제품 목록 불러오기 실패');
      });
  },
    // 제품 선택 시
async handleSelectedProduct(item) {
  // 1. LOT 상세정보 조회 (selRsltPrdDtl 쿼리 활용)
  try {
    const res = await axios.get('/api/incInsGetRslt/rsltPrdDtl', { params: { lot_no: item.lot_no } });
    if (res.data && res.data.length > 0) {
      const info = res.data[0];

      // 2. input칸에 값 자동 세팅
      this.searchQuery = item.mat_no || '';
      this.selectedMatNm = item.mat_nm || '';
      this.selectedLotNo = info.lot_no || '';
      this.searchPurOrdNo = info.pur_ord_no || '';
      this.selectedVdrNm = info.vdr_nm || '';
      this.selectedInsDate = info.ins_dt ? info.ins_dt.slice(0, 10) : '';
      this.selectedInsDev = info.mgr_nm || '';
      this.rsltMaster = {
        mgr_count: info.mgr_count,
        succ_count: info.acpt_qty,
        dft_count: info.rjct_qty,
        ovr_jdg: info.ovr_jdg,
        rslt_no: info.rslt_no
    };
    this.selectedRsltNo = info.rslt_no || '';
    this.rsltDetailList = res.data.map(row => ({
      ins_itm: row.ins_itm,
      ins_mthd: row.ins_mthd,
      mgr_rslt: row.mgr_rslt,
      jdg: row.jdg,
      rmk: row.rmk
    }));
  }}
  catch (err) {
    alert('상세정보 조회 실패');
    this.searchQuery = '';
    this.selectedMatNm = '';
    this.selectedLotNo = '';
    this.searchPurOrdNo = '';
    this.selectedVdrNm = '';
    this.selectedInsDate = '';
    this.selectedInsDev = '';
    this.rsltMaster = null;
    this.rsltDetailList = [];
  }
  },
    exportToPDF() {
  const pdfArea = this.$refs.pdfarea;
  const searchArea = this.$refs.searchArea;
  const resultTable = this.$refs.resultTable;
  // 버튼 DOM 직접 찾기
  const searchBtn = pdfArea.querySelector('.search-btn');
  const originalBtnDisplay = searchBtn ? searchBtn.style.display : '';

  // 버튼 숨기기
  if (searchBtn) searchBtn.style.display = 'none';

  // 기존 transform/width 조작
  const originalPdfTransform = pdfArea.style.transform;
  const originalPdfWidth = pdfArea.style.width;
  const originalSearchTransform = searchArea.style.transform;
  const originalSearchWidth = searchArea.style.width;
  const originalResultTransform = resultTable.style.transform;
  const originalResultWidth = resultTable.style.width;

  pdfArea.style.transform = "scale(0.615)";
  pdfArea.style.transformOrigin = "top left";
  pdfArea.style.width = "162.6%";
  searchArea.style.transform = "scale(1.2)";
  searchArea.style.transformOrigin = "top left";
  searchArea.style.width = "83.33%";

  html2pdf(pdfArea, {
    margin: [15, 15, 15, 15],
    filename: 'document.pdf',
    image: { type: "jpg", quality: 0.95 },
    html2canvas: {
      useCORS: true,
      scrollY: 0,
      scale: 1,
      dpi: 300,
      letterRendering: true,
      allowTaint: false,
      mediaType: 'print'
    },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true }
  }).then(() => {
    // 원복
    pdfArea.style.transform = originalPdfTransform;
    pdfArea.style.width = originalPdfWidth;
    searchArea.style.transform = originalSearchTransform;
    searchArea.style.width = originalSearchWidth;
    resultTable.style.transform = originalResultTransform;
    resultTable.style.width = originalResultWidth;
    // 버튼 다시 보이게
    if (searchBtn) searchBtn.style.display = originalBtnDisplay;
  });
}
  }
}
</script>


<style>
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

.form-control {
  display: inline-block;
  width: 150px;
  min-height: 32px;
  font-size: 1em;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #eee;
}
.input {
  border: 1px solid lightgray;
  padding: 30px;
  padding-left: 100px;
  margin-bottom: 30px;
}

.input.search-area {
  border: 1px solid lightgray;
  padding: 30px 40px 20px 40px;
  margin-bottom: 30px;
  background: #fff;
}
.search-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.search-row label {
  min-width: 70px;
  margin-right: 8px;
  font-weight: 500;
  white-space: nowrap;
}
.search-row input {
  margin-right: 24px;
  min-width: 160px;
  background: #eee;
}
.search-row .btn {
  margin-right: 24px;
}
.input.search-area hr {
  margin: 18px 0;
  border: none;
  border-top: 1px solid #ccc;
}

/* PDF 전용 스타일 */
@media print {
  .search-area {
    background: #fff !important;
    border: 1.5px solid #bbb !important;
    padding: 30px 40px 20px 40px !important;
    font-size: 1.1em !important;
  }
  .search-row label {
    min-width: 100px !important;
    white-space: nowrap; /* 줄바꿈 방지 */
    
  }
  .search-row input {
    font-size: 1em !important;
    height: 2em !important;
  }
   /* 버튼 숨기기 */
  .search-btn {
    display: none !important;
  }
}
</style>