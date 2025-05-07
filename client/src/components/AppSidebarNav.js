import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

// 경로 정리
const normalizePath = (path) =>
  decodeURI(path).replace(/#.*$/, '').replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (!link) return false
  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)
  return currentPath === targetPath || route.hash === link
}

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

    const renderItem = (item, depth = 0) => {
      const isSubItem = depth > 0
      const iconClass = isSubItem ? 'fs-6' : 'fs-5'
      const textClass = isSubItem ? 'ms-3 fs-8 fw-medium' : 'fw-semibold'

      // 그룹
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            // visible: isActiveItem(route, item),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: `nav-icon ${iconClass}`,
                name: item.icon || 'cil-circle',
              }),
              h('span', { class: `${textClass} py-2` }, item.name),
            ],
            default: () => item.items.map((child) => renderItem(child, depth + 1)),
          },
        )
      }

      // 라우터 링크
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
                      customClassName: `nav-icon ${iconClass}`,
                      name: item.icon || 'cil-circle',
                    }),
                    h('span', { class: `${textClass} py-1` }, item.name),
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

      // 텍스트/제목 항목
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
