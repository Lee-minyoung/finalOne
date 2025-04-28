<template>
  <!-- 좌측 영역 시작 -->
  <div class="col-md-6">
    <!-- 좌측 검색 및 필터 영역 시작 -->
    <div class="d-flex justify-content-between mb-3">
        <input type="text" class="form-control w-50" placeholder="부서명 검색..." v-model="searchQuery" />
        <!-- <select class="form-select w-25" v-model="selectedFilter">
          <option value="">전체</option>
          <option value="토끼부">토끼부</option>
          <option value="거북이부">거북이부</option>
        </select> -->
    </div> <!-- 좌측 검색 및 필터 영역 끝 -->
    <!-- 좌측 리스트 영역 시작 -->
    <div class="card p-3">
      <h4>부서 목록</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>부서번호</th>
              <th>부서명</th>
              <th>부서관리자</th>
              <th>사용여부</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dept in filteredDeptList" :key="dept.dept_no" @click="selectDept(dept)" class="table-hover">
              <td>{{ dept.dept_no }}</td>
              <td>{{ dept.dept_nm }}</td>
              <td>{{ dept.dept_mgr }}</td>
              <td>{{ dept.use_yn }}</td>
            </tr>
          </tbody>
        </table>
    </div> <!-- 좌측 리스트 영역 끝 -->
  </div> <!-- 좌측 영역 시작 끝 -->
</template>
