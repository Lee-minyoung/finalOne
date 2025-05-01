<template>
  
  <h3>자재현황파악</h3>
  <table class="table">
  <thead>
    <tr>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">총필요량</th>
      <th scope="col">현재고</th>
      <th scope="col">부족수량</th>
      <th scope="col">상태</th>    
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>Otto</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
   
    
  </tbody>
</table>

<h3>자재구매계획</h3>
  <table class="table">
  <thead>
    <tr>
      <th scope="col">계획ID</th>
      <th scope="col">자재ID</th>
      <th scope="col">자재명</th>
      <th scope="col">수량</th>
      <th scope="col">단가</th>
      <th scope="col">총가격</th>
      <th scope="col">도착예정일</th>
      <th scope="col">거래처</th>
      <th scope="col">생산계획</th>
      <th scope="col">발주</th>            
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>
        <div>
        <!--생산계획 보는 모달창 띄우기-->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      생산계획
    </button>
  </div>

  <!-- 주문 등록 모달 -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">생산계획</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
       

        

          <!-- 제품 리스트 테이블 -->
         
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        
        </div>
      </div>
    </div>
  </div>
      </td> 
    <td>
      <button class="btn btn-success rounded-pill px-3" type="button">발주하기</button>
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
      inventoryData: []
    };
  },
  methods: {
    // fetchInventoryData() {
    //   axios.get('/api/inventory')
    //     .then(response => {
    //       this.inventoryData = response.data;
    //     })
    //     .catch(error => {
    //       console.error('Error fetching inventory data:', error);
    //     });
    // }
  },
  mounted() {
  //  this.fetchInventoryData();
  }
};


</script>