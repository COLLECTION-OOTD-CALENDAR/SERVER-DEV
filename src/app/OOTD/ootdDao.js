

// 입력한 content와의 중복 블럭 여부 체크 (content의 idx 반환) - AddedClothes
async function selectClothesTag(connection, userIdx, Content) {
  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

  const selectClothesTagListQuery = `
        SELECT smallClass 
        FROM AddedClothes
        WHERE userIdx = ? AND smallClass = ? AND status = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
};


// 입력한 content와의 중복 블럭 여부 체크 (content의 idx 반환) - PWW 중복 체크
async function selectPwwTag(connection, userIdx, flag, Content) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?;
    `;

  }
  if(flag == "Weather"){
    selectPwwTagListQuery = `
      SELECT weather 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?;
    `; 
  }
  if(flag == "Who"){
    selectPwwTagListQuery = `
      SELECT who 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?;
    `; 
  }

  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagParams);

  return tagRows;
};


// 새로운 블럭 추가 전 개수 체크 (총 개수 반환) - clothes
async function selectClothesNumber(connection, userIdx, flag) {  

  const selectTagNumParams = [userIdx, flag, "active"];// (userAdded)

  const selectClothesNumberListQuery = `
      SELECT smallClass 
      FROM AddedClothes
      WHERE userIdx = ? AND bigClass = ? AND status = ?;
                `;
  const [tagNumRows] = await connection.query(
        selectClothesNumberListQuery, 
        selectTagNumParams);

  return tagNumRows;
};



// 새로운 블럭 추가 전 개수 체크 (총 개수 반환) - PWW
async function selectPwwNumber(connection, userIdx, flag) {
  var selectPwwTagListQuery =``;
  if(flag == "Place"){
      selectPwwTagListQuery = `
        SELECT place 
        FROM AddedPlace
        WHERE userIdx = ? AND status = ?;
      `;

  }
  if(flag == "Weather"){
      selectPwwTagListQuery = `
        SELECT weather 
        FROM AddedWeather
        WHERE userIdx = ? AND status = ?;
      `; 
  }
  if(flag == "Who"){
      selectPwwTagListQuery = `
        SELECT who 
        FROM AddedWho
        WHERE userIdx = ? AND status = ?;
      `; 
  }

  const selectTagNumParams = [userIdx, "active"];// (userAdded)

   const [tagNumRows] = await connection.query(
        selectPwwTagListQuery, 
        selectTagNumParams);

  return tagNumRows;
};


// API 9 : 사용자 추가 블럭 등록 API - Clothes 블럭 추가
async function insertAddedClothes(connection, insertNewBlockParams) {
  const insertClothesQuery = `
      INSERT INTO AddedClothes(userIdx, bigClass, smallClass)
      VALUES (?, ?, ?);
  `;
  const insertClothesQueryRow = await connection.query(
      insertClothesQuery,
      insertNewBlockParams
  );

  return insertClothesQueryRow[0];
}

// API 9 : 사용자 추가 블럭 등록 API - Place 블럭 추가
async function insertAddedPlace(connection, insertNewBlockParams) {
  const insertPlaceQuery = `
      INSERT INTO AddedPlace(userIdx, place)
      VALUES (?, ?);
  `;
  const insertPlaceQueryRow = await connection.query(
      insertPlaceQuery,
      insertNewBlockParams
  );

  return insertPlaceQueryRow[0];
}

// API 9 : 사용자 추가 블럭 등록 API - Weather 블럭 추가
async function insertAddedWeather(connection, insertNewBlockParams) {
  const insertWeatherQuery = `
      INSERT INTO AddedWeather(userIdx, weather)
      VALUES (?, ?);
  `;
  const insertWeatherQueryRow = await connection.query(
      insertWeatherQuery,
      insertNewBlockParams
  );

  return insertWeatherQueryRow[0];
}

// API 9 : 사용자 추가 블럭 등록 API - Who 블럭 추가
async function insertAddedWho(connection, insertNewBlockParams) {
  const insertWhoQuery = `
      INSERT INTO AddedWho(userIdx, who)
      VALUES (?, ?);
  `;
  const insertWhoQueryRow = await connection.query(
      insertWhoQuery,
      insertNewBlockParams
  );

  return insertWhoQueryRow[0];
}



