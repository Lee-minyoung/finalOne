import { defineStore } from "pinia";

export const useEmpStore = defineStore("emp", {
  state: () => ({
    loginInfo: {
      emp_no: null, // 로그인한 사원번호
      nm: null, // 로그인한 사원이름
      pst_nm: null, // 로그인한 사원 직급명
      pst_no: null, // 로그인한 사원 직급번호
      dept_no: null, // 로그인한 사원 부서번호
      dept_nm: null, // 로그인한 사원 부서명
    },
  }),
  getters: {
    isLoggedIn: (state) => !!state.emp.emp_no, // ✅ 로그인 상태 여부
    empNo: (state) => state.emp.emp_no,
    empName: (state) => state.emp.nm
  },
  actions: {
    // 로그인 정보를 저장
    setLoginInfo(info) {
      this.loginInfo.emp_no = info.emp_no;
      this.loginInfo.nm = info.nm;
      this.loginInfo.pst_nm = info.pst_nm;
      this.loginInfo.pst_no = info.pst_no;
      this.loginInfo.dept_no = info.dept_no;
      this.loginInfo.dept_nm = info.dept_nm;
    },
  },

  persist: true, // Pinia Persist 설정
});