<<<<<<< .merge_file_kcJpx8
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
=======
// CoreUI 기반 사이드바 네비게이션 컴포넌트 정의
import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { cilExternalLink } from '@coreui/icons'
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js' // 메뉴 항목 정의 파일

import simplebar from 'simplebar-vue' // 커스텀 스크롤바
import 'simplebar-vue/dist/simplebar.min.css'

// 현재 라우팅 경로에서 불필요한 정보 제거
const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '') // hash 제거
    .replace(/(index)?\.(html)$/, '') // index.html 제거

// 현재 경로와 메뉴 항목의 경로가 일치하는지 확인
const isActiveLink = (route, link) => {
  if (link === undefined) return false

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath || route.hash === link
}

// 서브 메뉴까지 포함하여 현재 경로에 해당 메뉴가 활성화돼 있는지 검사
const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) return true
  if (item.items) return item.items.some((child) => isActiveItem(route, child))
  return false
>>>>>>> .merge_file_IddQaU
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
<<<<<<< .merge_file_kcJpx8
    const firstRender = ref(true)
=======
    const firstRender = ref(true) // 첫 렌더링 여부 확인용 (초기 펼침 제어)
>>>>>>> .merge_file_IddQaU

    onMounted(() => {
      firstRender.value = false
    })

<<<<<<< .merge_file_kcJpx8
    const renderItem = (item, depth = 0) => {
      const isSubItem = depth > 0
      const iconClass = isSubItem ? 'fs-6' : 'fs-5'
      const textClass = isSubItem ? 'ms-3 fs-8 fw-medium' : 'fw-semibold'

      // 그룹
=======
    // 메뉴 항목 렌더링 함수 정의
    const renderItem = (item) => {
      // 1. 그룹 메뉴 (하위 항목 있는 경우)
>>>>>>> .merge_file_IddQaU
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
<<<<<<< .merge_file_kcJpx8
            // visible: isActiveItem(route, item),
=======
            ...(firstRender.value && {
              visible:
                item.name !== '추가기능 살펴보기' &&
                item.items.some((child) => isActiveItem(route, child)),
            }), // 첫 렌더링 시, 현재 경로에 해당하는 메뉴만 자동 펼침
>>>>>>> .merge_file_IddQaU
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
<<<<<<< .merge_file_kcJpx8
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
=======
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)), // 재귀적 렌더링
          },
        )
      }

      // 2. 외부 링크 (href)
      if (item.href) {
        return h(
          resolveComponent(item.component),
          {
            href: item.href,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          {
            default: () => [
              item.icon
                ? h(resolveComponent('CIcon'), {
                    customClassName: 'nav-icon',
                    name: item.icon,
                  })
                : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
              item.name,
              item.external &&
                h(resolveComponent('CIcon'), {
                  class: 'ms-2',
                  name: 'cil-external-link',
                  size: 'sm',
                }),
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
        )
      }

      // 3. 내부 라우터 링크
      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
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
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
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
        // 4. 라우터나 링크 없는 항목 (타이틀 등)
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          )
    }

    // 전체 nav 배열을 기반으로 렌더링 시작
    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar, // 스크롤바 커스텀
        },
        {
          default: () => nav.map((item) => renderItem(item)), // nav 배열 순회
        },
      )
  },
})

export { AppSidebarNav }
>>>>>>> .merge_file_IddQaU
