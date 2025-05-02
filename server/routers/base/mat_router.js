const express = require('express');
const router = express.Router();
const matService = require('../../services/base/mat_service.js');
// 라우팅  = 사용자의 요청(URL+METHOD) + Service + 응답형태(View or Data) 

// 다양한 조건을 기반으로 전체조회 => 다양한 조건은 정해지지 않았으므로 QueryString(질의문자열)으로 유연하게 처리
router.get('/mat', async (req, res) => {
  let matList = await matService.findBomList()
    .catch(err => console.log(err));
  res.send(matList);
});

module.exports = router