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
      {
         component:'CNavItem' , 
         name:'출하지시',
         to:'/spmInstTest',  
      }, 
            {
        component: 'CNavItem',
        name: '출하표지',
        to: '/SpmMrk',
      },
      {
        component: 'CNavItem',
        name: '출고조회',
        to: '/SpmFns',
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
        name: '라인관리',
        to: '/LineMang',
      },
      // {
      //   component: 'CNavItem',
      //   name: '라인관리상세',
      //   to: '/LineMangDtl',
      // }          ,
    ],
  },

  {
    component: 'CNavGroup',
    name: '재고',
    icon: 'cil-layers',
    visible: true,
    items: [
      // {
      //   component: 'CNavItem',
      //   name: '재고현황',
      //   to: '/stock',
      // },
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
      {
        component:'CNavItem', 
        name:'자재입고처리',
        to:'/MatImport',
      },
      {
        component: 'CNavItem',
        name: '완제품입고처리',
        to: '/receive-prd',
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
        name: '완제품검사기준서',
        to: '/SpmInsStd',
      },
      {
        component: 'CNavItem',
        name: '완제품검사성적서 작성',
        to: '/SpmInsRslt',
      },
      {
        component: 'CNavItem',
        name: '완제품검사성적서 조회',
        to: '/SpmInsGetRslt',
      },
      {
        component: 'CNavItem',
        name: '입고검사기준서',
        to: '/IncInsStd',
      },
      {
        component: 'CNavItem',
        name: '입고검사성적서 작성',
        to: '/IncInsRslt',
      },
      {
        component: 'CNavItem',
        name: '입고검사성적서 조회',
        to: '/IncInsGetRslt',
      },
    ],
  },

  // {
  //   component: 'CNavGroup',
  //   name: '설비',
  //   icon: 'cil-settings',
  //   visible: true,
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: '설비점검',
  //       to: '/eqp-check',
  //     },
  //   ],
  // },

  {
    component: 'CNavGroup',
    name: '기초정보',
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
        name: 'BOM관리',
        to: '/bom',
      },
      {
        component: 'CNavItem',
        name: '공정코드관리',
        to: '/prc-code',
      },
      {
        component: 'CNavItem',
        name: '제품공정흐름도',
        to: '/proc',
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
  {
    component: 'CNavGroup',
    name: '추가기능 살펴보기',
    icon: 'cil-options',
    visible: true,
    items: [
      {
        component: 'CNavItem',
        name: 'Home',
        to: '/Home',
        icon: 'cil-speedometer',
      },
      {
        component: 'CNavTitle',
        name: 'Theme',
      },
      {
        component: 'CNavItem',
        name: 'Colors',
        to: '/Etc/theme/colors',
        icon: 'cil-drop',
      },
      {
        component: 'CNavItem',
        name: 'Typography',
        to: '/Etc/theme/typography',
        icon: 'cil-pencil',
      },
      {
        component: 'CNavTitle',
        name: 'Components',
      },
      {
        component: 'CNavGroup',
        name: 'Base',
        to: '/Etc/base',
        icon: 'cil-puzzle',
        items: [
          {
            component: 'CNavItem',
            name: 'Accordion',
            to: '/Etc/base/accordion',
          },
          {
            component: 'CNavItem',
            name: 'Breadcrumbs',
            to: '/Etc/base/breadcrumbs',
          },
          {
            component: 'CNavItem',
            name: 'Cards',
            to: '/Etc/base/cards',
          },
          {
            component: 'CNavItem',
            name: 'Calendar',
            href: 'https://coreui.io/vue/docs/components/calendar.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Carousels',
            to: '/Etc/base/carousels',
          },
          {
            component: 'CNavItem',
            name: 'Collapses',
            to: '/Etc/base/collapses',
          },
          {
            component: 'CNavItem',
            name: 'List Groups',
            to: '/Etc/base/list-groups',
          },
          {
            component: 'CNavItem',
            name: 'Navs & Tabs',
            to: '/Etc/base/navs',
          },
          {
            component: 'CNavItem',
            name: 'Paginations',
            to: '/Etc/base/paginations',
          },
          {
            component: 'CNavItem',
            name: 'Placeholders',
            to: '/Etc/base/placeholders',
          },
          {
            component: 'CNavItem',
            name: 'Popovers',
            to: '/Etc/base/popovers',
          },
          {
            component: 'CNavItem',
            name: 'Progress',
            to: '/Etc/base/progress',
          },
          {
            component: 'CNavItem',
            name: 'Smart Pagination',
            href: 'https://coreui.io/vue/docs/components/smart-pagination.html',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Smart Table',
            external: true,
            href: 'https://coreui.io/vue/docs/components/smart-table.html',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Spinners',
            to: '/Etc/base/spinners',
          },
          {
            component: 'CNavItem',
            name: 'Tables',
            to: '/Etc/base/tables',
          },
          {
            component: 'CNavItem',
            name: 'Tabs',
            to: '/Etc/base/tabs',
          },
          {
            component: 'CNavItem',
            name: 'Tooltips',
            to: '/Etc/base/tooltips',
          },
          {
            component: 'CNavItem',
            name: 'Virtual Scroller',
            href: 'https://coreui.io/vue/docs/components/virtual-scroller.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: 'CNavGroup',
        name: 'Buttons',
        to: '/Etc/buttons',
        icon: 'cil-cursor',
        items: [
          {
            component: 'CNavItem',
            name: 'Buttons',
            to: '/Etc/buttons/standard-buttons',
          },
          {
            component: 'CNavItem',
            name: 'Button Groups',
            to: '/Etc/buttons/button-groups',
          },
          {
            component: 'CNavItem',
            name: 'Loading Button',
            href: 'https://coreui.io/vue/docs/components/loading-button.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Dropdowns',
            to: '/Etc/buttons/dropdowns',
          },
        ],
      },
      {
        component: 'CNavGroup',
        name: 'Forms',
        to: '/Etc/forms',
        icon: 'cil-notes',
        items: [
          {
            component: 'CNavItem',
            name: 'Form Control',
            to: '/Etc/forms/form-control',
          },
          {
            component: 'CNavItem',
            name: 'Select',
            to: '/Etc/forms/select',
          },
          {
            component: 'CNavItem',
            name: 'Checks & Radios',
            to: '/Etc/forms/checks-radios',
          },
          {
            component: 'CNavItem',
            name: 'Range',
            to: '/Etc/forms/range',
          },
          {
            component: 'CNavItem',
            name: 'Range Slider',
            href: 'https://coreui.io/vue/docs/forms/range-slider.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Input Group',
            to: '/Etc/forms/input-group',
          },
          {
            component: 'CNavItem',
            name: 'Floating Labels',
            to: '/Etc/forms/floating-labels',
          },
          {
            component: 'CNavItem',
            name: 'Date Picker',
            href: 'https://coreui.io/vue/docs/forms/date-picker.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Date Range Picker',
            href: 'https://coreui.io/vue/docs/forms/date-range-picker.html',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Rating',
            href: 'https://coreui.io/vue/docs/forms/rating.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Time Picker',
            href: 'https://coreui.io/vue/docs/forms/time-picker.html',
            external: true,
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: 'CNavItem',
            name: 'Layout',
            to: '/Etc/forms/layout',
          },
          {
            component: 'CNavItem',
            name: 'Validation',
            to: '/Etc/forms/validation',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Charts',
        to: '/Etc/charts',
        icon: 'cil-chart-pie',
      },
      {
        component: 'CNavGroup',
        name: 'Icons',
        to: '/Etc/icons',
        icon: 'cil-star',
        items: [
          {
            component: 'CNavItem',
            name: 'CoreUI Icons',
            to: '/Etc/icons/coreui-icons',
            badge: {
              color: 'info',
              text: 'NEW',
            },
          },
          {
            component: 'CNavItem',
            name: 'Brands',
            to: '/Etc/icons/brands',
          },
          {
            component: 'CNavItem',
            name: 'Flags',
            to: '/Etc/icons/flags',
          },
        ],
      },
      {
        component: 'CNavGroup',
        name: 'Notifications',
        to: '/Etc/notifications',
        icon: 'cil-bell',
        items: [
          {
            component: 'CNavItem',
            name: 'Alerts',
            to: '/Etc/notifications/alerts',
          },
          {
            component: 'CNavItem',
            name: 'Badges',
            to: '/Etc/notifications/badges',
          },
          {
            component: 'CNavItem',
            name: 'Modals',
            to: '/Etc/notifications/modals',
          },
          {
            component: 'CNavItem',
            name: 'Toasts',
            to: '/Etc/notifications/toasts',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Widgets',
        to: '/Etc/widgets',
        icon: 'cil-calculator',
        badge: {
          color: 'primary',
          text: 'NEW',
          shape: 'pill',
        },
      },
      {
        component: 'CNavTitle',
        name: 'Extras',
      },
      {
        component: 'CNavGroup',
        name: 'Pages',
        to: '/pages',
        icon: 'cil-star',
        items: [
          { component: 'CNavItem', name: 'Login', to: '/pages/login' },
          { component: 'CNavItem', name: 'Register', to: '/pages/register' },
          { component: 'CNavItem', name: 'Error 404', to: '/pages/404' },
          { component: 'CNavItem', name: 'Error 500', to: '/pages/500' },
        ],
      }
    ],
  },
]