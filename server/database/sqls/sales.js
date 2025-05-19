const insertOrd=
`INSERT INTO ord (ord_no,vdr_no,emp_no,due_dt,ord_sts,rgt_dt,mdf_dt)
 values (?,?,?,?,?,?,?)`; 
const insertOrdDtl=
`INSERT INTO ord_dtl (ord_dtl_no,ord_no,prd_no,prd_qty)
values(?,?,?,?)`;
//주문번호 마지막번호 찾기   
const selectLastOrdNo=
` select max(ord_no) as maxOrdNo
 from ord`; 
 //주문번호 
 const selectLastOrdDtlNo=
 `select max(ord_dtl_no) as maxOrdDtlNo
  from ord_dtl`; 
//  
const selectOrdList=
`SELECT 
  o.ord_no,
  o.vdr_no,
  v.cpy_nm,
  od.prd_no,
  p.prd_nm,
  od.prd_qty AS 요청수량,
  ps.cur_stk AS lot수량,
  DATE_FORMAT(o.rgt_dt, '%Y-%m-%d') AS rgt_dt,
  DATE_FORMAT(DATE_ADD(o.rgt_dt, INTERVAL 14 DAY), '%Y-%m-%d') AS 납기예정,
  ps.lot_no,
  v.ofc_addr,
  s.ord_no AS 출하에서수주번호
FROM ord o
JOIN ord_dtl od ON o.ord_no = od.ord_no
JOIN prd p ON od.prd_no = p.prd_no
LEFT JOIN prd_stk ps ON od.prd_no = ps.prd_no
JOIN vdr v ON o.vdr_no = v.vdr_no
LEFT JOIN spm s ON s.ord_no = o.ord_no
WHERE s.ord_no IS NULL
GROUP BY o.ord_no, od.prd_no
ORDER BY o.rgt_dt DESC, o.ord_no DESC, od.prd_no`;

// `select o.ord_no,o.vdr_no,od.prd_no,od.prd_qty
// from ord o join ord_dtl od on o.ord_no=od.ord_no`;  
// `SELECT ord_no,
//          vdr_no,
//          emp_no,
//          due_dt,
//          ord_sts,
//          rgt_dt,
//          mdf_dt
//   FROM ord`;

// `select o.ord_no,o.vdr_no,od.prd_no,od.prd_qty
// from ord o join ord_dtl od on o.ord_no=od.ord_no`;  
<<<<<<< HEAD
// `SELECT 
//   o.ord_no,
//   o.vdr_no,
//   od.prd_no,
//   od.prd_qty
// FROM ord o
// JOIN ord_dtl od ON o.ord_no = od.ord_no`;
=======

`SELECT o.ord_no 
     , o.vdr_no 
     , (SELECT cpy_nm FROM vdr WHERE vdr_no = o.vdr_no)  
     , od.prd_no 
     , p.prd_nm 
     , od.prd_qty 
     , IFNULL((SELECT SUM(cur_stk) FROM prd_stk WHERE prd_no = od.prd_no), 0) as 현재고량
     , v.cpy_nm
     , DATE_FORMAT(o.due_dt, '%Y-%m-%d') AS due_dt
  FROM ord o
  LEFT JOIN ord_dtl od ON o.ord_no = od.ord_no
  LEFT JOIN prd p ON od.prd_no = p.prd_no
  JOIN vdr v ON v.vdr_no=o.vdr_no
	WHERE NOT EXISTS (
    SELECT 1 FROM spm s WHERE s.ord_no = o.ord_no
  )
ORDER BY o.ord_no desc;
`; 
`SELECT 
  o.ord_no,
  o.vdr_no,
  v.cpy_nm,
  od.prd_no,
  p.prd_nm,
  sum(od.prd_qty) AS 요청수량,
  ps.cur_stk AS lot수량,
  DATE_FORMAT(DATE_ADD(o.rgt_dt, INTERVAL 14 DAY), "%Y-%m-%d") AS 납기예정,
  ps.lot_no,
  v.ofc_addr,
  s.ord_no AS 출하에서수주번호
FROM ord o
JOIN ord_dtl od ON o.ord_no = od.ord_no
JOIN prd p ON od.prd_no = p.prd_no
LEFT JOIN prd_stk ps ON od.prd_no = ps.prd_no
JOIN vdr v ON o.vdr_no = v.vdr_no
LEFT JOIN spm s ON s.ord_no = o.ord_no
WHERE s.ord_no IS NULL
GROUP BY o.ord_no
ORDER BY o.ord_no`;
>>>>>>> origin/Eunae

const selectLastPrd=
`SELECT max(prd_no) as lastCode
FROM ord_dtl WHERE prd_no LIKE'PRD%'`; 

//주문조회  
const selectOrdAll=
`SELECT o.ord_no,v.cpy_nm,p.prd_nm,od.prd_qty,o.rgt_dt,o.due_dt    
FROM ord o JOIN vdr v ON(o.vdr_no=v.vdr_no)
		   JOIN ord_dtl od ON(o.ord_no=od.ord_no) 		
		   JOIN  prd p ON(od.prd_no=p.prd_no)`; 

