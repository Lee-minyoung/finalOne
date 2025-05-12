<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">입고검사성적서</h2>
    </div>
    <!-- 조회 조건 -->
    <div class="input">
      자재검색 <input v-model="searchQuery" class="form-control" placeholder="" readonly />
      <button class="btn btn-outline-secondary" @click="openLotModal" style="margin-right:501px;">🔍</button>
      성적서번호 <input :value="selectedRsltNo" class="form-control" readonly style="background-color: #eee;" />
      <hr style="margin-left:-75px;">
      LOTNo <input :value="selectedLotNo" class="form-control" id="input" readonly style="background-color: #eee; margin-right: 180px;" />
      발주번호 <input :value="searchPurOrdNo" class="form-control" id="input" readonly style="background-color: #eee; margin-right: 180px;" />
      납입업체 <input :value="selectedVdrNo" class="form-control" readonly style="background-color: #eee;" />
      <br>
      자재명 <input :value="selectedMatNm" class="form-control" id="input" readonly style="background-color: #eee; margin-right: 180px;" />
      작성일자 <input :value="selectedInsDate" class="form-control" id="input" readonly style="background-color: #eee; margin-right: 197px;" />
      검사자 <input :value="selectedInsDev" class="form-control" id="input" readonly style="background-color: #eee;" />
    </div>
    <br>
    <div class="middle">
    <!-- 수량 입력 -->
    <table class="table table-bordered text-center" id="table">
      <thead class="table-light">
        <tr>
          <th>결점구분</th>
          <th>검사량</th>
          <th>합격량</th>
          <th>불합격량</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>수량</td>
          <td><input v-model="newItem.mgr_count" class="form-control" placeholder="검사량" /></td>
          <td><input v-model="newItem.succ_count" class="form-control" placeholder="합격량" /></td>
          <td><input v-model="newItem.acpt_count" class="form-control" placeholder="불량량" /></td>
        </tr>
      </tbody>
    </table>
    <!-- 종합판정 -->
    <div class="rst">
      <div class="hstack gap-3">
        <div style="padding-left:50px;">종합판정</div>
        <div class="vr"></div>
        <button
          :class="['jdg-btn', overallJdg === '합격' ? 'btn-green' : '']"
          @click="overallJdg = '합격'"
          style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;"
        >합격</button>
        <button
          :class="['jdg-btn', overallJdg === '불합격' ? 'btn-red' : '']"
          @click="overallJdg = '불합격'"
          style="width:150px; height:100px; border-radius: 5px; border-color:lightgray;"
        >불합격</button>
      </div>
    </div>
    </div>
    <h5>검사결과</h5>
    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>검사항목</th>
          <th>검사기준</th>
          <th>검사결과</th>
          <th>판정</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in incInsStdList" :key="item.inc_ins_std_no">
          <td>{{ item.ins_itm }}</td>
          <td>{{ item.ins_mthd }}</td>
          <td>
            <input v-model="newItemList[index].mgr_rslt" class="form-control" placeholder="검사결과" />
          </td>
          <td>
            {{ getJdg(item, newItemList[index].mgr_rslt) }}
          </td>
          <td>
            <input v-model="newItemList[index].rmk" class="form-control" placeholder="비고"/>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="center-button">
      <button class="btn btn-primary" @click="incInsRsltInsert">성적서 반영</button>
    </div>
    <!-- LOT 검색 모달 -->
    <MatRsltSelModal v-if="showLotModal" :lotList="lotList" @select-lot="handleSelectedLot" @close="showLotModal = false" />
  </div>
</template>

<script>
import axios from 'axios';
import MatRsltSelModal from '@/views/qualitys/MatRsltSelModal.vue';

