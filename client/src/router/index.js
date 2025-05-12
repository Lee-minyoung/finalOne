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
      { // 생산 계획 관리
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
      // 품질
      {
        path: '/SpmInsStd',
        name: 'SpmInsStd',
        component: () => import('@/views/qualitys/spmInsStd.vue'),
      },
      { // 완제품검사성적서
        path: '/SpmInsRslt',
        name: 'SpmInsRslt',
        component: () => import('@/views/qualitys/spmInsRslt.vue'),
      },
      {
        path: '/IncInsStd',
        name: 'IncInsStd',
        component: () => import('@/views/qualitys/incInsStd.vue'),
      },
      {
        path: '/IncInsRslt',
        name: 'IncInsRslt',
        component: () => import('@/views/qualitys/incInsRslt.vue'),
      },
      // 출하
      {
        path: '/SpmMrk',
        name: 'SpmMrk',
        component: () => import('@/views/spm/SpmMrk.vue'),
      },
      {
        path: '/SpmFns',
        name: 'SpmFns',
        component: () => import('@/views/spm/SpmFns.vue'),
      },
      { // 주문조회, 총주문수량
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
      { // receicePrd 완제품입고처리
        path: 'receive-prd',
        name: 'receivePrd',
        component: () => import('@/views/receivePrd/receivePrd.vue'),
      },
      { // 자재현황파악, 자재구매계획
        path:'/inventoryCheck',
        name:'InventoryCheck',
        component:()=> import('@/views/inventory/inventoryCheck.vue'),
      },
      { // 발주서입력, 자재구매계획
        path:'/orderForm',
        name:'orderForm',
        component:()=> import('@/views/inventory/orderForm.vue'),
      },
      { // 발주서조회
        path:'/ordview',
        name:'OrdView',
        component:()=> import('@/views/inventory/ordView.vue'),
      },
      { // 생산지시현황
        path: '/ProdMeng',
        name: '생산지시현황',
        component: () => import('@/views/production/line/productionManagement'),
      },
      { // 라인관리
        path: '/LineMang',
        name: '라인관리',
        component: () => import('@/views/production/line/lineManagement'),
      },
      { // 라인관리상세
        path: '/LineMangDtl',
        name: '라인관리상세',
        component: () => import('@/views/production/line/LineManagementDtl'),
      },
      { // 자재요청페이지
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
  {
    path: '/',
    name: 'Dummy data',
    component: DefaultLayout,
    redirect: '/Etc/dashboard',
    children: [
      {
        path: 'Etc/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Etc/dashboard/Dashboard.vue'),
      },
      {
        path: 'Etc/theme/colors',
        name: 'Colors',
        component: () => import('@/views/Etc/theme/Colors.vue'),
      },
      {
        path: 'Etc/theme/typography',
        name: 'Typography',
        component: () => import('@/views/Etc/theme/Typography.vue'),
      },
      {
        path: 'Etc/base',
        name: 'Base',
        component: { render: () => h(resolveComponent('router-view')) },
        redirect: '/Etc/base/breadcrumbs',
        children: [
          { path: 'breadcrumbs', name: 'Breadcrumbs', component: () => import('@/views/Etc/base/Breadcrumbs.vue') },
          { path: 'accordion', name: 'Accordion', component: () => import('@/views/Etc/base/Accordion.vue') },
          { path: 'cards', name: 'Cards', component: () => import('@/views/Etc/base/Cards.vue') },
          { path: 'carousels', name: 'Carousels', component: () => import('@/views/Etc/base/Carousels.vue') },
          { path: 'collapses', name: 'Collapses', component: () => import('@/views/Etc/base/Collapses.vue') },
          { path: 'list-groups', name: 'List Groups', component: () => import('@/views/Etc/base/ListGroups.vue') },
          { path: 'navs', name: 'Navs', component: () => import('@/views/Etc/base/Navs.vue') },
          { path: 'paginations', name: 'Paginations', component: () => import('@/views/Etc/base/Paginations.vue') },
          { path: 'placeholders', name: 'Placeholders', component: () => import('@/views/Etc/base/Placeholders.vue') },  
          { path: 'popovers', name: 'Popovers', component: () => import('@/views/Etc/base/Popovers.vue') },
          { path: 'progress', name: 'Progress', component: () => import('@/views/Etc/base/Progress.vue') },
          { path: 'spinners', name: 'Spinners', component: () => import('@/views/Etc/base/Spinners.vue') },
          { path: 'tables', name: 'Tables', component: () => import('@/views/Etc/base/Tables.vue') },
          { path: 'tabs', name: 'Tabs', component: () => import('@/views/Etc/base/Tabs.vue') },
          { path: 'tooltips', name: 'Tooltips', component: () => import('@/views/Etc/base/Tooltips.vue') },
        ],
      },
      {
        path: 'Etc/forms',
        name: 'Forms',
        component: { render: () => h(resolveComponent('router-view')) },
        redirect: '/Etc/forms/form-control',
        children: [
          { path: 'form-control', name: 'Form Control', component: () => import('@/views/Etc/forms/FormControl.vue') },
          { path: 'select', name: 'Select', component: () => import('@/views/Etc/forms/Select.vue') },
          { path: 'checks-radios', name: 'Checks & Radios', component: () => import('@/views/Etc/forms/ChecksRadios.vue') },
          { path: 'range', name: 'Range', component: () => import('@/views/Etc/forms/Range.vue') },
          { path: 'input-group', name: 'Input Group', component: () => import('@/views/Etc/forms/InputGroup.vue') },
          { path: 'floating-labels', name: 'Floating Labels', component: () => import('@/views/Etc/forms/FloatingLabels.vue') },
          { path: 'layout', name: 'Layout', component: () => import('@/views/Etc/forms/Layout.vue') },
          { path: 'validation', name: 'Validation', component: () => import('@/views/Etc/forms/Validation.vue') },
        ],
      },
      {
        path: 'Etc/widgets',
        name: 'Widgets',
        component: () => import('@/views/Etc/widgets/Widgets.vue'),
      },
      {
        path: 'Etc/buttons',
        name: 'Buttons',
        component: { render: () => h(resolveComponent('router-view')) },
        redirect: '/Etc/buttons/standard-buttons',
        children: [
          {
            path: 'standard-buttons',
            name: 'Button Component',
            component: () => import('@/views/Etc/buttons/Buttons.vue'),
          },
          {
            path: 'dropdowns',
            name: 'Dropdowns',
            component: () => import('@/views/Etc/buttons/Dropdowns.vue'),
          },
          {
            path: 'button-groups',
            name: 'Button Groups',
            component: () => import('@/views/Etc/buttons/ButtonGroups.vue'),
          },
        ],
      },
      {
        path: 'Etc/notifications',
        name: 'Notifications',
        component: { render: () => h(resolveComponent('router-view')) },
        redirect: '/Etc/notifications/alerts',
        children: [
          {
            path: 'alerts',
            name: 'Alerts',
            component: () => import('@/views/Etc/notifications/Alerts.vue'),
          },
          {
            path: 'badges',
            name: 'Badges',
            component: () => import('@/views/Etc/notifications/Badges.vue'),
          },
          {
            path: 'modals',
            name: 'Modals',
            component: () => import('@/views/Etc/notifications/Modals.vue'),
          },
          {
            path: 'toasts',
            name: 'Toasts',
            component: () => import('@/views/Etc/notifications/Toasts.vue'),
          },
        ],
      },
      {
        path: 'Etc/icons',
        name: 'Icons',
        component: { render: () => h(resolveComponent('router-view')) },
        redirect: '/Etc/icons/coreui-icons',
        children: [
          {
            path: 'coreui-icons',
            name: 'CoreUI Icons',
            component: () => import('@/views/Etc/icons/CoreUIIcons.vue'),
          },
          {
            path: 'brands',
            name: 'Brands',
            component: () => import('@/views/Etc/icons/Brands.vue'),
          },
          {
            path: 'flags',
            name: 'Flags',
            component: () => import('@/views/Etc/icons/Flags.vue'),
          },
        ],
      },
      {
        path: 'Etc/charts',
        name: 'Charts',
        component: () => import('@/views/Etc/charts/Charts.vue'),
      },
    ],
  },
  {
    path: '/pages',
    name: 'Pages',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/Etc/pages/Page404.vue'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/Etc/pages/Page500.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Etc/pages/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Etc/pages/Register.vue'),
      },
    ],
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