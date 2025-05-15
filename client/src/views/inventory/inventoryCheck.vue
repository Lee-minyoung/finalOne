<template>
  <h3>자재현황파악</h3>
  <table class="table table-bordered text-center" >
  <thead>
    <tr class="table-light">
      <th>출고요청번호</th>
      <th>자재명</th>
      <th>총필요량</th>
      <th>현재고</th>
      <th>부족수량</th>
    <!-- <th>상태</th> -->
      <th>자재출고</th>
    </tr>
  </thead>
  <tbody>
    <template v-for="(items, reqNo) in groupedInventory" :key="reqNo">
      <!-- ** 상단 요약 (클릭해서 토글) -->
      <tr class="table-primary" style="cursor: pointer;" @click="toggleAccordion(reqNo)">
        <td colspan="6" class="text-start">
          <span>
            <b>{{ isExpanded(reqNo) ? '▼' : '▶' }}</b>
            출고요청번호: <b>{{ reqNo }}</b> (자재 {{ items.length }}건)
            <button class="btn btn-success rounded-pill px-3" @click="checkMat(reqNo)"type="button">자재출고</button>
          </span>
        </td>
      </tr>

      <!-- ** 아코디언 하위 내용 -->
      <tr v-if="isExpanded(reqNo)" v-for="(item, idx) in items" :key="`${reqNo}-${idx}`">
        <td></td>
        <td>{{ item['자재명'] }}</td>

        <td v-if="item['단위']=='g'" >{{ item['총필요량']/1000 }}kg</td>
        <td v-else-if="item['단위']=='EA'" >{{ item['총필요량'] }}EA</td>
        <td v-else-if="item['단위']=='ml'" >{{ item['총필요량']/1000 }}L</td>
        <td v-else>{{ item['총필요량'] }}</td>

        <td v-if="item['단위']=='g'">{{ item['현재재고']/1000 }}kg</td>
        <td v-else-if="item['단위']=='EA'">{{ item['현재재고'] }}EA</td>
        <td v-else-if="item['단위']=='ml'" >{{ item['현재재고']/1000 }}L</td>
        <td v-else>{{ item['현재재고'] }}</td>

        

        <td v-if="item['단위']=='g'">{{ item['부족수량'] > 0 ? item['부족수량']/1000 : 0 }}kg</td>
        <td v-else-if="item['단위']=='EA'">{{ item['부족수량'] > 0 ? item['부족수량'] : 0 }}EA</td>
        <td v-else-if="item['단위']=='ml'">{{ item['부족수량'] > 0 ? item['부족수량']/1000 : 0 }}L</td>
        <td v-else>{{ item['부족수량'] > 0 ? item['부족수량'] : 0 }}</td>


<td>
 <template v-if="item['부족수량'] <= 0 && item['자재출고처리'] == 'q2'">
  <span class="badge bg-primary px-3 py-2 rounded-pill">출고완료</span>
</template>

<template v-else-if="item['부족수량'] >= 0 && (item['자재출고처리'] == 'q2' || reqClickedList.includes(item['계획ID'] + item['자재명']))">
  <span class="badge bg-info px-3 py-2 rounded-pill">요청완료</span>
</template>

<template v-else-if="item['부족수량'] > 0 && item['자재출고처리'] == 'q1' && !reqClickedList.includes(item['계획ID'] + item['자재명'])">
  <button class="btn btn-success rounded-pill px-3 py-2" @click="addPurOrd(item)" type="button">자재요청</button>
</template>

  
</td>
      </tr>
    </template>
  </tbody>
</table>

<h3>자재구매계획 </h3>
  <table class="table">
  <thead>
    <tr>
     
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">수량</th>
      <th scope="col">총가격</th>
      <th scope="col">거래처</th>
      <th scope="col">발주</th>            
    </tr>
  </thead>
  <tbody>
    <!-- 필터.. -->
    <tr v-for="(item,index) in inventoryPurPlan" :key="index">
      
      <td>{{ item['자재번호'] }}</td>
      <td>{{ item['자재명'] }}</td>
      <td>{{ item['총합'] }}</td>
      <td>{{ item['총가격'] }}</td>
      <td>{{ item['거래처명'] }}</td>
      <!--생산계획 버튼-->
     
<!--생산계획모달 end-->

    <td>
      <button class="btn btn-success rounded-pill px-3" @click="minCheckAndPurOrd(item['자재번호'],item['총합'],item['계획ID'])"  type="button">발주하기</button>
    </td>
    </tr> 
  </tbody>
</table>


</template>

<script>

