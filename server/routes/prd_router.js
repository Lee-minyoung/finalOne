/**
 * @prd_router.js
 * 제품 관리 관련 API 라우터
 * 
 * 주요 기능:
 * 1. 제품 목록 조회 (GET /api/prd)
 * 2. 제품 상세 정보 조회 (GET /api/prd/:prdNo)
 * 3. 제품 등록 (POST /api/prd)
 * 4. 제품 수정 (PUT /api/prd/:prdNo)
 * 5. 제품 삭제 (DELETE /api/prd/:prdNo)
 * 6. 제품 번호 조회 (GET /api/prd/no)
 * 
 * 데이터 처리:
 * - 제품 정보의 CRUD 작업 처리
 * - 제품 번호 자동 생성 및 관리
 * 
 * 에러 처리:
 * - 데이터베이스 오류 처리
 * - 잘못된 요청 처리
 * - 중복 데이터 처리
 */
const express = require('express');
// ... existing code ... 