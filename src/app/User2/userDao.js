
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

//if가 만드는 로직~

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(name,nickname,ID,password,phoneNumber)
        VALUES (?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

//ID만 가져오는 함수
async function selectUserID(connection,ID) {
  const selectUserIDQuery = `
                  SELECT ID
                  FROM User
                  WHERE ID = ?;
                  `;
  const [IDRow] = await connection.query(selectUserIDQuery, ID);
  return IDRow;
}


//닉네임만 가져오는 함수
async function selectUsernickname(connection,nickname) {
  const selectUsernicknameQuery = `
                  SELECT nickname
                  FROM User
                  WHERE nickname = ?;
                  `;
  const [nicknameRow] = await connection.query(selectUsernicknameQuery, nickname);
  return nicknameRow;
}


//PW확인 함수(WITH ID)
async function selectUserPassword(connection, selectID) {
  const selectUserPasswordQuery = `
        SELECT ID, password
        FROM User 
        WHERE ID = ?`;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery,selectID);
  return selectUserPasswordRow[0];
  
}

//PW확인 함수(WITH USERIDX)
async function selectUserPW(connection, userIdx) {
  const selectUserPasswordQuery = `
        SELECT userIdx, password
        FROM User 
        WHERE userIdx = ?`;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery,userIdx);
  return selectUserPasswordRow[0];
}



//ID로 계정의 STATUS여부 확인 함수
async function selectUserAccount(connection, ID) {
  const selectUserAccountQuery = `
        SELECT status, ID, userIdx, nickname, name
        FROM User
        WHERE ID = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      ID
  );
  return selectUserAccountRow[0];
}

//회원정보 수정 (닉네임) update 함수
async function updateNicknameInfo(connection, nickname, userIdx) {
  const updateUserQuery = `
    UPDATE User 
    SET nickname = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, userIdx]);
  return updateUserRow;
}


//회원정보 수정 (비밀번호) update 함수
async function updatePWInfo(connection, updatePWResultParams) {
  const updateUserQuery = `
    UPDATE User 
    SET password = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, updatePWResultParams);
  return updateUserRow;
}


//회원정보 수정 (전화번호) update 함수
async function updatePhoneInfo(connection, updatePhoneResultParams) {
  const updateUserQuery = `
    UPDATE User 
    SET phoneNumber = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, updatePhoneResultParams);
  return updateUserRow;
}

//회원탈퇴 함수 
async function unregisterUser(connection, userIdx) {
  const updateUserQuery = `
    UPDATE User 
    SET status = "inactive"
    WHERE userIdx = ?;`;
  const unregisterUserRow = await connection.query(updateUserQuery, userIdx);
  return unregisterUserRow;
}


module.exports = {
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateNicknameInfo,
  updatePWInfo,
  updatePhoneInfo,
  selectUserID,
  selectUsernickname,
  selectUserPW,
  unregisterUser

};