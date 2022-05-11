// 13. MY LOOK 메인 페이지 불러오기 - (OOTD 와 Photo DB를 JOIN해서 해당하는 ootdIdx와 photoIs등을 불러오기)
// 14. MY LOOK 상세 페이지 - (OOTD 와 Photo DB를 JOIN해서 해당하는 ootdIdx와 photoIs등을 불러오기)
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
