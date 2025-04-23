export const nav = [
    {
      component: 'CNavItem',
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'cil-speedometer',
    },
    {
      component: 'CNavGroup',
      name: '생산관리',
      icon: 'cil-factory',
      items: [
        {
          component: 'CNavItem',
          name: '생산 지시',
          to: '/production/order',
        },
        {
          component: 'CNavItem',
          name: '생산 실적',
          to: '/production/result',
        },
      ],
    },
  ]
  