<template>
  <div class="inventory-check">
    <h1>Inventory Check</h1>
    <p>This is the inventory check page.</p>
  </div>
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
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>John</td>
      <td>Doe</td>
      <td>@social</td>
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