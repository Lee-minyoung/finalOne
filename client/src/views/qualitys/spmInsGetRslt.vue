<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">완제품검사성적서 조회</h2>
      <div class="center-button">
        <button class="btn btn-primary" @click="downloadPdf" style="margin-bottom:-40px;">PDF 내보내기</button>
        <div class="d-flex gap-4">
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      제품검색 <input v-model="searchQuery" class="form-control" id="input_id" placeholder="" readonly />
      <button class="btn btn-outline-secondary" id="icon-btn" @click="openProductModal"
        style="margin-right:505px;">🔍</button>
      성적서번호 <input :value="selectedRsltNo" class="form-control" id="input" readonly style="background-color: #eee;" />
      <hr style="margin-left:-75px;">

      라인번호 <input :value="selectedLineId" class="form-control" id="input" readonly style="background-color: #eee;" />
      제품명 <input :value="selectedProductName" class="form-control" id="input" readonly
        style="background-color: #eee;" />
      작성일자 <input :value="selectedInsDate" class="form-control" id="input" readonly style="background-color: #eee;" />
      검사자 <input :value="selectedInsDev" class="form-control" id="input" readonly style="background-color: #eee;" />
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
    <table class="table table-bordered text-center"  ref="resultTable">
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

  <!-- 제품 검색 모달 -->
  <PrdGetSelModal v-if="showProductModal" :prodList="prodList" @select-product="handleSelectedProduct"
    @close="showProductModal = false" />
</template>

<script>
import axios from 'axios';
import useDateUtils from '@/utils/useDates.js' // 날짜 포맷 유틸
import { ref } from 'vue';
import PrdGetSelModal from '@/views/qualitys/PrdGetRsltSelModal.vue'; // 모달

// 반응형 객체 선언 : 원시타입    
const isUpdated = ref(false);

