/**
 * @mat_service.js
 * 자재 관리 비즈니스 로직 처리 서비스
 * 
 * 주요 기능:
 * 1. 자재 데이터 검증 및 가공
 * 2. 자재 번호 생성 로직
 * 3. 데이터베이스 쿼리 실행
 * 
 * 데이터 처리:
 * - 자재 정보 유효성 검사
 * - 자재 번호 포맷팅
 * - SQL 쿼리 실행 및 결과 처리
 * 
 * 에러 처리:
 * - 데이터 유효성 검증
 * - 데이터베이스 트랜잭션 처리
 * - 비즈니스 로직 예외 처리
 */
const db = require('../database/db'); // 데이터베이스 연결 모듈
const sql = require('../database/sqls/mat'); // 자재 관련 SQL 쿼리

// 자재 목록 조회
exports.selectMatList = async (searchKeyword) => {
    try {
        let query = sql.selectMatList; // 기본 쿼리 가져오기
        let params = []; // 쿼리 파라미터 초기화

        if (searchKeyword) { // 검색어가 있는 경우
            query = query.replace(':searchKeyword', 'WHERE mat_nm LIKE ?'); // 검색 조건 추가
            params.push(`%${searchKeyword}%`); // 검색어 파라미터 추가
        } else {
            query = query.replace(':searchKeyword', ''); // 검색 조건 제거
        }

        const [rows] = await db.query(query, params); // 쿼리 실행
        return rows; // 결과 반환
    } catch (error) {
        console.error('자재 목록 조회 중 오류 발생:', error);
        throw error;
    }
};

// 자재 단건 조회
exports.selectMatOne = async (matNo) => {
    try {
        const [rows] = await db.query(sql.selectMatOne, [matNo]); // 자재 상세 정보 조회
        return rows[0]; // 첫 번째 결과 반환
    } catch (error) {
        console.error('자재 단건 조회 중 오류 발생:', error);
        throw error;
    }
};

// 자재 번호 조회
exports.selectMatNo = async () => {
    try {
        const [rows] = await db.query(sql.selectMatNo); // 다음 자재 번호 조회
        const addMatNo = rows[0].addMatNo; // 다음 번호 추출
        return `MAT${String(addMatNo).padStart(3, '0')}`; // 자재 번호 포맷팅
    } catch (error) {
        console.error('자재 번호 조회 중 오류 발생:', error);
        throw error;
    }
};

// 자재 등록
exports.insertMat = async (matData) => {
    try {
        const { mat_no, mat_nm, mat_tp, mn_vdr, min_ord_qty, min_stk_qty, unit, ld_tm } = matData; // 자재 데이터 구조분해
        const params = [mat_no, mat_nm, mat_tp, mn_vdr, min_ord_qty, min_stk_qty, unit, ld_tm]; // 파라미터 배열 생성
        
        const [result] = await db.query(sql.insertMat, params); // 자재 등록 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('자재 등록 중 오류 발생:', error);
        throw error;
    }
};

// 자재 수정
exports.updateMat = async (matData) => {
    try {
        const { mat_no, mat_nm, mat_tp, mn_vdr, min_ord_qty, min_stk_qty, unit, ld_tm } = matData; // 자재 데이터 구조분해
        const updateFields = []; // 수정할 필드 배열
        const params = []; // 파라미터 배열

        // 수정할 필드와 파라미터 추가
        if (mat_nm) {
            updateFields.push('mat_nm = ?');
            params.push(mat_nm);
        }
        if (mat_tp) {
            updateFields.push('mat_tp = ?');
            params.push(mat_tp);
        }
        if (mn_vdr) {
            updateFields.push('mn_vdr = ?');
            params.push(mn_vdr);
        }
        if (min_ord_qty) {
            updateFields.push('min_ord_qty = ?');
            params.push(min_ord_qty);
        }
        if (min_stk_qty) {
            updateFields.push('min_stk_qty = ?');
            params.push(min_stk_qty);
        }
        if (unit) {
            updateFields.push('unit = ?');
            params.push(unit);
        }
        if (ld_tm) {
            updateFields.push('ld_tm = ?');
            params.push(ld_tm);
        }

        if (updateFields.length === 0) { // 수정할 데이터가 없는 경우
            throw new Error('수정할 데이터가 없습니다.');
        }

        const updateQuery = sql.updateMat.replace('?', updateFields.join(', ')); // 수정 쿼리 생성
        params.push(mat_no); // 자재 번호 파라미터 추가

        const [result] = await db.query(updateQuery, params); // 수정 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('자재 수정 중 오류 발생:', error);
        throw error;
    }
};

// 자재 삭제
exports.deleteMat = async (matNo) => {
    try {
        const [result] = await db.query(sql.deleteMat, [matNo]); // 자재 삭제 쿼리 실행
        return result; // 결과 반환
    } catch (error) {
        console.error('자재 삭제 중 오류 발생:', error);
        throw error;
    }
}; 