const selectPurOrdList=
<<<<<<< HEAD

`SELECT 
  p.pur_ord_no AS 발주번호,
  p.vdr_no,
  p.crt_dt AS 작성일자,
  DATE_FORMAT(p.pur_dt, "%Y-%m-%d") AS 발주일자,
  p.mat_no,
  p.qty AS 수량,
  p.unt_prc AS 단가,
  p.amt AS 금액,
  iir.ovr_jdg AS 종합판정,
  iir.rslt_no AS 성적서번호,
  m.mat_nm AS 자재명,
  ms.pur_ord_no AS 발주에서재고,
  m.unit
FROM pur_ord p
LEFT JOIN inc_ins_rslt iir ON p.pur_ord_no = iir.pur_ord_no
LEFT JOIN mat_stk ms ON p.pur_ord_no = ms.pur_ord_no
LEFT JOIN mat m ON p.mat_no = m.mat_no
GROUP BY p.pur_ord_no
ORDER BY p.pur_ord_no DESC`;
=======
// `
// SELECT p.pur_ord_no AS 발주번호,p.vdr_no, p.crt_dt as 작성일자,date_format(p.pur_dt , "%Y-%m-%d") as 발주일자,p.mat_no,p.qty AS 수량,p.unt_prc as 단가,p.amt as 금액,iir.ovr_jdg AS 종합판정,iir.rslt_no as 성적서번호,m.mat_nm as 자재명   
// FROM pur_ord p LEFT JOIN  inc_ins_rslt iir on (p.pur_ord_no=iir.pur_ord_no)
// JOIN mat m  on(p.mat_no=m.mat_no)
// ;  `;
// `SELECT p.pur_ord_no AS 발주번호,p.vdr_no, p.crt_dt as 작성일자,date_format(p.pur_dt , "%Y-%m-%d") as 발주일자,p.mat_no,p.qty AS 수량,p.unt_prc as 단가,p.amt as 금액,iir.ovr_jdg AS 종합판정,iir.rslt_no as 성적서번호,m.mat_nm as 자재명   
// ,ms.pur_ord_no as 발주에서재고
// FROM pur_ord p LEFT JOIN  inc_ins_rslt iir on (p.pur_ord_no=iir.pur_ord_no)
// JOIN mat m  on(p.mat_no=m.mat_no)
// LEFT JOIN mat_stk ms on(p.mat_no=ms.mat_no)
// group by p.pur_ord_no
// order by p.pur_ord_no`;
`SELECT p.pur_ord_no AS 발주번호
     , p.vdr_no
     , p.crt_dt as 작성일자
     , date_format(p.pur_dt , "%Y-%m-%d") as 발주일자
     , p.mat_no
     , p.qty AS 수량
     , p.unt_prc as 단가
     , p.amt as 금액
     , iir.ovr_jdg AS 종합판정
     , iir.rslt_no as 성적서번호
     , m.mat_nm as 자재명   
     ,ms.pur_ord_no as 발주에서재고 
	,v.cpy_nm	
FROM pur_ord p 
LEFT JOIN inc_ins_rslt iir on (p.pur_ord_no=iir.pur_ord_no)
LEFT JOIN mat_stk ms on(p.pur_ord_no = ms.pur_ord_no)
LEFT JOIN mat m  on(ms.mat_no = m.mat_no)
JOIN vdr v on(v.vdr_no=p.vdr_no)
group by p.pur_ord_no
order by p.pur_ord_no DESC`;
>>>>>>> origin/Eunae

`SELECT 
  p.pur_ord_no AS 발주번호,
  p.vdr_no,
  p.crt_dt AS 작성일자,
  DATE_FORMAT(p.pur_dt, "%Y-%m-%d") AS 발주일자,
  p.mat_no,
  p.qty AS 수량,
  p.unt_prc AS 단가,
  p.amt AS 금액,
  iir.ovr_jdg AS 종합판정,
  iir.rslt_no AS 성적서번호,
  m.mat_nm AS 자재명,
  ms.pur_ord_no AS 발주에서재고,
  m.unit
FROM pur_ord p
LEFT JOIN inc_ins_rslt iir ON p.pur_ord_no = iir.pur_ord_no
LEFT JOIN mat_stk ms ON p.pur_ord_no = ms.pur_ord_no
LEFT JOIN mat m ON p.mat_no = m.mat_no
GROUP BY p.pur_ord_no
ORDER BY p.pur_ord_no DESC`;


// 번호에 해당하는 자재가 발주 -> 자재lot로 입고되었는지 확인하는 쿼리  
const selectPurToLot=`
select m.lot_no
from mat_stk m join  pur_ord  p on  m.pur_ord_no=p.pur_ord_no
where p.pur_ord_no=?`; 







module.exports={          
    selectPurOrdList,
    selectPurToLot
}