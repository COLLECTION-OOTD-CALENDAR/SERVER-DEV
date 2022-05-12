const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리 -> GET 처리

//if가만드는 로직~

//ID중복검사 함수 
exports.checkID = async function (ID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const IDCheckResult = await userDao.selectUserID(connection, ID);
  connection.release();

  return IDCheckResult;
};
 
//닉네임중복검사 함수
exports.checkNickname = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUsernickname(connection, nickname);
  connection.release();

  return nicknameCheckResult;
};