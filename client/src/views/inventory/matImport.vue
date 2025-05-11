<template>

<div class="col-md-10 p-4">
      <h4 class="mb-4">입고처리</h4>
      <!-- 출하지시 입력 폼 -->
      <div class="row mb-3 g-3">
        <div class="col-md-3">
          <label class="form-label">유통기한</label>
          <input v-model="expDt"  type="date" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">숫자임!수령자</label>
          <input v-model="rcvr" type="number" class="form-control">
        </div>
        <div class="col-md-3">
          <label class="form-label">숫자임!처리자</label>
          <input v-model="prcsr" type="number" class="form-control">
        </div>
        <!--거래처변경  -->
        <!-- <div v-if="selectVdr.vdr_no>0" class="col-md-3">
          <label class="form-label">거래처코드</label>
           <input v-model="selectVdr.vdr_no"type="number" class="form-control" >
        </div>
          <div v-else class="col-md-3">
          <label class="form-label">거래처코드</label>
           <input v-model="selectVdr"type="number" class="form-control" >
        </div>               -->
        <div class="col-md-3">
          <label class="form-label">숫자임 !창고번호</label>
          <input type="number" v-model="wareNo" class="form-control" >
        </div>
        <div class="col-md-3">
          <label class="form-label">숫자임! 수령방법</label>
          <input v-model="rcvrMth" type="number" class="form-control">
        </div>
      </div>
<!-- <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-outline-secondary w-100" @click="showVdrModal = true">거래처변경</button>
        </div> -->
 <!-- <vdr-select-modal
      v-if="showVdrModal"
      :vdr-list="vdr"
      :selected="selectVdr"
      @select-vdr="handleVdrSelect"
      @close="showVdrModal = false"
    /> -->
<p>{{ checkPur }}</p>
<p>{{ purOrdNo }}</p>
      <!-- 제품 목록 테이블 -->
      <table class="table table-bordered text-center mt-4">
        <thead class="table-light">
          <tr>
            <th><input type="checkbox"/></th>
            <th>발주번호</th>
            <th>자재ID</th>
            <th>자재명</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr v-for="(item,index) in ords">
            <td><input type="checkbox" 
                 :value="item"
                 v-model="checkOrd"
                 @change="handleCheckChange" /></td>
            <td>{{ item.ord_no}}</td>
            <td>{{item.vdr_no  }}</td>
            <td>{{ item.prd_no }}</td>
            <td>{{ item.prd_qty }}</td>
          </tr> -->
         
<tr v-for="(item,index) in purToLotStatus">
     <td><input type="checkbox" 
                 :value="item"
                 v-model="checkPur"
                 @change="handleCheckChange" /></td>
            <td>{{ item.pur_ord_no}}</td>
            <td>{{item.mat_no  }}</td>
            <td>{{ item['자재명'] }}</td>
            <td>{{ item.qty }}</td>
 </tr> 
        </tbody>
      </table>
      <!-- 자재입고 버튼 -->
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-primary" @click="saveImport">자재입고</button>
        <!-- @click="saveLot"  --> 
      </div>
    </div>



</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
    mode:'basic', //체크하기   
    purToLotStatus:[], //입고검사하고 lot대기하는 애들 
    checkPur:[], //발주 -> lot 대기하는 애들중에 체크되는 애들 
    //프론트 -> 서버로 넘겨야함      
    purOrdNo:0, //발주번호 
    matNo:'',//자재번호
    wareNo:0, //창고번호     
    expDt:'', //유통기한
    prcsr:'', //처리자 - 로그인 한 사람  
    rcvr:0, //수령자 
    rcvrMth:'', //수령방법 
    
    };
  },
  async created(){
  const result= await axios.get('/api/ordToLot')
   this.purToLotStatus=result.data;  
  }, 
  methods:{
    async saveImport(){
        const payLoad={
            mat_no:this.checkPur[0]?.mat_no,//자재번호
            //현재재고....  cur_stk,prc_qty,qty 모두 공통 
            qty:this.checkPur[0]?.qty,
            //입고일자,처리일시,일자,  
            warehouse_no:this.wareNo, //창고번호 
            cnsm_lmt_dt:this.expDt, //유통기한
            unt_prc:this.checkPur[0]?.unt_prc,//단가
            pur_ord_no:this.purOrdNo, //발주번호,비고(입고시발주번호) 
            prcsr:this.prcsr, //처리자 
            vdr_no:this.checkPur[0]?.vdr_no, //거래처번호
            rcvr:this.rcvr, 
            rcv_mthd:this.rcvrMth //수령방법  
        } 
        try{
            await axios.post('/api/addMatImport',payLoad);
            alert('자재입고완료'); 
        }catch(err){
             alert('실패 ㅠㅠ '); 

        }    
    }, 
    handleCheckChange(){
        if(this.checkPur.length===1){
            const item=this.checkPur[0]; 
            this.mode='checked';
            this.purOrdNo=item.pur_ord_no;

        }else{
            this.mode='basic'  
            alert('하나의 발주건만 선택해주세요');
            return;  
        }

    }

  },

}

</script>