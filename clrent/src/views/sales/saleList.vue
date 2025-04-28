<template>
<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
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
import axios from 'axios'

export default{

 data(){
    return{
        ordList:[], 
    }
 },

methods: {
    async getOrdList(){
        try{
           let result=await axios.get('/api/ord')
                                     .catch(err => console.log(err))    
            this.ordList=result.data
        }catch(err){
            console.log('주문리스트 불러오기 실패',err)
        }

    }, 
},

mounted(){

}

}
</script>