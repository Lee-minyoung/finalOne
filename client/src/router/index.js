import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: DefaultLayout,
    redirect: '',
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/ProdPlan',
        name: 'ProdPlan',
        component: () => import('@/views/production/productionPlan.vue'),
      },
      { // 부서
        path: 'dept',
        name: 'dept',
        component: () => import('@/views/dept/dept.vue'),
      },
      { // 사원
        path: 'emp',
        name: 'emp',
        component: () => import('@/views/emp/emp.vue'),
      },
      { // 제품
        path: 'prd',
        name: 'prd',
        component: () => import('@/views/prd/prd.vue'),
      },
      {
        path: '/SpmInsStd',
        name: 'SpmInsStd',
        component: () => import('@/views/qualitys/spmInsStd.vue'),
      },
      {
        path:'/SaleList',
        name:'SaleList',
        component:()=> import('@/views/sales/saleList.vue'),
      },
      { // bom
        path: 'bom',
        name: 'bom',
        component: () => import('@/views/bom/bom.vue'),
      },
      { // proc 공정
        path: 'proc',
        name: 'proc',
        component: () => import('@/views/proc/proc.vue'),
      },
      { // 자재
        path: '/mat',
        name: 'mat',
        component: () => import('@/views/mat/mat.vue'),
      },
      { // 거래처
        path: '/vdr',
        name: 'vdr',
        component: () => import('@/views/vdr/vdr.vue'),
      },
      { // ln 라인
        path: 'ln',
        name: 'ln',
        component: () => import('@/views/ln/ln.vue'),
      },
      { // eqp 설비
        path: 'eqp',
        name: 'eqp',
        component: () => import('@/views/eqp/eqp.vue'),
      },
      { // eqp 설비
        path: 'prc-code',
        name: 'prcCode',
        component: () => import('@/views/prcCode/prcCode.vue'),
      },
      {
        path:'/inventoryCheck',
        name:'InventoryCheck',
        component:()=> import('@/views/inventory/inventoryCheck.vue'),
      },
      {
        path:'/orderForm',
        name:'orderForm',
        component:()=> import('@/views/inventory/orderForm.vue'),
      },
      {
        path:'/ordview',
        name:'OrdView',
        component:()=> import('@/views/inventory/ordView.vue'),
      },
      {
        path: '/ProdMeng',
        name: '생산지시현황',
        component: () => import('@/views/production/line/productionManagement'),
      },
      {
        path: '/LineMang',
        name: '라인관리',
        component: () => import('@/views/production/line/lineManagement'),
      },
      {
        path: '/LineMangDtl',
        name: '라인관리상세',
        component: () => import('@/views/production/line/LineManagementDtl'),
      },
      {
         path:'/MatReq',
        name:'MatReq', 
        component:()=>import('@/views/inventory/matReq.vue')
      },
      {
        path:'/SpmInst',
        name:'SpmInst', 
        component:()=>import('@/views/sales/spmInst.vue') 
      },
      {
        path:'/MatImport',
        name:'MatImport', 
        component:()=>import('@/views/inventory/matImport.vue')
      }
      //상단 {}를 복사하여 사용하시면 됩니다.   
    ],
  },
  { // 로그인
    path: '/login', //실제주소 
    name: 'login', // 부르는 이름
    component: () => import('@/views/login/login.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

