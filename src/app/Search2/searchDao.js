// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (개별 API)
async function updateHistoryEach(connection, userIdx, PWWC,content) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (개별 중 COLOR API)
async function updateHistoryColor(connection, userIdx, PWWC,content,color) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx= ? AND PWWC = ? AND content = ? AND color = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content,color]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (전체 삭제 API)
async function updateHistoryAll(connection, userIdx, PWWC) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (History 검색 내역검사) 
async function selectHistory(connection,userIdx,PWWC,content) {
  const selectHistoryQuery = `
    SELECT content
    FROM History
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const IDRow = await connection.query(selectHistoryQuery, [userIdx,PWWC,content]);
  return IDRow[0];
}


module.exports = {
  updateHistoryEach,
  updateHistoryColor,
  updateHistoryAll,
  selectHistory,
};
