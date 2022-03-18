
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.


//if가 만드는 로직 ~
async function getOOTD(connection,getOOTDResultParams) {
  const getOOTDQuery = `
  SELECT distinct O.ootdIdx, O.date, O.photoIs, P.imageUrl, P.thumbnail
  FROM OOTD AS O
      LEFT OUTER JOIN Photo P on O.ootdIdx = P.ootdIdx
  WHERE O.lookpoint = ? AND O.userIdx= ? AND O.status= "active" ORDER BY O.date DESC;`;
  const getOOTDRow = await connection.query(getOOTDQuery,getOOTDResultParams);
  
  return getOOTDRow[0];
  
}


module.exports = {
  getOOTD,
};
