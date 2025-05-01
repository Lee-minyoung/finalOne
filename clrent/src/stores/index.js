

import { defineStore } from 'pinia'
 // pinia를 통해 관리할 stores(저장소)를 정의
//  : defineStore(store_id, option 객체 | setup function)
 export const useEmpStore = defineStore('emp', {
  // state : store(저장소)를 통해 관리할 대상(데이터) => data로 작성
  state: () => ({ emp: {} }),
  // getters : state의 값을 필터링하거나 readonly로 조회하기 위한 함수 정의 => computed로 작성
  getters: {
    empNo: state => state.emp.emp_no, 
  },
  // actions : state를 변경하기 위한 함수
  actions: {
    addLoginId(loginId) {
      this.emp.emp_no = loginId;
    },
    removeLoginId(){
      this.emp = {};
    },
  },
 });










// import { defineStore } from 'pinia';

// // Pinia 스토어 정의
// export const useUserStore = defineStore('user', {
//   // state: 저장소에서 관리할 데이터
//   state: () => ({
//     user: {
//       emp_no: null,   // 사용자 사원번호
//       nm: null,       // 사용자 이름
//     },
//   }),

//   // getters: state의 데이터를 가공하거나 읽기 전용으로 조회
//   getters: {
//     userEmpNo: (state) => state.user.emp_no,   // 사용자 사원번호 반환
//     userNm: (state) => state.user.nm,         // 사용자 이름 반환
//   },

//   // actions: state를 변경하거나 비즈니스 로직 처리
//   actions: {
//     // 로그인 시 사용자 정보를 저장
//     addLoginInfo({ emp_no, nm }) {
//       this.user.emp_no = emp_no;
//       this.user.nm = nm;
//     },

//     // 로그아웃 시 사용자 정보를 초기화
//     removeLoginInfo() {
//       Object.assign(this.user, {
//         emp_no: null,
//         nm: null,
//       });
//     },
//   },
// });