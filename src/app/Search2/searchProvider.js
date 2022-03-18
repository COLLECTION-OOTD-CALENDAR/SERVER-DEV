const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

// Provider: Read 비즈니스 로직 처리

// History 검색 내역검사 함수
exports.historyCheck = async function (userIdx,PWWC,conent) {
  const connection = await pool.getConnection(async (conn) => conn);
  const historyCheckResult = await searchDao.selectHistory(connection, userIdx,PWWC,conent);
  connection.release();

  return historyCheckResult;
};