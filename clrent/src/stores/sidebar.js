import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const visible = ref(undefined)
  // const visible = ref(false)
  const unfoldable = ref(false)

  const toggleVisible = (value) => {
    visible.value = value !== undefined ? value : !visible.value
  }

  const toggleUnfoldable = () => {
    unfoldable.value = !unfoldable.value
  }

  return { visible, unfoldable, toggleVisible, toggleUnfoldable }
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