const express = require('express');
const router = express.Router();
const stockShortageService = require('../../services/base/stockShortage_service.js');

// 자재 재고 부족분 계산
// 자재번호, 자재명, 현재고, 적정재고량, 부족량, 단위
router.get('/stockShortageMat', async (req, res) => {
  let matList = await stockShortageService.findStockShortageMat()
    .catch(err => console.log(err));
  res.send(matList);
});

// 제품 재고 부족분 계산
// 제품번호, 제품명, 현재고, 적정재고량, 부족량
router.get('/stockShortagePrd', async (req, res) => {
  let prdList = await stockShortageService.findStockShortagePrd()
    .catch(err => console.log(err));
  res.send(prdList);
});

module.exports = router