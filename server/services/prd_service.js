/**
 * @prd_service.js
 * 제품 관리 비즈니스 로직 처리 서비스
 * 
 * 주요 기능:
 * 1. 제품 데이터 검증 및 가공
 * 2. 제품 번호 생성 로직
 * 3. 데이터베이스 쿼리 실행
 * 
 * 데이터 처리:
 * - 제품 정보 유효성 검사
 * - 제품 번호 포맷팅
 * - SQL 쿼리 실행 및 결과 처리
 * 
 * 에러 처리:
 * - 데이터 유효성 검증
 * - 데이터베이스 트랜잭션 처리
 * - 비즈니스 로직 예외 처리
 */
const db = require('../database/db'); // 데이터베이스 연결 모듈
const sql = require('../database/sqls/prd'); // 제품 관련 SQL 쿼리

// 제품 목록 조회
exports.selectPrdList = async (searchKeyword) => {
    try {
        let query = sql.selectPrdList; // 기본 쿼리 가져오기
        let params = []; // 쿼리 파라미터 초기화

        if (searchKeyword) { // 검색어가 있는 경우
            query = query.replace(':searchKeyword', 'WHERE prd_nm LIKE ?'); // 검색 조건 추가
            params.push(`%${searchKeyword}%`); // 검색어 파라미터 추가
        } else {
            query = query.replace(':searchKeyword', ''); // 검색 조건 제거
        }

        const [rows] = await db.query(query, params); // 쿼리 실행
        return rows; // 결과 반환
    } catch (error) {
        console.error('제품 목록 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 단건 조회
exports.selectPrdOne = async (prdNo) => {
    try {
        const [rows] = await db.query(sql.selectPrdOne, [prdNo]); // 제품 상세 정보 조회
        return rows[0]; // 첫 번째 결과 반환
    } catch (error) {
        console.error('제품 단건 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 번호 조회
exports.selectPrdNo = async () => {
    try {
        const [rows] = await db.query(sql.selectPrdNo); // 다음 제품 번호 조회
        const addPrdNo = rows[0].addPrdNo; // 다음 번호 추출
        return `PRD${String(addPrdNo).padStart(3, '0')}`; // 제품 번호 포맷팅
    } catch (error) {
        console.error('제품 번호 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 등록
exports.insertPrd = async (prdData) => {
    try {
        const { prd_no, prd_nm, prd_tp, unit } = prdData; // 제품 데이터 구조분해
        const params = [prd_no, prd_nm, prd_tp, unit]; // 파라미터 배열 생성
        
        const [result] = await db.query(sql.insertPrd, params); // 제품 등록 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('제품 등록 중 오류 발생:', error);
        throw error;
    }
};

// 제품 수정
exports.updatePrd = async (prdData) => {
    try {
        const { prd_no, prd_nm, prd_tp, unit } = prdData; // 제품 데이터 구조분해
        const updateFields = []; // 수정할 필드 배열
        const params = []; // 파라미터 배열

        // 수정할 필드와 파라미터 추가
        if (prd_nm) {
            updateFields.push('prd_nm = ?');
            params.push(prd_nm);
        }
        if (prd_tp) {
            updateFields.push('prd_tp = ?');
            params.push(prd_tp);
        }
        if (unit) {
            updateFields.push('unit = ?');
            params.push(unit);
        }

        if (updateFields.length === 0) { // 수정할 데이터가 없는 경우
            throw new Error('수정할 데이터가 없습니다.');
        }

        const updateQuery = sql.updatePrd.replace('?', updateFields.join(', ')); // 수정 쿼리 생성
        params.push(prd_no); // 제품 번호 파라미터 추가

        const [result] = await db.query(updateQuery, params); // 수정 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('제품 수정 중 오류 발생:', error);
        throw error;
    }
};

// 제품 삭제
exports.deletePrd = async (prdNo) => {
    try {
        const [result] = await db.query(sql.deletePrd, [prdNo]); // 제품 삭제 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('제품 삭제 중 오류 발생:', error);
        throw error;
    }
}; 