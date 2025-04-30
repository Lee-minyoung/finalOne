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
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
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
      <td>@mdo</td>
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