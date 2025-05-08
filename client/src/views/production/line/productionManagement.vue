<template>
  <div class="container mt-4">
    <h2 class="mb-3">생산지시현황</h2>

    <table class="table table-bordered text-center">
      <thead class="table-light">
        <tr>
          <th>지시ID</th>
          <th>제품명</th>
          <th>지시수량</th>
          <th>지시일자</th>
          <th>지시자</th>
          <th>진행상황</th>
          <th>라인 지정</th>
          <th>지시 실행</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in instructionList" :key="item.pdn_ord_dtl_no">
          <td>{{ item.pdn_ord_no }}</td>
          <td>{{ item.prd_nm }}</td>
          <td>{{ item.ord_qty }}</td>
          <td>{{ dateFormat(item.pdn_ord_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ item.crt_by }}</td>
          <td>
            <span v-if="item.mat_ins_sts === 'q1'">입고대기</span>
            <span v-else-if="item.mat_ins_sts === 'q2'">입고완료</span>
            <span v-else>오류</span>
          </td>
          <td>
    <div class="d-flex align-items-center justify-content-center gap-2">
    <span v-if="item.selected_line">
      {{ item.selected_line }}
    </span>
    <span v-else class="text-muted">
      미지정
    </span>
    <button class="btn btn-light border" @click="openModal(item)">
  <i class="bi bi-search fs-4"></i> <!-- 🔍 돋보기 아이콘 -->
</button>
  </div>
</td>
          <td>
            <button class="btn btn-sm btn-primary" @click="assignLine(item)">지시</button>
          </td>
        </tr>
      </tbody>
    </table>

    <LineInstructionModal
  v-if="showLineModal"
  :item="selectedItem"
  :used-lines="usedLines"
  @set-line="setLine"
  @close="showLineModal = false"
/>
  </div>
</template>

<script>
// ---------------------여기부터 리뷰 -------------------------
import axios from 'axios'
import useDateUtils from '@/utils/useDates'
import LineInstructionModal from './LineInstructionModal.vue'

export default {
  components: { LineInstructionModal },

  data() {
    return {
      instructionList: [],    // 전체 생산지시 리스트
      selectedItem: null,     // 모달에서 선택한 지시 항목
      showLineModal: false    // 라인 선택 모달 표시 여부
    }
  },

  computed: {
    dateFormat() {
      return useDateUtils.dateFormat   // 날짜 포맷 함수 가져오기
    },

    usedLines() {
      // 이미 선택된 라인번호만 추출 (중복 방지 등에 활용 가능)
      return this.instructionList
        .filter(item => item.selected_line)
        .map(item => item.selected_line)
    }
  },

  created() {
    this.fetchInstructions()   // 컴포넌트 생성 시 지시 목록 불러오기
  },

  methods: {
    /**
     * 서버로부터 생산지시 목록을 불러와 instructionList 에 세팅
     * 각 항목에는 selected_line 초기화 필드 추가
     */
    async fetchInstructions() {
      const res = await axios.get('/api/prodinst')
      this.instructionList = res.data.map(row => ({
        ...row,
        selected_line: '' // 선택 라인 초기화 (UI에서 활용)
      }))
    },

    /**
     * 라인 선택 모달 열기
     * 1. 선택된 지시 항목을 복사해 selectedItem에 저장
     * 2. 해당 지시의 가능한 라인 목록을 서버에서 받아옴
     */
    openModal(item) {
      this.selectedItem = { ...item }  // 얕은 복사로 기본 정보 전달
      this.selectedItem.lineList = [] // 라인 목록 초기화

      axios.get('/api/lineDrop', {
        params: { pdn_ord_dtl_no: item.pdn_ord_dtl_no }
      }).then(res => {
        this.selectedItem.lineList = res.data
        this.showLineModal = true
      })
    },

    /**
     * 모달에서 선택한 라인을 실제 instructionList에 반영
     * (selectedItem은 일시적인 상태 객체임)
     */
    setLine(item) {
      const index = this.instructionList.findIndex(
        i => i.pdn_ord_dtl_no === item.pdn_ord_dtl_no
      )

      if (index !== -1) {
        this.instructionList[index].selected_line = item.selected_line
        console.log("✅ 반영된 라인:", item.selected_line, "→", this.instructionList[index])
      } else {
        console.warn("❗ 지시상세번호 못 찾음:", item.pdn_ord_dtl_no)
      }
    },

    /**
     * 선택된 라인을 서버에 실제로 지시 처리 요청
     * - 조건 1: 라인이 선택되어야 함
     * - 조건 2: 자재 입고 상태가 'q2'여야 가능
     */
    async assignLine(item) {
      if (!item.selected_line) {
        return alert('라인을 먼저 지정하세요.')
      }

      if (item.mat_ins_sts !== 'q2') {
        return alert('입고완료 상태에서만 지시 가능합니다.')
      }

      const payload = {
        pdn_ord_no: item.pdn_ord_no,
        line_no: item.selected_line
      }

      try {
        await axios.post('/api/prodinst/assign', payload)
        alert('지시 완료!')
        this.fetchInstructions()         // 지시 목록 갱신
        this.showLineModal = false       // 모달 닫기
      } catch (err) {
        console.error("❌ 지시 실패:", err)
        alert('지시 중 오류가 발생했습니다.')
      }
    }
  }
}
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
.selected-line {
  font-weight: 600;
  color: #198754; /* 부트스트랩 success 색상 */
}
</style>
