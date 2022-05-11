const { pool } = require("../../../config/database");

const userDao = require("./userDao");


//1. 중복ID 확인 - (ID중복검사 함수)
exports.IDCheck = async function (ID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const IDCheckResult = await userDao.selectUserID(connection, ID);
  connection.release();

  return IDCheckResult;
};
 
//2. 닉네임 확인 - (닉네임중복검사 함수)
exports.nicknameCheck = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUsernickname(connection, nickname);
  connection.release();

  return nicknameCheckResult;
};

//3. 로그인 - (PW확인 함수(WITH ID))
exports.passwordCheck = async function (selectID) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectUserPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await userDao.selectUserPassword(connection, selectID);
  connection.release();
  return passwordCheckResult;
};

//4-2. 회원정보 수정(비밀번호) - PW확인 함수(WITH USERIDX)
exports.passwordCheckUserIdx = async function(userIdx) {
  const connection = await pool.getConnection(async (conn) => conn); 
  const passwordCheckResult = await userDao.selectUserPW(connection, userIdx);
  connection.release();
  return passwordCheckResult;
}


//3. 로그인 - (계정확인 함수)
exports.accountCheck = async function (ID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, ID);
  connection.release();

  return userAccountResult;
};

//20. 아이디 찾기 - (아이디 찾기 함수)
exports.findID = async function (name, phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  const findIDResultParams = [name, phoneNumber]

  const findIDResult = await userDao.selectUserfindID(connection, findIDResultParams);

  connection.release();

  return findIDResult;
};

//21.비밀번호 찾기 - (비밀번호 찾기 함수)
exports.findPW = async function (name, ID, phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);

  const findPWResult = await userDao.selectUserfindPW(connection, name, ID, phoneNumber);

  connection.release();

  return findPWResult;
};