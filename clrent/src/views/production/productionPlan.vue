<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">생산 계획 관리</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-primary">재고/지시현황</button>
        <button class="btn btn-success" @click="addPlan">등록</button>
        <button class="btn btn-primary">주문현황</button>
        <button class="btn btn-primary" @click="showModal= true">계획지시</button>
      </div>
    </div>


    <!-- 여기 모달창 추가 -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">재고/지시현황</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <p>여기에 재고/지시현황 내용을 보여줄 수 있어요.</p>
            <!-- 예시로 간단한 테이블 -->
            <table class="table table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th>품목명</th>
                  <th>재고수량</th>
                  <th>지시수량</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in inventoryList" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.order }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">닫기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 테이블 위치 -->
    <table class="table table-bordered text-center" style="min-width: 1200px;">
      <colgroup>
        <col style="width: 80px" />
        <col style="width: 150px" />
        <col style="width: 120px" />
        <col style="width: 160px" />
        <col style="width: 160px" />
        <col style="width: 120px" />
        <col style="width: 180px" />
        <col style="width: 100px" />
      </colgroup>

      <thead class="table-light">
        <tr>
          <th>NO</th>
          <th>제품명</th>
          <th>계획수량</th>
          <th>계획시작일자</th>
          <th>계획종료일자</th>
          <th>상태</th>
          <th>비고</th>
          <th>추가/삭제</th>
        </tr>
      </thead>

      <tbody>
        <!--  입력 줄 반복 -->
        <tr v-for="(row, index) in planRows" :key="'new-' + index">
          <td>신규</td>
          <td><input v-model="row.prd_no" class="form-control" placeholder="제품ID 입력" /></td>
          <td><input v-model.number="row.qty" type="number" class="form-control" placeholder="수량" /></td>
          <td><input v-model="row.st_dt" type="date" class="form-control" /></td>
          <td><input v-model="row.end_dt" type="date" class="form-control" /></td>
          <td><input class="form-control" value="계획완료" readonly /></td>
          <td><input v-model="row.rmk" class="form-control" placeholder="비고 입력" /></td>
          <td>
            <button class="btn btn-outline-danger btn-sm me-1" @click="removePlanRow(index)">삭제</button>
            <button class="btn btn-outline-primary btn-sm" @click="addPlanRow">+</button>
          </td>
        </tr>

        <!--  출력 줄 (DB에서 불러온 것) -->
        <tr
          v-for="item in prodPlanList" :key="item.pdn_pln_no"
          @click="togglePlanSelection(item)" :class="{ 'table-primary': isSelected(item) }"  style="cursor: pointer;"
        >
          <td>{{ item.pdn_pln_no }}</td>
          <td>{{ item.prd_no }}</td>
          <td>{{ item.qty }}</td>
          <td>{{ dateFormat(item.st_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ dateFormat(item.end_dt, 'yyyy-MM-dd') }}</td>
          <td>{{ item.situ }}</td>
          <td>{{ item.rmk }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import axios from 'axios'
import useDateUtils from '@/utils/useDates.js'

export default {
  data() {
    return {
      prodPlanList: [], // DB에 있는 계획 목록
      selectedPlans: [],// 사용자가 선택한(클릭한) 계획 리스트
      planRows: [        // 사용자가 입력하는 행들
        {
          prd_no: '',
          qty: '',
          st_dt: '',
          end_dt: '',
          rmk: '',
        }
      ]
    },
  },
  computed: {
  planSummaryByProduct() {
    const summary = {}

    for (const plan of this.selectedPlans) {
      const key = plan.prd_no
      const qty = Number(plan.qty || 0)
      const instruction = Number(plan.instruction_qty || 0)
      const status = plan.status || plan.situ

      if (!summary[key]) {
        summary[key] = {
          product: key,
          totalQty: 0,
          instructionQty: 0,
          doneQty: 0
        }
      }

      summary[key].totalQty += qty
      summary[key].instructionQty += instruction
      if (status === '완료' || status === '계획완료') {
        summary[key].doneQty += qty
      }
    }

    for (const key in summary) {
      summary[key].remainQty = summary[key].totalQty - summary[key].instructionQty
    }

    return Object.values(summary)
  }
},


  created() {
    this.getProdPlanList()
  },

  methods: {
    async getProdPlanList() {
      try {
        const result = await axios.get('/api/prodpln')
        this.prodPlanList = result.data
      } catch (err) {
        console.error('계획 목록 불러오기 실패', err)
      }
    },
    togglePlanSelection(plan) {
    const index = this.selectedPlans.findIndex(p => p.pdn_pln_no === plan.pdn_pln_no)
    if (index >= 0) {
      this.selectedPlans.splice(index, 1)  // 선택 해제
    } else {
      this.selectedPlans.push(plan)       // 선택 추가
    }
  },  isSelected(plan) {
    return this.selectedPlans.some(p => p.pdn_pln_no === plan.pdn_pln_no)
  },

    addPlanRow() {
      this.planRows.push({
        prd_no: '',
        qty: '',
        st_dt: '',
        end_dt: '',
        rmk: '',
        status: '계획완료'
      })
    },

    removePlanRow(index) {
      this.planRows.splice(index, 1)
    },

    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },

    async addPlan() {
      if (this.planRows.length === 0) {
        alert('입력된 계획이 없습니다.')
        return
      }

      try {
        for (let row of this.planRows) {
          if (!row.prd_no || !row.qty || !row.st_dt || !row.end_dt) {
            alert('필수 항목을 모두 입력하세요.')
            return
          }

          await axios.post('/api/prodpln', row, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
        }

        alert('등록 완료!')
        this.planRows = [
          {
            prd_no: '',
            qty: '',
            st_dt: '',
            end_dt: '',
            rmk: '',
            status: '계획완료'
          }
        ]
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        alert('등록 실패 ㅠㅠ')
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
  text-align: left;
}
.table td,
.table th {
  vertical-align: middle;
}
.table-primary {
  background-color: #cce5ff !important;
}
</style>