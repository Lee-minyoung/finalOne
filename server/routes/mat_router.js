/**
 * @mat_router.js
 * 자재 관리 관련 API 라우터
 * 
 * 주요 기능:
 * 1. 자재 목록 조회 (GET /api/mat)
 * 2. 자재 상세 정보 조회 (GET /api/mat/:matNo)
 * 3. 자재 등록 (POST /api/mat)
 * 4. 자재 수정 (PUT /api/mat/:matNo)
 * 5. 자재 삭제 (DELETE /api/mat/:matNo)
 * 6. 자재 번호 조회 (GET /api/matNo)
 * 
 * 데이터 처리:
 * - 자재 정보의 CRUD 작업 처리
 * - 자재 번호 자동 생성 및 관리
 * 
 * 에러 처리:
 * - 데이터베이스 오류 처리
 * - 잘못된 요청 처리
 * - 중복 데이터 처리
 */
const express = require('express');
// ... existing code ... 