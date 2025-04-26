<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
  <div class="d-flex gap-4">
    <h2 class="mb-4">생산 계획 관리</h2>
  </div>
  <div class="d-flex gap-2">
    <button class="btn btn-primary">재고/지시현황</button>
    <button class="btn btn-primary" @click="addPlan">등록</button>
    <button class="btn btn-primary">주문현황</button>
    <button class="btn btn-primary">계획지시</button>
  </div>
</div>
      <table class="table table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>NO</th>
            <th>제품명</th>
            <th>계획수량</th>
            <th>계획시작일자</th>
            <th>계획종료일자</th>
            <th>상태</th>
            <th>비고</th>

          </tr>
        </thead>
        <tbody>
          <!-- 리스트 출력 -->
          <tr v-for="(item) in prodPlanList" :key="item.pdn_pln_no">
            <td>{{ item.pdn_pln_no }}</td>
            <td>{{ item.prd_no }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ dateFormat(item.st_dt, 'yyyy년 MM월 dd일') }}</td>
            <td>{{ dateFormat(item.end_dt, 'yyyy년 MM월 dd일') }}</td>
            <td>{{ item.situ }}</td>
            <td>{{ item.rmk }}</td>

          </tr>
  
          <!-- 등록용 입력 라인 -->
          <tr>
            <td></td>
            <!--제품명을 검색해서 넣을 수 있게 할까요? ID 입력으로 되어있는데 편의상 어떤게 좋을까요?-->
            <td><input v-model="form.prd_no" class="form-control" placeholder="제품ID 입력" /></td>
            <td><input v-model.number="form.qty" type="number" class="form-control" placeholder="수량" /></td>
            <td><input v-model="form.st_dt" type="date" class="form-control" /></td>
            <td><input v-model="form.end_dt" type="date" class="form-control" /></td>
            <td></td>
            <td><input v-model="form.rmk" class="form-control" placeholder="비고 입력" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>


  <script>
  import useDateUtils from '@/utils/useDates.js';
  import axios from 'axios'
  
  export default {
    name: 'ProductionPlan',
  
    data() {
      return {
        prodPlanList: [],
        form: {
          pdn_pln_no:'',
          prd_no: '',
          qty: '',
          st_dt: '',
          end_dt: '',
          rmk: '',
        }
      }
    },
    computed :{
        count(){
            return this.prodPlanList.length;
        }

    },
    created(){
        this.getProdPlanList();
    },
  
    methods: {

      async getProdPlanList() {
        try {
          let result = await axios.get('/api/prodpln')
                                      .catch(err=> console.log(err))
          this.prodPlanList = result.data
        } catch (err) {
          console.error('리스트 불러오기 실패', err)
        }
      },

      dateFormat(value, format){
            return useDateUtils.dateFormat(value,format);
        },
  
      async addPlan() {
        if (!this.form.prd_no || !this.form.qty || !this.form.st_dt || !this.form.end_dt) {
          alert('모든 필수 항목을 입력하세요.')
          return
        }
  
        try {
          await axios.post('/api/prodpln', {
            ...this.form,
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
          alert('등록 성공!')
          this.form = { prd_no: '', qty: '', st_dt: '', end_dt: '', rmk: '' } // 입력값 초기화
          this.getProdPlanList() // 리스트 새로고침
        } catch (err) {
          console.error('등록 실패', err)
          alert('등록 실패 ㅠㅠ')
        }
      },
    },
  
    mounted() {
    //   this.getProdPlanList()

    
    }
  }
  </script>


  <style scoped>
  h2 {
    font-weight: bold;
    text-align: left;
  }
  </style>
  
<!-- 
  <template>
    <CContainer class="mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="m-0">생산 계획 관리</h2>
        <div class="d-flex gap-2">
          <CButton color="primary">재고/지시현황</CButton>
          <CButton color="primary" @click="addPlan">등록</CButton>
          <CButton color="primary">주문현황</CButton>
          <CButton color="primary">계획지시</CButton>
        </div>
      </div>
  
      <CTable bordered align="middle" class="text-center">
        <CTableHead class="table-light">
          <CTableRow>
            <CTableHeaderCell>NO</CTableHeaderCell>
            <CTableHeaderCell>제품명</CTableHeaderCell>
            <CTableHeaderCell>계획수량</CTableHeaderCell>
            <CTableHeaderCell>계획시작일자</CTableHeaderCell>
            <CTableHeaderCell>계획종료일자</CTableHeaderCell>
            <CTableHeaderCell>상태</CTableHeaderCell>
            <CTableHeaderCell>비고</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
  
        <CTableBody>

          <CTableRow v-for="(item, index) in prodPlanList" :key="item.pdn_pln_no">
            <CTableDataCell>{{ index + 1 }}</CTableDataCell>
            <CTableDataCell>{{ item.prd_no }}</CTableDataCell>
            <CTableDataCell>{{ item.qty }}</CTableDataCell>
            <CTableDataCell>{{ dateFormat(item.st_dt, 'yyyy년 MM월 dd일') }}</CTableDataCell>
            <CTableDataCell>{{ dateFormat(item.end_dt, 'yyyy년 MM월 dd일') }}</CTableDataCell>
            <CTableDataCell>{{ item.situ }}</CTableDataCell>
            <CTableDataCell>{{ item.rmk }}</CTableDataCell>
          </CTableRow>
  

          <CTableRow>
            <CTableDataCell>#</CTableDataCell>
            <CTableDataCell>
              <CFormInput v-model="form.prd_no" placeholder="제품ID 입력" />
            </CTableDataCell>
            <CTableDataCell>
              <CFormInput v-model.number="form.qty" type="number" placeholder="수량" />
            </CTableDataCell>
            <CTableDataCell>
              <CFormInput v-model="form.st_dt" type="date" />
            </CTableDataCell>
            <CTableDataCell>
              <CFormInput v-model="form.end_dt" type="date" />
            </CTableDataCell>
            <CTableDataCell>-</CTableDataCell>
            <CTableDataCell>
              <CFormInput v-model="form.rmk" placeholder="비고 입력" />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CContainer>
  </template>
   -->

<!-- 
   <script>
import { CContainer, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput } from '@coreui/vue'
import useDateUtils from '@/utils/useDates.js'
import axios from 'axios'

export default {
  name: 'ProductionPlan',
  components: {
    CContainer, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput
  },
  data() {
    return {
      prodPlanList: [],
      form: {
        pdn_pln_no: '',
        prd_no: '',
        qty: '',
        st_dt: '',
        end_dt: '',
        rmk: '',
      }
    }
  },
  computed: {
    count() {
      return this.prodPlanList.length;
    }
  },
  created() {
    this.getProdPlanList()
  },
  methods: {
    async getProdPlanList() {
      try {
        let result = await axios.get('/api/prodpln').catch(err => console.log(err))
        this.prodPlanList = result.data
      } catch (err) {
        console.error('리스트 불러오기 실패', err)
      }
    },
    dateFormat(value, format) {
      return useDateUtils.dateFormat(value, format)
    },
    async addPlan() {
      if (!this.form.prd_no || !this.form.qty || !this.form.st_dt || !this.form.end_dt) {
        alert('모든 필수 항목을 입력하세요.')
        return
      }
      try {
        await axios.post('/api/prodpln', { ...this.form }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        alert('등록 성공!')
        this.form = { prd_no: '', qty: '', st_dt: '', end_dt: '', rmk: '' }
        this.getProdPlanList()
      } catch (err) {
        console.error('등록 실패', err)
        alert('등록 실패 ㅠㅠ')
      }
    }
  }
}
</script> -->
