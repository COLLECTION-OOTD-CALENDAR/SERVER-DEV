
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 검색 History 삭제하기 (개별) API

async function updateHistoryEach(connection, userIdx, PWWC,content) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content]);
  return updateSearchRow;
}

// 검색 History 삭제하기 (개별 - COLOR) API

async function updateHistoryColor(connection, userIdx, PWWC,content,color) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx= ? AND PWWC = ? AND content = ? AND color = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content,color]);
  return updateSearchRow;
}

// 검색 History 삭제하기 (전체) API
async function updateHistoryAll(connection, userIdx, PWWC) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC]);
  return updateSearchRow;
}

// History 검색 내역검사 
async function selectHistory(connection,userIdx,PWWC,conent) {
  const selectHistoryQuery = `
    SELECT content
    FROM History
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const [IDRow] = await connection.query(selectHistoryQuery, [userIdx,PWWC,conent]);
  return IDRow[0];
}






module.exports = {
  updateHistoryEach,
  updateHistoryColor,
  updateHistoryAll,
  selectHistory,
};