//Clothes 존재 체크 
async function selectClothesExist(connection, userIdx, flag, Content) {
  const selectTagParams = [userIdx, flag, Content, "active"];// (userAdded)

  const selectClothesTagListQuery = `
        SELECT status 
        FROM AddedClothes
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ? AND status = ?;
                `;
  const [tagRows] = await connection.query(
        selectClothesTagListQuery, 
        selectTagParams);

  return tagRows;
}

// PWW 존재 체크
async function selectPwwExist(connection, userIdx, flag, Content) {
  var selectPwwExistListQuery =``;
  if(flag == "Place"){
    selectPwwExistListQuery = `
        SELECT status 
        FROM AddedPlace
        WHERE userIdx = ? AND place = ? AND status = ?
    `;

  }
  if(flag == "Weather"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWeather
      WHERE userIdx = ? AND weather = ? AND status = ?
    `; 
  }
  if(flag == "Who"){
    selectPwwExistListQuery = `
      SELECT status 
      FROM AddedWho
      WHERE userIdx = ? AND who = ? AND status = ?
    `; 
  }

  const selectTagParams = [userIdx, Content, "active"];// (userAdded)

   const [tagRows] = await connection.query(
        selectPwwExistListQuery, 
        selectTagParams);

  return tagRows;
}



// API 9-1 : 사용자 추가 블럭 삭제 API - Clothes 블럭 삭제
async function deleteAddedClothes(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, flag, Content];
    const updateBlockQuery = `
        UPDATE AddedClothes 
        SET status = "inactive", AddedClothes.updateAt = CURRENT_TIMESTAMP
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ?;
        `;
    const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
    return updateBlockRow[0];
}

// API 9-1 : 사용자 추가 블럭 삭제 API - Place 블럭 삭제
async function deleteAddedPlace(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedPlace
      SET status = "inactive", AddedPlace.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND place = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

// API 9-1 : 사용자 추가 블럭 삭제 API - Weather 블럭 삭제
async function deleteAddedWeather(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWeather 
      SET status = 'inactive', AddedWeather.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND weather = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}

// API 9-1 : 사용자 추가 블럭 삭제 API - Who 블럭 삭제
async function deleteAddedWho(connection, deleteNewBlockParams){  //deleteNewBlockParams = [userIdx, Content];
  const updateBlockQuery = `
      UPDATE AddedWho
      SET status = 'inactive', AddedWho.updateAt = CURRENT_TIMESTAMP
      WHERE userIdx = ? AND who = ?;
      `;
  const updateBlockRow = await connection.query(updateBlockQuery, deleteNewBlockParams);
  return updateBlockRow[0];
}



// OOTD 삭제하기 전 존재하는 OOTD인지 체크 (ootd의 idx반환)
async function selectOotdExist(connection, selectOotdExistParams) {
  const selectOotdExistQuery = `
        SELECT ootdIdx 
        FROM OOTD
        WHERE userIdx = ? AND date = ? AND status = ?;
                `;
  const [ootdRows] = await connection.query(
        selectOotdExistQuery, 
        selectOotdExistParams);

  return ootdRows;
}


// API 11 :  OOTD 삭제하기 API - ootd 삭제
async function deleteOotdData(connection, userIdx, ootdIdx){  //
  
  const deleteOotdParams = [userIdx, ootdIdx];
  const updateOotdQuery = `
      UPDATE OOTD
      SET OOTD.status = 'inactive', OOTD.updateAt = CURRENT_TIMESTAMP
      WHERE OOTD.userIdx = ? AND OOTD.ootdIdx = ?;
      `;
    const updateOotdRow = await connection.query(updateOotdQuery, deleteOotdParams);

    return updateOotdRow[0];
}

// API 11 :  OOTD 삭제하기 API - Clothes 삭제
async function deleteClothesData(connection, ootdIdx){  //
  const updateClothesQuery= `
      UPDATE Clothes
      SET Clothes.status = 'inactive', Clothes.updateAt = CURRENT_TIMESTAMP
      WHERE Clothes.ootdIdx = ?;
      `;
  const updateClothesRow = await connection.query(updateClothesQuery, ootdIdx);
  return updateClothesRow[0];
  
}

// API 11 :  OOTD 삭제하기 API - photo 삭제
async function deletePhotoData(connection, ootdIdx){  //
  const updatePhotoQuery= `
      UPDATE Photo, OOTD
      SET Photo.status = 'inactive', Photo.updateAt = CURRENT_TIMESTAMP
      WHERE OOTD.photoIs = ? AND Photo.ootdIdx = ? ;
      `;
  const deletePhotoParams = [0, ootdIdx]
  const updatePhotoRow = await connection.query(updatePhotoQuery, deletePhotoParams);

  return updatePhotoRow[0];  
}


// API 11 :  OOTD 삭제하기 API - Place 삭제
async function deletePlaceData(connection, ootdIdx){  //
  const updatePlaceQuery= `
      UPDATE Place
      SET Place.status = 'inactive', Place.updateAt = CURRENT_TIMESTAMP
      WHERE Place.ootdIdx = ?;
      `;
  const updatePlaceRow = await connection.query(updatePlaceQuery, ootdIdx);
  return updatePlaceRow[0];  
}

// API 11 :  OOTD 삭제하기 API - Weather 삭제
async function deleteWeatherData(connection, ootdIdx){  //
  const updateWeatherQuery= `
      UPDATE Weather
      SET Weather.status = 'inactive', Weather.updateAt = CURRENT_TIMESTAMP
      WHERE Weather.ootdIdx = ?;
      `;
  const updateWeatherRow = await connection.query(updateWeatherQuery, ootdIdx);
  return updateWeatherRow[0];  
}

// API 11 :  OOTD 삭제하기 API - Who 삭제
async function deleteWhoData(connection, ootdIdx){  //
  const updateWhoQuery= `
      UPDATE Who
      SET Who.status = 'inactive', Who.updateAt = CURRENT_TIMESTAMP
      WHERE Who.ootdIdx = ?;
      `;
  const updateWhoRow = await connection.query(updateWhoQuery, ootdIdx);
  return updateWhoRow[0];  
}







// 새로운 블럭 추가 전 기본 블럭에 존재하는 블럭인지 체크 (idx 반환)
async function selectFixedClothesTag(connection, Content) {

  const selectFixedClothesTagListQuery = `
        SELECT smallClass 
        FROM FixedClothes
        WHERE smallClass = ?;
                `;
  const [tagRows] = await connection.query(
    selectFixedClothesTagListQuery, 
    Content);

  return tagRows;
};

// 새로운 블럭 추가 전 기본 블럭에 존재하는 블럭인지 체크 (idx 반환)
async function selectFixedPwwTag(connection, pwwflag, Content) {
  var selectFixedPwwTagListQuery =``;
  if(pwwflag == "Place"){
    selectFixedPwwTagListQuery = `
        SELECT place 
        FROM FixedPlace
        WHERE place = ?;
    `;

  }
  if(pwwflag == "Weather"){
    selectFixedPwwTagListQuery = `
      SELECT weather 
      FROM FixedWeather
      WHERE weather = ?;
    `; 
  }
  if(pwwflag == "Who"){
    selectFixedPwwTagListQuery = `
      SELECT who 
      FROM FixedWho
      WHERE who = ? ;
    `; 
  }

   const [tagRows] = await connection.query(
        selectFixedPwwTagListQuery, 
        Content);

  return tagRows;
};


module.exports = {
  selectClothesTag,
  selectPwwTag,
  selectClothesNumber,
  selectPwwNumber,
  insertAddedClothes,
  insertAddedPlace,
  insertAddedWeather,
  insertAddedWho,
  selectClothesExist,
  selectPwwExist,
  deleteAddedClothes,
  deleteAddedPlace,
  deleteAddedWeather,
  deleteAddedWho,
  selectOotdExist,
  deleteOotdData,
  deleteClothesData,
  deletePhotoData,
  deletePlaceData,
  deleteWeatherData,
  deleteWhoData,
  selectFixedClothesTag,
  selectFixedPwwTag,
};
