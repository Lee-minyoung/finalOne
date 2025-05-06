export default [
  {
    component: 'CNavTitle',
    name: 'MES 시스템',
  },

  {
    component: 'CNavGroup',
    name: '영업',
    icon: 'cil-briefcase',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '수주',
        to: '/SaleList',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '생산',
    icon: 'cil-factory',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '생산계획',
        to: '/ProdPlan',
      },
      {
        component: 'CNavItem',
        name: '생산관리',
        to: '/Prodmeng',
      },
      {
        component: 'CNavItem',
        name: '라인관리상세',
        to: '/LineMang',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '재고',
    icon: 'cil-layers',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '재고현황',
        to: '/stock',
      },
      {
        component: 'CNavItem',
        name: '자재구매현황',
        to: '/inventoryCheck',
      },
      {
        component: 'CNavItem',
        name: '발주서관리',
        to: '/orderForm',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '품질',
    icon: 'cil-check-circle',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '완제품검사기준',
        to: '/SpmInsStd',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '설비',
    icon: 'cil-settings',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '설비점검',
        to: '/eqp-check',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '기초정보입력',
    icon: 'cil-file',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '사원관리',
        to: '/emp',
      },
      {
        component: 'CNavItem',
        name: '부서관리',
        to: '/dept',
      },
      {
        component: 'CNavItem',
        name: '거래처관리',
        to: '/vdr',
      },
      {
        component: 'CNavItem',
        name: '자재관리',
        to: '/mat',
      },
      {
        component: 'CNavItem',
        name: '제품관리',
        to: '/prd',
      },
      {
        component: 'CNavItem',
        name: '제품공정흐름도',
        to: '/proc',
      },
      {
        component: 'CNavItem',
        name: 'BOM관리',
        to: '/bom',
      },
      {
        component: 'CNavItem',
        name: '라인관리',
        to: '/ln',
      },
      {
        component: 'CNavItem',
        name: '설비관리',
        to: '/eqp',
      },
      {
        component: 'CNavItem',
        name: '공정코드관리',
        to: '/prc-code',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: '실시간 모니터링',
    icon: 'cil-speedometer',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: '대시보드',
        to: '/dashboard',
      },
    ],
  },
]
