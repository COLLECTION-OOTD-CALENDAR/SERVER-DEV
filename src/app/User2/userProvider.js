const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리 -> GET 처리

//if가만드는 로직~

//ID중복검사 함수 
exports.IDCheck = async function (ID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const IDCheckResult = await userDao.selectUserID(connection, ID);
  connection.release();

  return IDCheckResult;
};
 
//닉네임중복검사 함수
exports.nicknameCheck = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUsernickname(connection, nickname);
  connection.release();

  return nicknameCheckResult;
};

//PW확인 함수(WITH ID)
exports.passwordCheck = async function (selectID) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await userDao.selectUserPassword(connection, selectID);
  connection.release();
  return passwordCheckResult;
};

//PW확인 함수(WITH USERIDX)
exports.passwordCheckUserIdx = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn); 
  const passwordCheckResult = await userDao.selectUserPW(connection, userIdx);
  connection.release();
  return passwordCheckResult;
}


//계정확인 함수
exports.accountCheck = async function (ID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, ID);
  connection.release();

  return userAccountResult;
};

//아이디 찾기 함수
exports.findID = async function (name, phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  const findIDResultParams = [name, phoneNumber]

  const findIDResult = await userDao.selectUserfindID(connection, findIDResultParams);

  connection.release();

  return findIDResult;
};

//비밀번호 찾기 함수
exports.findPW = async function (name, ID, phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  const findPWResultParams = [name, ID, phoneNumber]

  const findPWResult = await userDao.selectUserfindPW(connection, [name, ID, phoneNumber]);

  connection.release();

  return findPWResult;
};