import axios from 'axios';
 export default {
  name: 'InventoryCheck',
  data() {
    return {
      inventoryStatus: [], //자재현황조회 
      allPurPlan:[], //모든 자재구매계획 조회회
      inventoryPurPlan:[], //발주처리된 자재구매계획 조회 
      filteredPurPlan:[], //최소주문수량 이상인 자재구매계획 조회하기 
      min:'', //최소수량 
      rawData:[], 
      expandedReqNos: [], // ** 펼쳐진 출고요청번호 목록
      proPlnData:[],
      //자재요청클릭 
      reqClickedList: [],
      lotMinusDoneReqNo:[], //출고 마감 완료  
      plnToOrdNo:[], //
     
    };
  },
  async created(){
   await this.fetchInventoryStatus();
   await this.fetchInventoryPurPlan(); //자재구매계획 일단불러오기   
   await this.filteredPurPlanList(); //수량을 
 
 
  },
  // ** 지시번호별 번호 묶기
  computed: {
 groupedInventory() {
  const grouped = {};
  this.inventoryStatus.forEach(item => {
    const reqNo = item['계획ID'];
    if (!grouped[reqNo]) grouped[reqNo] = [];
    grouped[reqNo].push(item);
  });

  // 필터링 없이 전체 리턴
  return grouped;
}
  
   
  
},



  methods: {
   async fetchInventoryStatus(){
      try{
          const result=await axios.get('/api/inventory/mtStatus')
          this.inventoryStatus=result.data;
          console.log('자재현황조회 성공', this.inventoryStatus);
      }catch(error){
        console.error('자재출고요청 실패', error);
      } 
   },
   async fetchInventoryPurPlan(){
    try{
      const result=await axios.get('/api/getPurPlnChecked')
      //allPurPlan 모든 자재구매계획을 불러옴 
      this.allPurPlan=result.data; 
    
      // 자재구매계획 -> 발주 처리된 자재구매계획번호를 서버에서 불러옴  
      //  // 발주처리된 자재구매계획은 안보여지게함    
      const Nos=await axios.get('/api/PlnToOrd') //
      this.plnToOrdNo=Nos.data.map(p => p['계획ID']);
      console.log('allpurPlan',this.allPurPlan);
      console.log(this.plnToOrdNo); 
      this.inventoryPurPlan = this.allPurPlan.filter(p => !this.plnToOrdNo.includes(p['계획ID']));
     
    }catch(error){
      console.log('자재구매계획 실패',error); 
    }

   },
   async filteredPurPlanList(){
   
    const rawData=this.inventoryPurPlan; //item['자재ID']='M-001'
    console.log('필터링전 rawdata',rawData);
    const filtered=[]; //수량이  
    for (const item of rawData){
      const matId=item['자재ID']; 
      const minQty=await this.getMinOrdqty(matId);
    //   console.log('minQty',minQty.min_ord_qty); 
      // console.log('for문 minQty',minQty); 
      //  console.log('item수량'); 
      //  console.log(item['수량']); 
      if(item['수량']>= minQty.min_ord_qty){
        filtered.push(item); 
        // console.log('필터링배열',filtered); 
      }else{
       // console.log('최소주문수량보다 작음');
      }
    }//end of for 

    this.filteredPurPlan=filtered;
    //console.log('필터링된 자재구매계획',this.filteredPurPlan);
   
   },
   async getMinOrdqty(matId){
   
    try{ //
        const minqty=await axios.get('/api/inventory/minqty',{
          params:{
          matId:matId
        } 
        })
        console.log('minqty',minqty.data[0]); 
      return  minqty.data[0]; //최소량 return 
    }catch(error){
      console.log(error); 
    }
   },
   //발주하기 버튼 누르면 발주 처리됨 
   async addPurOrdByPlnNo(purPlnNo){
     try{
      const add=await axios.post('/api/inventory/purOrd',{
        params:{
          purPlnNo:purPlnNo
        }
      })
      console.log('발주버튼클릭'); 
      console.log(purPlnNo);
      console.log('add',add);
      //fetchInventoryPurPlan()
      await this.fetchInventoryPurPlan();
       return add;
        
     }catch(error){
      console.log(error,); 
     }

   },
   //** */ 아코디언 토글
   toggleAccordion(reqNo) {
    const idx = this.expandedReqNos.indexOf(reqNo)
    if (idx >= 0) this.expandedReqNos.splice(idx, 1)
    else this.expandedReqNos.push(reqNo)
  },
  // 아코디언 클릭 후 확인.
  isExpanded(reqNo) {
    return this.expandedReqNos.includes(reqNo)
  },
  //최소수량 체크후 발주하는 이벤트 
  async minCheckAndPurOrd(matId,qty,plnNo){
   const  result= await this.getMinOrdqty(matId); //해당 자재에 대한 최소수량 체크
   const min=result.min_ord_qty;
   console.log('최소수량',min); 
   if(qty>=min){
      await this.addPurOrdByPlnNo(plnNo); 
      alert('발주가 완료 되었습니다'); 
   } else{
    alert('최소수량을 넘기지 못해 주문할수 없습니다'); 
   }

  },
  //생산계획 모달창에서 자재ID로 생산계획 조회하기 일단 나중에.... 
  async fetchPrdPlanByMatId(matId){
    try{
      const result=await axios.get('/api/inventory/prdPlan',{
        params:{
          matId:matId
        }
      })
      this.proPlnData=result.data; 
      console.log('생산계획조회',this.proPlnData);
    }catch(error){
      console.log('생산계획조회 실패',error); 
    }
  },
  
  async checkMat(reqNo){
    //프론트에서 표시되는 자재 
    const matList=this.groupedInventory[reqNo];
    console.log('matList',matList);
    //출고가능자재 
    const availableMats = matList.filter(item => item['부족수량']<= 0);
    //자재구매계획 세워야하는 자재 
    //const purPlnMats=matList.filter(item=>item['부족수량']>0);


    try{
      const payload=availableMats.map(item=>({
        mat_no:item['자재ID'], 
        req_qty:item['총필요량'], 
        pln_id:item['계획ID']
      }))
      console.log('payload',payload);



      //서버에서 출고완료 됐는지 안됐는지 확인
      // 서버왜없지..?    
      // const matsts=await axios.get('/api/MatStatus',{params:{
      //   reqId:payload.pln_id,
      //   matId:payload.mat_no
      // }});
      // console.log('matsts',matsts);

      //우선 조건문문 풀기 
 
      // 출고가 가능한 애들은 우선 처리됨
    await axios.post('/api/inventory/lotMinusList',payload); //자재차감 되고 자재출고처리 -> q2로 변환 
      
          
    }catch(err){
        if(err.response && err.response.status===400){
          alert(err.response.data.message);
        }else{
          alert('서버오류가 부족합니다')
        }
    }
    console.log('availableMats',availableMats);
    // console.log('matList',matList);
    //출고완료된 재고는 removeList 
     // 모든 자재가 출고 가능한지 검사
    const allAvailable = matList.every(item => {
    const reqQty = parseFloat(item['총필요량']);
    const curQty = parseFloat(item['현재재고']);
   // console.log('allAvailabe실행중..',item);
   
    return curQty >= reqQty;
  });

  if (!allAvailable) {
    alert('일부 자재의 재고가 부족합니다.');
    return;
  }
    console.log('matList',matList); 
    // for(const item of matList){
    //  const plnId= item['계획ID'];
    //  const reqQty=item['총필요량']; 
    //  const curQty=item['현재재고']; //
    //  const matNo=item['자재ID']; 
    //  const minStk=item['최소재고량']; 
    //   //lot에 있는 현재재고가 더 많은경우  
    //  if(curQty>=reqQty){
    //   try{
    //      const res=await axios.post('/api/inventory/lotMinus',{
    //       mat_no:matNo, 
    //       req_qty:reqQty,
    //       pln_id:plnId
         
    //      });         

    //      if(curQty<minStk){
    //       console.log('자재구매계획으로 이동');

    //      }

    //      this.inventoryStatus=this.inventoryStatus.filter(item=>item['계획ID']!==reqNo);
    //      this.expandedReqNos=this.expandedReqNos.filter(id=>id!==reqNo);

    //      alert('출고가 완료 되었습니다'); 
      
    //   }catch(err){
    //     console.log(err); 
    //     alert('실패')
    //   }
    //  }
    //  //현재재고가 더 총필요량보다 적은경우 
    // //   else if(curQty<reqQty){

    // //  }
   
    

    // }
  },
  goToReqPage(item){
    
    console.log('자재요청item',item);
    this.$router.push({
      name:'MatReq',
      query:{
        matId:item['자재ID'], 
        matNm:item['자재명']
      } 
    });
  }, 
  //자재요청버튼클릭 -> 자재구매계획 insert하기
  async addPurOrd(item){
  console.log('자재요청item', item);
  try {
    const result = await axios.post('/api/inventory/purOrdByClickButton', {
      matId: item['자재ID'],
      vdrNo: item['대표거래처번호'],
      vdrNm: item['거래처명'],
      prc: item['단가'],
      qty: item['부족수량'],
      check: 'check', 
      reqId:item['계획ID'],
    });

    console.log('자재요청성공', result); 
    this.reqClickedList.push(item['계획ID'] + item['자재명']); //한페이지 안에서 머무르는건 가능.... 
    alert('자재요청이 완료 되었습니다');

      const Nos=await axios.get('/api/PlnToOrd') //
      this.plnToOrdNo=Nos.data.map(p => p['계획ID']);
      console.log('allpurPlan',this.allPurPlan);
      console.log(this.plnToOrdNo); 
      this.inventoryPurPlan = this.allPurPlan.filter(p => !this.plnToOrdNo.includes(p['계획ID']));  


  } catch (error) {
    console.log('자재요청실패', error); 
  }
}

//this.pur

}
}


</script>