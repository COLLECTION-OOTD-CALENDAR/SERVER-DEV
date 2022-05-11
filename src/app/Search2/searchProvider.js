const { pool } = require("../../../config/database");

const searchDao = require("./searchDao");

// 16. [PWWC] 검색 History 삭제하기(개별,전체) 
exports.checkHistory = async function (userIdx,PWWC,content) {
  const connection = await pool.getConnection(async (conn) => conn);
  const historyCheckResult = await searchDao.selectHistory(connection, userIdx,PWWC,content);
  connection.release();

  return historyCheckResult;
};