export default {
  components: { PrdGetSelModal },
  data() {
    return {
      searchQuery: '',             // 제품검색
      selectedLineId: '',          // 라인번호
      selectedProductName: '',     // 제품명
      selectedInsDate: this.getToday(),     // 날짜
      selectedInsDev: '',          // 검사자
      newItemList: [],
      spmInsStdList: [],
      prodList: [],
      rsltMaster: null,
      rsltDetailList: [],
      showProductModal: false,
      newItem: [],
      overallJdg: '',
      selectedRsltNo: '', // 성적서 번호
    };
  },
  created() {
   this.selectedInsDev = localStorage.getItem('username') || '';
  },
  methods: {

    // pdf
    async downloadPdf() {
      try {
        // 템플릿 파일을 가져옴
        const response = await axios.get('/spmInsGetRslt.html');
        let templateHtml = response.data;

        // 동적으로 데이터를 템플릿에 삽입
        const detailList = this.rsltDetailList || [];
        const tableRows = detailList.map(item => `
  <tr>
    <td>${item.ins_itm}</td>
    <td>${item.ins_mthd}</td>
    <td>${item.mgr_rslt}</td>
    <td>${this.getJdgName(item.jdg)}</td>
    <td>${item.rmk || ''}</td>
  </tr>
`).join('');

        let judgeButton = '';
        if (this.rsltMaster?.ovr_jdg === 'n1') {
          judgeButton = '<button class="jdg-btn btn-green">합격</button>';
        } else if (this.rsltMaster?.ovr_jdg === 'n2') {
          judgeButton = '<button class="jdg-btn btn-red">불합격</button>';
        }
        templateHtml = templateHtml
          .replace('{{ prd_no }}', this.searchQuery || 'N/A')
          .replace('{{ rslt_no }}', this.selectedRsltNo || 'N/A')
          .replace('{{ line_id }}', this.selectedLineId || 'N/A')
          .replace('{{ prd_nm }}', this.selectedProductName || 'N/A')
          .replace('{{ table_rows }}', tableRows)
          .replace('{{ ins_date }}', this.selectedInsDate || new Date().toLocaleDateString())
          .replace('{{ ins_dev }}', this.selectedInsDev || 'N/A')
          .replace('{{ quality_id }}', this.selectedRsltNo || 'N/A')
          .replace('{{ pur_ord_no }}', this.searchPurOrdNo || 'N/A')
          .replace('{{ vdr_nm }}', this.selectedVdrNm || 'N/A')
          .replace('{{ date }}', this.selectedInsDate || new Date().toLocaleDateString())
          .replace('{{ mgr_count }}', this.rsltMaster?.mgr_count ?? '')
          .replace('{{ succ_count }}', this.rsltMaster?.succ_count ?? '')
          .replace('{{ dft_count }}', this.rsltMaster?.dft_count ?? '')
          .replace('{{ ovr_jdg }}', this.rsltMaster?.ovr_jdg ?? '')
          .replace('{{ table_rows }}', tableRows)
          .replace('{{ judge_button }}', judgeButton)

        // 임시 DOM에 HTML 추가
        const tempElement = document.createElement('div');
        tempElement.innerHTML = templateHtml;
        document.body.appendChild(tempElement);

        // PDF로 변환
        const opt = {
          margin: 0.3,
          filename: `품질성적서_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // PDF 다운로드
        await html2pdf().set(opt).from(tempElement).save();

        // 변환 후 임시 DOM 제거
        document.body.removeChild(tempElement);
      } catch (err) {
        console.error("PDF 다운로드 실패:", err);
      }
    },
    async matQualityViewDropDown() {
      let ajaxRes =
        await axios.get(`/api/matQualityViewDropDown`)
          .catch(err => console.log(err));
      this.matQualityViewDropdown = ajaxRes.data;
    },







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
  this.rsltMaster = res.data.master;
  this.rsltDetailList = res.data.detail;
  this.selectedRsltNo = this.rsltMaster?.rslt_no || '';

  // 검사자명 추가로 불러오기
  if (this.selectedRsltNo) {
    const empRes = await axios.get('/api/spmInsGetRslt/withEmp', { params: { rslt_no: this.selectedRsltNo } });
    // getSpmInsRslt1은 여러 row가 나올 수 있으니 첫 번째 row의 nm 사용
    this.selectedInsDev = empRes.data[0]?.nm || '';
  }
    },

    // 모달
    showModal() {
      this.showProductModal = true; // 모달 열기
    },
    hideModal() {
      this.showProductModal = false; // 모달 닫기
    },
    openProductModal() {
      axios.get('/api/spmInsGetRsltRouter/prdList') // 제품 목록 가져오기
        .then(res => {
          console.log('제품목록:', res.data);
          this.prodList = Array.isArray(res.data) ? res.data : []; // 배열인지 확인 후 설정
          this.showProductModal = true; // 모달 열기
        })
        .catch(err => {
          console.error('제품 목록 불러오기 실패', err);
          this.prodList = []; // 실패 시 빈 배열로 설정
        });
    },

    // 제품 선택 시
    async handleSelectedProduct(item) {
      this.selectedLineId = item.ln_opr_no;
      this.selectedProductName = item.prd_nm;
      this.searchQuery = item.prd_no;
      this.selectedInsDate = this.getToday();
      this.showProductModal = false;

      // 성적서 상세정보 불러오기
      await this.fetchRsltDetail(item.prd_no, item.ln_opr_no);
    },
    // 기준서 목록 가져오기
    async getSpmInsStdList(prd_no) {
      try {
        const result = await axios.get('/api/spmGetInsStd', { params: { prd_no } });
        this.spmInsStdList = result.data;
        // 행 개수만큼 입력값 배열 초기화 (반응형)
        this.newItemList = this.spmInsStdList.map(() => ({
          mgr_rslt: '',
          rmk: ''
        }));
      } catch (err) {
        alert('기준서 목록을 가져오는 중 오류가 발생했습니다.');
      }
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
</style>