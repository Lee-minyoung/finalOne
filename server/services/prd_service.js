const db = require('../database/db');
const sql = require('../database/sqls/prd');

// 제품 목록 조회
exports.selectPrdList = async (searchKeyword) => {
    try {
        let query = sql.selectPrdList;
        let params = [];

        if (searchKeyword) {
            query = query.replace(':searchKeyword', 'WHERE prd_nm LIKE ?');
            params.push(`%${searchKeyword}%`);
        } else {
            query = query.replace(':searchKeyword', '');
        }

        const [rows] = await db.query(query, params);
        return rows;
    } catch (error) {
        console.error('제품 목록 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 단건 조회
exports.selectPrdOne = async (prdNo) => {
    try {
        const [rows] = await db.query(sql.selectPrdOne, [prdNo]);
        return rows[0];
    } catch (error) {
        console.error('제품 단건 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 번호 조회
exports.selectPrdNo = async () => {
    try {
        const [rows] = await db.query(sql.selectPrdNo);
        const addPrdNo = rows[0].addPrdNo;
        return `PRD${String(addPrdNo).padStart(3, '0')}`;
    } catch (error) {
        console.error('제품 번호 조회 중 오류 발생:', error);
        throw error;
    }
};

// 제품 등록
exports.insertPrd = async (prdData) => {
    try {
        const { prd_no, prd_nm, prd_tp, exp_dt, opt_stk_qty } = prdData;
        const params = [prd_no, prd_nm, prd_tp, exp_dt, opt_stk_qty];
        
        const [result] = await db.query(sql.insertPrd, params);
        return result;
    } catch (error) {
        console.error('제품 등록 중 오류 발생:', error);
        throw error;
    }
};

// 제품 수정
exports.updatePrd = async (prdData) => {
    try {
        const { prd_no, prd_nm, prd_tp, exp_dt, opt_stk_qty } = prdData;
        const updateFields = [];
        const params = [];

        if (prd_nm) {
            updateFields.push('prd_nm = ?');
            params.push(prd_nm);
        }
        if (prd_tp) {
            updateFields.push('prd_tp = ?');
            params.push(prd_tp);
        }
        if (exp_dt) {
            updateFields.push('exp_dt = ?');
            params.push(exp_dt);
        }
        if (opt_stk_qty) {
            updateFields.push('opt_stk_qty = ?');
            params.push(opt_stk_qty);
        }

        if (updateFields.length === 0) {
            throw new Error('수정할 데이터가 없습니다.');
        }

        const updateQuery = sql.updatePrd.replace('?', updateFields.join(', '));
        params.push(prd_no);

        const [result] = await db.query(updateQuery, params);
        return result;
    } catch (error) {
        console.error('제품 수정 중 오류 발생:', error);
        throw error;
    }
};

// 제품 삭제
exports.deletePrd = async (prdNo) => {
    try {
        const [result] = await db.query(sql.deletePrd, [prdNo]);
        return result;
    } catch (error) {
        console.error('제품 삭제 중 오류 발생:', error);
        throw error;
    }
}; 