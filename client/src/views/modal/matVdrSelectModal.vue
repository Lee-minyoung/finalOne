<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5); z-index: 1051;" @click.self="$emit('close')">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">대표거래처 선택</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex gap-2 align-items-center mb-2 justify-content-between">
            <div class="d-flex gap-2 align-items-center" style="flex:1;">
              <input type="text" class="form-control w-25" placeholder="상호명 검색" v-model="search" />
              <select class="form-select w-25" v-model="selectedFilter">
                <option value="">전체</option>
                <option value="b1">판매처</option>
                <option value="b2">구매처</option>
                <option value="b3">혼합</option>
                <option value="b4">외주처</option>
              </select>
            </div>
            <button class="btn btn-sm btn-primary" @click="$emit('select-vdr', selectedVdr)">거래처 등록</button>
          </div>
          <div class="table-container">
            <table class="table table-sm table-bordered text-center">
              <thead class="table-light">
                <tr>
                  <th class="w-10">거래처번호</th>
                  <th class="w-10">상호명</th>
                  <th class="w-10">사업자유형</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredVdrList" :key="item.vdr_no" @click="toggleVdrSelection(item)"
                  :class="{ 'table-primary': isSelected(item) }" style="cursor: pointer;">
                  <td class="w-10">{{ item.vdr_no }}</td>
                  <td class="w-10">{{ item.cpy_nm }}</td>
                  <td class="w-10">{{ ofcTypeFormat(item.ofc_tp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonCodeFormat from '@/utils/useCommonCode.js';

export default {
  props: {
    vdrList: Array,   // 전체 거래처 목록
    selected: Array   // 이미 등록된(선택된) 거래처번호
  },
  data() {
    return {
      search: '',
      selectedVdr: null,
      selectedFilter: '',
    }
  },
  computed: {
    filteredVdrList() {
      if (!this.vdrList) return []
      return this.vdrList.filter(vdr => {
        // 검색어 필터링
        const matchesSearch = !this.search || vdr.cpy_nm.toLowerCase().includes(this.search.toLowerCase());
        // 거래처유형 필터링
        const matchesFilter = this.selectedFilter === '' || vdr.ofc_tp === this.selectedFilter;
        return matchesSearch && matchesFilter;
      });
    }
  },
  created() {
    this.selectedVdr = this.selected ? { vdr_no: this.selected } : null;
  },
  methods: {
    matTypeFormat(code) {
      return CommonCodeFormat.matTypeFormat(code);
    },
    ofcTypeFormat(code) {
      switch(code) {
        case 'b1': return '판매처';
        case 'b2': return '구매처';
        case 'b3': return '혼합';
        case 'b4': return '외주처';
        default: return code;
      }
    },
    toggleVdrSelection(item) {
      if (this.selectedVdr && this.selectedVdr.vdr_no === item.vdr_no) {
        this.selectedVdr = null; // 선택 해제
      } else {
        this.selectedVdr = { 
          vdr_no: item.vdr_no, 
          cpy_nm: item.cpy_nm,
          ofc_tp: item.ofc_tp
        }; // 선택한 거래처로 대체
      }
    },
    isSelected(item) {
      return this.selectedVdr && this.selectedVdr.vdr_no === item.vdr_no;
    }
  },
}
</script>

<style scoped>
@import '@/assets/styles/base-table.css';
</style>
