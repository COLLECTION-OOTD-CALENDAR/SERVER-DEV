

//회원정보 수정 (비밀번호) update 함수
async function updatePwdReset(connection, updatePWParams) {
  const updatePasswordQuery = `
    UPDATE User 
    SET password = ?
    WHERE userIdx = ?;`;
  const updatePasswordRow = await connection.query(updatePasswordQuery, updatePWParams);
  return updatePasswordRow;
};



module.exports = {
  updatePwdReset
};