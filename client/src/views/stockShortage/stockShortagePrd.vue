<template>
  <div>
    <div class="accordion" id="productAccordion">
      <div class="accordion-item" v-for="(item, index) in groupedData" :key="item.prd_no">
        <!-- Accordion Header -->
        <h2 class="accordion-header" :id="'heading' + index">
          <button
            class="accordion-button"
            type="button"
            :class="{ collapsed: openIndex !== index }"
            @click="toggle(index)"
            :aria-expanded="openIndex === index"
            :aria-controls="'collapse' + index"
          >
            <div class="d-flex flex-column w-100">
              <div class="fw-bold">{{ item.prd_no }} - {{ item.prd_nm }}</div>
              <div class="small d-flex flex-wrap mt-1 text-muted">
                <div class="me-3">총재고: {{ item.현재총재고 }}</div>
                <div class="me-3">필요량: {{ item.필요량 }}</div>
                <div>
                  부족량:
                  <span :class="item.부족량 > 0 ? 'text-danger' : 'text-success'">
                    {{ item.부족량 }}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </h2>

        <!-- Accordion Body -->
        <div
          :id="'collapse' + index"
          class="accordion-collapse collapse"
          :class="{ show: openIndex === index }"
          :aria-labelledby="'heading' + index"
          data-bs-parent="#productAccordion"
        >
          <div class="accordion-body p-0">
            <div class="table-responsive">
              <!-- 헤더 -->
              <div class="d-flex bg-light fw-bold text-center border-bottom">
                <div class="border-end flex-grow-1 py-2" style="width: 30%">Lot No</div>
                <div class="border-end flex-grow-1 py-2" style="width: 30%">현재고</div>
              </div>
              <!-- 데이터 바디 -->
              <div
                v-for="(lot, i) in item.lots"
                :key="lot.lot_no + i"
                class="d-flex text-center border-bottom"
              >
                <div class="border-end flex-grow-1 py-2" style="width: 30%">{{ lot.lot_no }}</div>
                <div class="flex-grow-1 py-2" style="width: 30%">{{ lot.lot_재고 }}</div>
              </div>
              <div v-if="item.lots.length === 0" class="text-center py-2 text-muted">
                재고가 없습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import useDates from '@/utils/useDates.js'
export default {
  name: 'ProductStockAccordion',
  data() {
    return {
      openIndex: null,
      rawData: [
        // 여기에 쿼리 결과 데이터를 직접 넣거나, API로 받아서 세팅
        // 예시 데이터 (쿼리 결과 구조에 맞춤)
        {
          prd_no: 'P-001',
          prd_nm: '제품A',
          현재총재고: 120,
          필요량: 150,
          부족량: 30,
          lot_no: 'L-1001',
          lot_재고: 70
        },
        {
          prd_no: 'P-001',
          prd_nm: '제품A',
          현재총재고: 120,
          필요량: 150,
          부족량: 30,
          lot_no: 'L-1002',
          lot_재고: 50
        },
        {
          prd_no: 'P-002',
          prd_nm: '제품B',
          현재총재고: 80,
          필요량: 80,
          부족량: 0,
          lot_no: 'L-2001',
          lot_재고: 80
        }
      ]
    }
  },
  computed: {
    groupedData() {
      const map = new Map()
      for (const row of this.rawData) {
        if (!map.has(row.prd_no)) {
          map.set(row.prd_no, {
            prd_no: row.prd_no,
            prd_nm: row.prd_nm,
            현재총재고: row.현재총재고,
            필요량: row.필요량,
            부족량: row.부족량,
            lots: []
          })
        }
        if (row.lot_no) {
          map.get(row.prd_no).lots.push({
            lot_no: row.lot_no,
            lot_재고: row.lot_재고
          })
        }
      }
      return Array.from(map.values())
    }
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    }
  }
}
</script>
