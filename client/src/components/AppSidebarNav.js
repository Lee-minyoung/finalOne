// CoreUI 기반 사이드바 네비게이션 컴포넌트 정의
import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

// 현재 라우팅 경로에서 불필요한 정보 제거
const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

// 현재 경로와 메뉴 항목이 일치하는지 확인
const isActiveLink = (route, link) => {
  if (!link) return false
  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)
  return currentPath === targetPath || route.hash === link
}

// 서브 메뉴까지 포함해 현재 경로에 해당하는 메뉴가 있는지 검사
const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) return true
  return item.items?.some((child) => isActiveItem(route, child))
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    // 메뉴 항목 렌더링 (depth = 0부터 시작)
    const renderItem = (item, depth = 0) => {
      const isSubItem = depth > 0
      const iconSize = isSubItem ? 'sm' : 'md'
      const textClass = isSubItem ? 'ms-4 fs-8 fw-medium ' : 'fw-semibold'

      // 그룹 메뉴
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            visible: false,
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon || 'cil-circle',
                size: iconSize,
              }),
              h('span', { class: `${textClass} py-2` }, item.name),
            ],
            default: () => item.items.map((child) => renderItem(child, depth + 1)),
          },
        )
      }

      // 내부 라우터 링크
      if (item.to) {
        return h(
          RouterLink,
          { to: item.to, custom: true },
          {
            default: (props) =>
              h(
                resolveComponent(item.component),
                {
                  active: props.isActive,
                  as: 'div',
                  href: props.href,
                  onClick: () => props.navigate(),
                },
                {
                  default: () => [
                    h(resolveComponent('CIcon'), {
                      customClassName: 'nav-icon',
                      name: item.icon || 'cil-circle',
                      size: iconSize,
                    }),
                    h('span', { class: `${textClass} py-2` }, item.name),
                    item.badge &&
                      h(
                        CBadge,
                        {
                          class: 'ms-auto',
                          color: item.badge.color,
                          size: 'sm',
                        },
                        {
                          default: () => item.badge.text,
                        },
                      ),
                  ],
                },
              ),
          },
        )
      }

      // 제목 같은 텍스트 항목
      return h(
        resolveComponent(item.component),
        { as: 'div' },
        { default: () => item.name },
      )
    }

    return () =>
      h(
        CSidebarNav,
        { as: simplebar },
        { default: () => nav.map((item) => renderItem(item, 0)) },
      )
  },
})

export { AppSidebarNav }
