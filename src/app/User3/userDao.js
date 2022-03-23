
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

//if가 만드는 로직~

// 유저 생성
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

module.exports = {
  insertUserInfo,
  selectUserID,
  selectUsernickname,
};