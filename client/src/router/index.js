// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useEmpStore } from '@/stores/empStore'

const loginRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/find2pwd',
    name: 'find2pwd',
    component: () => import('@/views/login/Find2PWD.vue')
  },
  {
    path: '/resetPwd/:empNo?',
    name: 'resetPwd',
    component: () => import('@/views/login/ResetPassword.vue')
  }
]

const productionRoutes = [
  {
    path: '/ProdPlan',
    name: 'ProdPlan',
    component: () => import('@/views/production/productionPlan.vue')
  },
  {
    path: '/ProdMeng',
    name: '생산지시현황',
    component: () => import('@/views/production/line/productionManagement.vue')
  },
  {
    path: '/LineMang',
    name: '라인관리',
    component: () => import('@/views/production/line/lineManagement.vue')
  },
  {
    path: '/LineMangDtl',
    name: '라인관리상세',
    component: () => import('@/views/production/line/LineManagementDtl.vue')
  }
]

const qualityRoutes = [
  {
    path: '/SpmInsStd',
    name: 'SpmInsStd',
    component: () => import('@/views/qualitys/spmInsStd.vue')
  },
  {
    path: '/SpmInsRslt',
    name: 'SpmInsRslt',
    component: () => import('@/views/qualitys/spmInsRslt.vue')
  },
  {
    path: '/SpmInsGetRslt',
    name: 'SpmInsGetRslt',
    component: () => import('@/views/qualitys/spmInsGetRslt.vue')
  },
  {
    path: '/IncInsStd',
    name: 'IncInsStd',
    component: () => import('@/views/qualitys/incInsStd.vue')
  },
  {
    path: '/IncInsRslt',
    name: 'IncInsRslt',
    component: () => import('@/views/qualitys/incInsRslt.vue')
  },
  {
    path: '/IncInsGetRslt',
    name: 'IncInsGetRslt',
    component: () => import('@/views/qualitys/incInsGetRslt.vue')
  }
]

const inventoryRoutes = [
  {
    path: '/inventoryCheck',
    name: 'InventoryCheck',
    component: () => import('@/views/inventory/inventoryComponents/inventoryCheck.vue')
  },
  {
    path: '/orderForm',
    name: 'orderForm',
    component: () => import('@/views/inventory/orderForm.vue')
  },
  {
    path: '/ordview',
    name: 'OrdView',
    component: () => import('@/views/inventory/ordView.vue')
  },
  {
    path: '/MatReq',
    name: 'MatReq',
    component: () => import('@/views/inventory/matReq.vue')
  },
  {
    path: '/MatImport',
    name: 'MatImport',
    component: () => import('@/views/inventory/matImport.vue')
  }
]

const basicRoutes = [
  { path: '/dept', name: 'dept', component: () => import('@/views/dept/dept.vue') },
  { path: '/emp', name: 'emp', component: () => import('@/views/emp/emp.vue') },
  { path: '/prd', name: 'prd', component: () => import('@/views/prd/prd.vue') },
  { path: '/mat', name: 'mat', component: () => import('@/views/mat/mat.vue') },
  { path: '/vdr', name: 'vdr', component: () => import('@/views/vdr/vdr.vue') },
  { path: '/bom', name: 'bom', component: () => import('@/views/bom/bom.vue') },
  { path: '/proc', name: 'proc', component: () => import('@/views/proc/proc.vue') },
  { path: '/ln', name: 'ln', component: () => import('@/views/ln/ln.vue') },
  { path: '/eqp', name: 'eqp', component: () => import('@/views/eqp/eqp.vue') },
  { path: '/prc-code', name: 'prcCode', component: () => import('@/views/prcCode/prcCode.vue') }
]

const saleRoutes = [
  { path: '/SpmInst', name: 'SpmInst', component: () => import('@/views/sales/spmInst.vue') },
  { path: '/SpmMrk', name: 'SpmMrk', component: () => import('@/views/spm/SpmMrk.vue') },
  { path: '/SpmFns', name: 'SpmFns', component: () => import('@/views/spm/SpmFns.vue') },
  { path: '/SaleList', name: 'SaleList', component: () => import('@/views/sales/saleList.vue') },
  { path: '/spmInstTest', name: 'spmInstTest', component: () => import('@/views/sales/spmInstTest.vue') }
]

const stockRoutes = [
  { path: '/receive-prd', name: 'receivePrd', component: () => import('@/views/receivePrd/receivePrd.vue') },
  { path: '/stock-shortage', name: 'stockShortage', component: () => import('@/views/stockShortage/stockShortage.vue') }
]

const protectedMainRoutes = [
  {
    path: '/main',
    name: 'Main',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      ...productionRoutes,
      ...qualityRoutes,
      ...inventoryRoutes,
      ...basicRoutes,
      ...saleRoutes,
      ...stockRoutes
    ]
  }
]

const routes = [
  ...loginRoutes,
  ...protectedMainRoutes
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// ✅ 로그인 안하면 접근 못하게 막기
router.beforeEach((to, from, next) => {
  const store = useEmpStore()
  const isLoggedIn = !!store?.loginInfo?.emp_no

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
