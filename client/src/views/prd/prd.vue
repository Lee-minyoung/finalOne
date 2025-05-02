<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 제품 목록 (박스 추가) -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between mb-3">
            <input type="text" class="form-control w-50" placeholder="제품명 검색..." v-model="searchQuery" />
            <select class="form-select w-25" v-model="selectedFilter">
              <option value="">전체</option>
              <option value="제품">제품</option>
              <option value="부품">부품</option>
            </select>
          </div>
        <div class="card p-3">
          
          <!-- 검색 및 필터 -->
          
          <h4>제품 목록</h4>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>제품 번호</th>
                <th>제품명</th>
                <th>제품 유형</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" @click="selectProduct(product)"
                class="table-hover">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 상세 보기 (박스 추가, 버튼 위 배치) -->
      <div class="col-md-6">
        <div class="d-flex justify-content-between mb-3">
            <div>
              <button class="btn btn-primary me-2" @click="addProduct">추가</button>
              <button class="btn btn-danger" @click="deleteProduct">삭제</button>
            </div>
            <div>
              <button class="btn btn-warning me-2" @click="resetForm">초기화</button>
              <button class="btn btn-success" @click="saveProduct">저장</button>
            </div>
          </div>
        <div class="card p-3">
          <!-- 버튼 정렬 -->
          
          <h4>상세 보기</h4>
          <div v-if="selectedProduct">
            <div v-for="(value, key) in selectedProduct" :key="key" class="mb-3">
              <label class="form-label">{{ key }}</label>
              <input type="text" class="form-control" v-model="selectedProduct[key]" :readonly="['id', 'registrationDate', 'lastModifiedDate'].includes(key)" />
            </div>
          </div>
          <div v-else>
            <p> 제품을 선택하세요!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      searchQuery: "",
      selectedFilter: "",
      products: [
        { id: "P-001", name: "백미밥 작은밥(130g)", type: "제품", shelfLife: 9, stock: 5000, registrationDate: "2025-04-21", lastModifiedDate: "2025-04-21" },
        { id: "P-002", name: "백미밥 중간밥(210g)", type: "제품", shelfLife: 9, stock: 3000, registrationDate: "2025-04-21", lastModifiedDate: "2025-04-21" },
        { id: "P-003", name: "백미밥 큰밥(300g)", type: "부품", shelfLife: 9, stock: 2000, registrationDate: "2025-04-21", lastModifiedDate: "2025-04-21" }
      ],
      selectedProduct: null,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedFilter === "" || product.type === this.selectedFilter)
      );
    }
  },
  methods: {
    selectProduct(product) {
      this.selectedProduct = { ...product };
    },
    addProduct() {
      alert("새 제품 추가 기능을 구현하세요!");
    },
    deleteProduct() {
      if (this.selectedProduct) {
        this.products = this.products.filter(p => p.id !== this.selectedProduct.id);
        this.selectedProduct = null;
      } else {
        alert("삭제할 제품을 선택하세요!");
      }
    },
    resetForm() {
      this.selectedProduct = null;
    },
    saveProduct() {
      alert("저장 기능을 추가하세요!");
    }
  }
};
</script>

<style>
.table-hover:hover {
  cursor: pointer;
}
.card {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>

