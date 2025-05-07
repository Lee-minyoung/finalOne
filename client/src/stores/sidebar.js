import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const visible = ref(true)       // ❌ 이건 저장 X
  const unfoldable = ref(false)        // ✅ 이건 저장 O

  const toggleVisible = (value) => {
    visible.value = value !== undefined ? value : !visible.value
  }

  const toggleUnfoldable = () => {
    unfoldable.value = !unfoldable.value
  }

  return { visible, unfoldable, toggleVisible, toggleUnfoldable }
}, 
{
  persist: {
    paths: ['unfoldable']  // ✅ unfoldable만 로컬스토리지에 저장
  }
})


// export const useSidebarStore = defineStore('sidebar', {
//   state: () => ({
//     visible: undefined,
//     unfoldable: false,
//   }),
//   actions: {
//     toggleVisible(value) {
//       this.visible = value !== undefined ? value : !this.visible
//     },
//     toggleUnfoldable() {
//       this.unfoldable = !this.unfoldable
//     },
//   },
//   getters: {
//     isVisible: (state) => state.visible === true,
//   }
// })