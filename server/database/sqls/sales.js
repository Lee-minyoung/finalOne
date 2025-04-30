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
`SELECT ord_no,
         vdr_no,
         emp_no,
         due_dt,
         ord_sts,
         rgt_dt,
         mdf_dt
  FROM ord`; 
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
      DATE(o.due_dt),
       p.prd_nm,
	   ps.cur_stk, 
       p.prd_no,  
       SUM(od.prd_qty)
FROM ord o JOIN  ord_dtl od on(o.ord_no=od.ord_no)
			     JOIN prd  p ON(od.prd_no=p.prd_no)
           JOIN prd_stk  ps ON(p.prd_no=ps.prd_no)
WHERE DATE(o.due_dt) BETWEEN ? and ?
GROUP BY DATE(o.due_dt), p.prd_nm`; 
//특정 날짜 주문 
const selectOrdDateOne=
`
SELECT 
      DATE(o.due_dt),
      p.prd_nm,
	    ps.cur_stk, 
      p.prd_no,  
      SUM(od.prd_qty)
FROM  ord o  JOIN  ord_dtl od on(o.ord_no=od.ord_no)
			       JOIN prd  p ON(od.prd_no=p.prd_no)
             JOIN prd_stk  ps ON(p.prd_no=ps.prd_no)
WHERE DATE(o.due_dt)  LIKE ?
`; 
//업체코드로 검색 
const searchVdrNo=`SELECT  cpy_nm as 업체명 ,vdr_no as 업체코드,biz_reg_no as 사업자등록번호 ,mgr_nm as 담당자,mgr_ctt as 연락처,ofc_addr as 주소  
FROM vdr 
WHERE vdr_no= ?`; 
//업체명으로 검색 
const searchVdrNm=`SELECT  cpy_nm as 업체명 ,vdr_no as 업체코드,biz_reg_no as 사업자등록번호 ,mgr_nm as 담당자,mgr_ctt as 연락처,ofc_addr as 주소  
FROM vdr 
WHERE cpy_nm LIKE'%?%'`; 

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
  searchVdrNo, 
  searchVdrNm, 
 }