//날짜 기간 별 주문 
const selectOrdDate=
`SELECT 
  o.ord_no,
  o.vdr_no,
  v.cpy_nm,
  od.prd_no,
  p.prd_nm,
  od.prd_qty AS 요청수량,
  ps.cur_stk AS lot수량,
  DATE_FORMAT(DATE_ADD(o.rgt_dt, INTERVAL 14 DAY), "%Y-%m-%d") AS 납기예정,
  ps.lot_no,
  v.ofc_addr,
  s.ord_no AS 출하에서수주번호
FROM ord o
JOIN ord_dtl od ON o.ord_no = od.ord_no
JOIN prd p ON od.prd_no = p.prd_no
LEFT JOIN prd_stk ps ON od.prd_no = ps.prd_no
JOIN vdr v ON o.vdr_no = v.vdr_no
LEFT JOIN spm s ON s.ord_no = o.ord_no
WHERE s.ord_no IS NULL
and DATE(o.rgt_dt) BETWEEN ? and ?
ORDER BY o.ord_no;
`; 
//특정 날짜 주문 
const selectOrdDateOne=
`
select o.ord_no,o.vdr_no,v.cpy_nm,od.prd_no,p.prd_nm,od.prd_qty as 요청수량,ps.cur_stk as lot수량,DATE_FORMAT(DATE_ADD(o.due_dt,INTERVAL 14 DAY)," %Y-%m-%d") as 납기예정,ps.lot_no,v.ofc_addr 
from ord o join ord_dtl od on o.ord_no=od.ord_no
join prd p on od.prd_no=p.prd_no
right join  prd_stk ps on od.prd_no=ps.prd_no
join vdr v on o.vdr_no=v.vdr_no
where o.ord_no is not null
and DATE(o.rgt_dt) BETWEEN '2025-02-03' and '2025-05-30'
order by DATE_FORMAT(DATE_ADD(o.rgt_dt,INTERVAL 14 DAY)," %Y-%m-%d")
`; 
//업체코드로 검색 
const searchVdrNo=`SELECT  cpy_nm as 업체명 ,vdr_no as 업체코드,biz_reg_no as 사업자등록번호 ,mgr_nm as 담당자,mgr_ctt as 연락처,ofc_addr as 주소  
FROM vdr 
WHERE vdr_no= ?`; 
//업체명으로 검색 
const searchVdrNm=`SELECT  cpy_nm as 업체명 ,vdr_no as 업체코드,biz_reg_no as 사업자등록번호 ,mgr_nm as 담당자,mgr_ctt as 연락처,ofc_addr as 주소  
FROM vdr 
WHERE cpy_nm LIKE'%?%'`; 
// 수주,수주받은건 조회 
const selectOrdAllList=`
SELECT 
    o.ord_no,
    o.vdr_no,
    o.emp_no,
    o.due_dt,
    o.ord_sts,
    d.ord_dtl_no,
    d.prd_no,
   sum(d.prd_qty)
FROM ord o
JOIN ord_dtl d ON o.ord_no = d.ord_no
GROUP BY d.prd_no`;
//출하최대값찾기
const selectMaxSpmNo=`
 select max(spm_no) as maxSpmNo
 from spm`;
 //출하상세 최대값 찾기 
 
 //제품lot상세 번호 최댓값 찾기 
 const selectMaxPrdHistNo=`
 select max(prd_stk_hist_no) as maxLotNo
 from prd_stk_hist`;
 const selectMaxSpmDtlNo=`
 select max(spm_dtl_no) as maxSpmDtlNo
 from spm_dtl`;    
//출하지시 여러정보 찾기기 
const selectSpmInfo=`
SELECT o.vdr_no,o.emp_no,od.prd_qty ,od.prd_no ,o.ord_no,o.ord_sts  
 FROM  ord o JOIN ord_dtl od on(o.ord_no=od.ord_no)
 where o.ord_no=?`;     
const insertSpm=`
INSERT INTO spm (spm_no,ord_no,vdr_no,mgr,spm_dt,dlv_addr)
VALUES(?,?,?,?,?,?)`; 
const insertSpmDtl=`
INSERT INTO spm_dtl (spm_dtl_no,spm_no,qty,unt_prc,prd_no)
VALUES(?,?,?,?,?)`;

const updatePrdStk=`
UPDATE prd_stk 
SET cur_stk=cur_stk - ?
WHERE lot_no= ?
AND prd_no=?`;
const insertPrdStkdtl=`
INSERT INTO prd_stk_hist (prd_stk_hist_no,lot_no,io_tp,qty,dt,rel_doc)
 VALUES (?,?,?,?,?,?)`; 

 const prdMaxLotList=`
 select lot_no,prd_no,cur_stk
from prd_stk
where prd_no=?
ORDER BY cur_stk desc`;

const ordToSpmNo=`
select s.ord_no as 수주에서출하
from ord o  JOIN spm s on o.ord_no=s.ord_no
group by s.ord_no`; 

 module.exports={
  insertOrd,
  insertOrdDtl, 
  selectLastOrdNo,
  selectLastOrdDtlNo, 
  selectOrdList, 
  selectLastPrd,
  selectOrdAll,
  selectOrdDate,
  selectOrdDateOne, 
  selectOrdAllList, 
  selectMaxSpmNo,
  selectSpmInfo,
  selectMaxSpmDtlNo, 
  insertSpm,  
  insertSpmDtl,
  updatePrdStk,
  insertPrdStkdtl,
  selectMaxPrdHistNo,
  prdMaxLotList,
  ordToSpmNo,   
 }