export default {
  components: { MatRsltSelModal },
  data() {
    return {
      searchQuery: '',
      selectedLotNo: '',
      selectedMatNm: '',
      selectedInsDate: this.getToday(),
      newItemList: [],
      incInsStdList: [],
      lotList: [],
      showLotModal: false,
      newItem: {},
      overallJdg: '',
      selectedRsltNo: '',
    };
  },
  created() {
    this.selectedInsDev = localStorage.getItem('username') || '';
  },
  methods: {
    async incInsRsltInsert() {
      if (!this.selectedRsltNo) {
        alert('성적서 번호가 없습니다.');
        return;
      }
      let obj = {
        rslt_no: this.selectedRsltNo,
    mgr_count: this.newItem.mgr_count,
    acpt_qty: this.newItem.acpt_qty,    // 합격량
    rjct_qty: this.newItem.rjct_qty,    // 불량량
    ovr_jdg: this.overallJdg,           // 종합판정
    rmk: this.newItem.rmk,
    pur_ord_no: this.selectedLotNo      // 발주번호
  };
  try {
    let result = await axios.post("/api/incInsRslt", obj);
    if (result.data.isSuccessed) {
      alert('등록되었습니다.');
      // 추가 작업
    } else {
      alert('등록 실패: ' + (result.data.message || ''));
    }
  } catch (err) {
    alert('등록 중 오류가 발생했습니다.');
  }
},
    
     parseNumber(str) {
      // 앞부분의 숫자만 추출 (예: "200g" → 200)
      const match = String(str).match(/^(\d+(\.\d+)?)/);
      return match ? Number(match[1]) : NaN;
    },
    getJdg(item, mgr_rslt) {
      if (mgr_rslt === '' || mgr_rslt === null || mgr_rslt === undefined) return '';
      const std = this.parseNumber(item.ins_mthd);
      const tol = this.parseNumber(item.ins_spc);
      const result = this.parseNumber(mgr_rslt);

      if (!isNaN(std) && !isNaN(tol) && !isNaN(result)) {
        const min = std - tol;
        const max = std + tol;
        return (result >= min && result <= max) ? '적합' : '부적합';
      }
      if (mgr_rslt === '1' || mgr_rslt === 1) return '적합';
      if (mgr_rslt === '0' || mgr_rslt === 0) return '부적합';
      return '';
    },
    getToday() {
      const today = new Date();
      return today.toISOString().slice(0, 10);
    },
    openLotModal() {
      axios.get('/api/incInsRslt/lotList')
        .then(res => {
          this.lotList = Array.isArray(res.data) ? res.data : [];
          this.showLotModal = true;
        })
        .catch(err => {
          this.lotList = [];
        });
    },
    async handleSelectedLot(item) {
      this.selectedLotNo = item.lot_no;
      this.selectedMatNm = item.mat_nm;
      this.searchQuery = item.mat_no; // 자재번호
        this.searchPurOrdNo = item.pur_ord_no;      // 발주번호
  this.selectedVdrNo = item.vdr_no;     // 납입업체
      this.selectedInsDate = this.getToday();
      this.showLotModal = false;
      // 성적서 번호 자동 할당
      try {
        const res = await axios.get('/api/incInsRslt/lastRsltNo');
        const lastNo = res.data.lastNo || 0;
        const nextNo = String(Number(lastNo) + 1).padStart(3, '0');
        this.selectedRsltNo = `ISJ-${nextNo}`;
      } catch (err) {
        this.selectedRsltNo = 'ISJ-001';
      }
      this.getIncInsStdList(item.mat_no);
    },
    async getIncInsStdList(mat_no) {
  try {
    const result = await axios.get('/api/incInsStd', { params: { mat_no } });
    this.incInsStdList = result.data;
    this.newItemList = this.incInsStdList.map(() => ({
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
  margin-top : 7px;
}

.btn {
  margin: 5px;
}

.btn1 {
  float: right;
}

#table {
  width:650px;
  height:130px;
  margin-right:20px;
}
.rslInput{
  width:100px;
}
.middle {
  display: flex;
}
.rst{
  width:650px;
  height:130px;
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