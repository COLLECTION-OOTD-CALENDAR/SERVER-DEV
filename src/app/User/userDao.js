// 0. 회원가입 - (유저 생성)
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
    INSERT INTO User(name, nickname, ID, password, birthday, gender, phoneNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}


//1. 중복ID 확인 - (ID만 가져오는 함수)
async function selectUserID(connection,ID) {
  const selectUserIDQuery = `
                  SELECT ID
                  FROM User
                  WHERE ID = ?;
                  `;
  const [IDRow] = await connection.query(selectUserIDQuery, ID);
  return IDRow;
}


//2. 닉네임 확인 - (닉네임만 가져오는 함수)
async function selectUsernickname(connection,nickname) {
  const selectUsernicknameQuery = `
                  SELECT nickname
                  FROM User
                  WHERE nickname = ?;
                  `;
  const [nicknameRow] = await connection.query(selectUsernicknameQuery, nickname);
  return nicknameRow;
}


//3. 로그인 - (PW확인 함수(WITH ID))
async function selectUserPassword(connection, selectID) {
  const selectUserPasswordQuery = `
        SELECT ID, password
        FROM User 
        WHERE ID = ?`;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery,selectID);
  return selectUserPasswordRow[0];
  
}

//4-2. 회원정보 수정(비밀번호) - (PW확인 함수(WITH USERIDX))
async function selectUserPW(connection, userIdx) {
  const selectUserPasswordQuery = `
        SELECT userIdx, password
        FROM User 
        WHERE userIdx = ?`;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery,userIdx);
  return selectUserPasswordRow[0];
}



//3. 로그인 - (ID로 계정의 STATUS여부 확인 함수)
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

//4-1. 회원정보 수정 (닉네임) - (회원정보 수정 (닉네임) update 함수)
async function updateNicknameInfo(connection, nickname, userIdx) {
  const updateUserQuery = `
    UPDATE User 
    SET nickname = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, userIdx]);
  return updateUserRow;
}


//4-2 . 회원정보 수정(비밀번호) - (회원정보 수정 (비밀번호) update 함수)
async function updatePWInfo(connection, updatePWResultParams) {
  const updateUserQuery = `
    UPDATE User 
    SET password = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, updatePWResultParams);
  return updateUserRow;
}


//4-3. 회원정보 수정(전화번호) - (회원정보 수정 (전화번호) update 함수)
async function updatePhoneInfo(connection, updatePhoneResultParams) {
  const updateUserQuery = `
    UPDATE User 
    SET phoneNumber = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, updatePhoneResultParams);
  return updateUserRow;
}

//5. 회원탈퇴 - (회원탈퇴 함수)
async function updateUnregisterUser(connection, userIdx) {
  const updateUserQuery = `
    UPDATE User 
    SET status = "inactive"
    WHERE userIdx = ?;`;
  const unregisterUserRow = await connection.query(updateUserQuery, userIdx);
  return unregisterUserRow;
}

//20. 아이디 찾기 - (ID찾기 함수)
async function selectUserfindID(connection, findIDResultParams) {
  const selectUserfindIDQuery = `
        SELECT ID
        FROM User 
        WHERE name = ? and phoneNumber = ?`;
  const selectUserIDRow = await connection.query(selectUserfindIDQuery,findIDResultParams);
  return selectUserIDRow[0];
}

//21.비밀번호 찾기 - (비밀번호 찾기 함수)
async function selectUserfindPW(connection, name, ID, phoneNumber) {
  const selectUserfindPWQuery = `
        SELECT password
        FROM User 
        WHERE name = ? and ID = ? and phoneNumber = ?`;
  const selectUserPasswordRow = await connection.query(selectUserfindPWQuery,[name, ID, phoneNumber]);
  return selectUserPasswordRow[0];
}

// 22. 비밀번호 재설정 API
async function updatePwdReset(connection, updatePWParams) {
  const updatePasswordQuery = `
    UPDATE User 
    SET password = ?, User.updateAt = CURRENT_TIMESTAMP
    WHERE userIdx = ?;`;
  const updatePasswordRow = await connection.query(updatePasswordQuery, updatePWParams);
  return updatePasswordRow;
};


module.exports = {
  //0.
  insertUserInfo,
  //1-5
  selectUserPassword,
  selectUserAccount,
  updateNicknameInfo,
  updatePWInfo,
  updatePhoneInfo,
  selectUserID,
  selectUsernickname,
  selectUserPW,
  updateUnregisterUser,

  //20,21
  selectUserfindID,
  selectUserfindPW,

  // 22. 비밀번호 재설정 API
  updatePwdReset,

};