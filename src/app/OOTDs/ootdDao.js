
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

/*************************************************************** */
/***********************Provider 호출 함수*********************** */
/*************************************************************** */

// 8. OOTD 최종 등록하기 - 입력된 date에 해당하는 ootd 존재 여부 체크
async function selectDateOotd(connection, userIdx, date) {

  const selectDateOotdQuery = `
                SELECT ootdIdx, userIdx, date
                FROM OOTD
                WHERE userIdx = ? AND date = ? AND status = 'active';
                `;

  const [ootdDateRow] = await connection.query(selectDateOotdQuery, [userIdx, date]);
  return ootdDateRow[0];
};


// 8. OOTD 최종 등록하기 - fixedClothes의 index 존재 여부 체크
async function selectClothesIdxIs(connection, data) {

  const selectClothesIdxQuery = `
                SELECT FC.index, bigClass, smallClass
                FROM FixedClothes AS FC
                WHERE FC.index = ?;
                `;
  const selectFClothesRow = await connection.query(selectClothesIdxQuery, data);
  return selectFClothesRow[0];
};

// 8. OOTD 최종 등록하기 - addedClothes의 smallClass 존재 여부 체크
async function selectClothesIs(connection, userIdx, data) {

  const selectClothesQuery = `
                SELECT AC.index, userIdx, smallClass
                FROM AddedClothes AS AC
                WHERE userIdx = ? AND smallClass = ? AND status = 'active';
                `;
  const selectAClothesRow = await connection.query(selectClothesQuery, [userIdx, data]);
  return selectAClothesRow[0];
};


// 8. OOTD 최종 등록하기 - fixedPlace의 index 존재 여부 체크
async function selectPlaceIdxIs(connection, data) {

  const selectPlaceIdxQuery = `
                SELECT FP.index, place
                FROM FixedPlace AS FP
                WHERE FP.index = ?;
                `;
  const selectFPlaceRow = await connection.query(selectPlaceIdxQuery, data);
  return selectFPlaceRow[0];
};

// 8. OOTD 최종 등록하기 - addedPlace의 place 존재 여부 체크
async function selectPlaceIs(connection, userIdx, data) {

  const selectPlaceQuery = `
                SELECT AP.index, userIdx, place
                FROM AddedPlace AS AP
                WHERE userIdx = ? AND place = ? AND status = 'active';
                `;
  const selectAPlaceRow = await connection.query(selectPlaceQuery, [userIdx, data]);
  return selectAPlaceRow[0];
};


// 8. OOTD 최종 등록하기 - fixedWeather의 index 존재 여부 체크
async function selectWeatherIdxIs(connection, data) {

  const selectWeatherIdxQuery = `
                SELECT FW.index, weather
                FROM FixedWeather AS FW
                WHERE FW.index = ?;
                `;
  const selectFWeatherRow = await connection.query(selectWeatherIdxQuery, data);
  return selectFWeatherRow[0];
};

// 8. OOTD 최종 등록하기 - addedWeather의 weather 존재 여부 체크
async function selectWeatherIs(connection, userIdx, data) {

  const selectWeatherQuery = `
                SELECT AW.index, userIdx, weather
                FROM AddedWeather AS AW
                WHERE userIdx = ? AND weather = ? AND status = 'active';
                `;
  const selectAWeatherRow = await connection.query(selectWeatherQuery, [userIdx, data]);
  return selectAWeatherRow[0];
};


// 8. OOTD 최종 등록하기 - fixedWho의 index 존재 여부 체크
async function selectWhoIdxIs(connection, data) {

  const selectWhoIdxQuery = `
                SELECT FWH.index, who
                FROM FixedWho AS FWH
                WHERE FWH.index = ?;
                `;
  const selectFWhoRow = await connection.query(selectWhoIdxQuery, data);
  return selectFWhoRow[0];
};

// 8. OOTD 최종 등록하기 - addedWeather의 who 존재 여부 체크
async function selectWhoIs(connection, userIdx, data) {

  const selectWhoQuery = `
                SELECT AWH.index, userIdx, who
                FROM AddedWho AS AWH
                WHERE userIdx = ? AND who = ? AND status = 'active';
                `;
  const selectAWhoRow = await connection.query(selectWhoQuery, [userIdx, data]);
  return selectAWhoRow[0];
};


/*************************************************************** */
/************************Service 호출 함수*********************** */
/*************************************************************** */

// 8. OOTD 최종 등록하기 - OOTD 테이블
async function insertNewOotd(connection, lastRegisterOotdParams) {
  const insertNewOotdQuery = `
        INSERT INTO OOTD(userIdx, date, lookname, photoIs, lookpoint, comment)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
  const insertNewOotdRow = await connection.query(
    insertNewOotdQuery,
    lastRegisterOotdParams
  );

  return insertNewOotdRow;
};

// 8. OOTD 최종 등록하기 - Photo 테이블
async function insertOotdPhoto(connection, ootdIdx, image) {
  const insertOotdPhotoQuery = `
        INSERT INTO Photo(ootdIdx, thumbnail, imageUrl)
        VALUES (?, ?, ?);
    `;

  let insertOotdPhotoRows = [];

  for (item of image){
    let insertOotdPhotoEach = await connection.query(
      insertOotdPhotoQuery,
      [ootdIdx, item["thumbnail"], item["imageUrl"]]);
    insertOotdPhotoRows.push(insertOotdPhotoEach);
  }

  return insertOotdPhotoRows;
};


// 8. OOTD 최종 등록하기 - AddedClothes 테이블 내 일치하는 index 찾기
async function selectAddedClothesIdx(connection, userIdx, aClothes){
  const selectAddedClothesIdxQuery = `
        SELECT AC.index
        FROM AddedClothes AS AC
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ? AND status = 'active'
        ;`;
  
  let returnList = [];
  for (item of aClothes){
    let [selectAddedClothesIdxEach] = await connection.query(
      selectAddedClothesIdxQuery, [userIdx, item["bigClass"], item["smallClass"]]
    );
    returnList.push(selectAddedClothesIdxEach[0].index);
  }
  return returnList;
};


// 8. OOTD 최종 등록하기 - Clothes 테이블 내 fixedType
async function insertOotdFClothes(connection, ootdIdx, ootdFixedClothes) {
  const insertOotdFClothesQuery = `
        INSERT INTO Clothes(ootdIdx, fixedType, color)
        VALUES (?, ?, ?);
    `;

  let insertOotdClothesRows = [];
  for (item of ootdFixedClothes){
    let insertOotdClothesEach = await connection.query(
      insertOotdFClothesQuery,
      [ootdIdx, item["index"], item["color"]]);
      insertOotdClothesRows.push(insertOotdClothesEach);
  }
  return insertOotdClothesRows;
};


// 8. OOTD 최종 등록하기 - Clothes 테이블 내 addedType
async function insertOotdAClothes(connection, ootdIdx, ootdAddedClothes) {
  const insertOotdAClothesQuery = `
        INSERT INTO Clothes(ootdIdx, addedType, color)
        VALUES (?, ?, ?);
    `;

  let insertOotdClothesRows = [];
  for (item of ootdAddedClothes){
    let insertOotdClothesEach = await connection.query(
      insertOotdAClothesQuery,
      [ootdIdx, item["index"], item["color"]]);
      insertOotdClothesRows.push(insertOotdClothesEach);
  }
  return insertOotdClothesRows;
};


// 8. OOTD 최종 등록하기 - AddedClothes 테이블 내 cond 변경하기
async function patchAClothesCond(connection, AClothesIdxList){
  const updateAClothesCondQuery =  `
        UPDATE AddedClothes
        SET cond = 'selected'
        WHERE AddedClothes.index = ?;
  `;

  for (item of AClothesIdxList){
    var updateAClothesCondEach = await connection.query(
      updateAClothesCondQuery, item);
  }

  return AClothesIdxList;
}

// 8. OOTD 최종 등록하기 - AddedPlace 테이블 내 일치하는 index 찾기
async function selectAddedPlaceIdx(connection, userIdx, aPlace) {
  const selectAddedPlaceIdxQuery = `
          SELECT AP.index
          FROM AddedPlace AS AP
          WHERE userIdx = ? AND place = ? AND status = 'active';
          `;
  
  let addedPlaceIdxRows = [];
  for (place of aPlace){
    let [addedPlaceIdxEach] = await connection.query(
      selectAddedPlaceIdxQuery, [userIdx, place]);
    addedPlaceIdxRows.push(addedPlaceIdxEach[0].index);
  }
  return addedPlaceIdxRows;

};

// 8. OOTD 최종 등록하기 - Place 테이블 내 -1, -1
async function insertOotdPlace (connection, ootdIdx) {
  const insertOotdPlaceQuery = `
        INSERT INTO Place(ootdIdx)
        VALUES (?);
        `;
  const insertOotdPlaceRow = await connection.query(
    insertOotdPlaceQuery, ootdIdx);
  return insertOotdPlaceRow;
};

// 8. OOTD 최종 등록하기 - Place 테이블 내 fixedPlace
async function insertOotdFPlace (connection, ootdIdx, fPlace) {
  const insertOotdFPlaceQuery = `
        INSERT INTO Place(ootdIdx, fixedPlace)
        VALUES (?, ?);
    `;

  let insertOotdPlaceRows = [];
  for (item of fPlace){
    let insertOotdPlaceEach = await connection.query(
      insertOotdFPlaceQuery,
      [ootdIdx, item]);
    insertOotdPlaceRows.push(insertOotdPlaceEach);
  }
  return insertOotdPlaceRows;
};

// 8. OOTD 최종 등록하기 - Place 테이블 내 addedPlace
async function insertOotdAPlace (connection, ootdIdx, APlaceIdxList) {
  const insertOotdAPlaceQuery = `
        INSERT INTO Place(ootdIdx, addedPlace)
        VALUES (?, ?);
    `;

  let insertOotdPlaceRows = [];
  for (item of APlaceIdxList){
    let insertOotdPlaceEach = await connection.query(
      insertOotdAPlaceQuery,
      [ootdIdx, item]);
    insertOotdPlaceRows.push(insertOotdPlaceEach);
  }
  return insertOotdPlaceRows;
};

// 8. OOTD 최종 등록하기 - AddedPlace 테이블 내 cond 변경하기
async function patchAPlaceCond(connection, APlaceIdxList){
  const updateAPlaceCondQuery =  `
        UPDATE AddedPlace
        SET cond = 'selected'
        WHERE AddedPlace.index = ?;`;

  for (item of APlaceIdxList){
    var updateAPlaceCondEach = await connection.query(
      updateAPlaceCondQuery, item);
  }
  return APlaceIdxList;
}

// 8. OOTD 최종 등록하기 - AddedWeather 테이블 내 일치하는 index 찾기
async function selectAddedWeatherIdx(connection, userIdx, aWeather) {
  const selectAddedWeatherIdxQuery = `
          SELECT AW.index
          FROM AddedWeather AS AW
          WHERE userIdx = ? AND weather = ? AND status = 'active';
          `;
  
  let addedWeatherIdxRows = [];
  for (weather of aWeather){
    let [addedWeatherIdxEach] = await connection.query(
      selectAddedWeatherIdxQuery, [userIdx, weather]);
    addedWeatherIdxRows.push(addedWeatherIdxEach[0].index);
  }
  return addedWeatherIdxRows;
};

// 8. OOTD 최종 등록하기 - Weather 테이블 내 -1, -1
async function insertOotdWeather (connection, ootdIdx) {
  const insertOotdWeatherQuery = `
        INSERT INTO Weather(ootdIdx)
        VALUES (?);
        `;
  const insertOotdWeatherRow = await connection.query(
    insertOotdWeatherQuery, ootdIdx);
  return insertOotdWeatherRow;
};

// 8. OOTD 최종 등록하기 - Weather 테이블 내 fixedWeather
async function insertOotdFWeather(connection, ootdIdx, fWeather) {
  const insertOotdFWeatherQuery = `
        INSERT INTO Weather(ootdIdx, fixedWeather)
        VALUES (?, ?);
    `;

  let insertOotdWeatherRows = [];
  for (item of fWeather){
    let insertOotdWeatherEach = await connection.query(
      insertOotdFWeatherQuery,
      [ootdIdx, item]);
      insertOotdWeatherRows.push(insertOotdWeatherEach);
  }
  return insertOotdWeatherRows;
};

// 8. OOTD 최종 등록하기 - Weather 테이블 내 addedWeather
async function insertOotdAWeather(connection, ootdIdx, AWeatherIdxList) {
  const insertOotdAWeatherQuery = `
        INSERT INTO Weather(ootdIdx, addedWeather)
        VALUES (?, ?);
    `;

  let insertOotdWeatherRows = [];
  for (item of AWeatherIdxList){
    let insertOotdWeatherEach = await connection.query(
      insertOotdAWeatherQuery,
      [ootdIdx, item]);
      insertOotdWeatherRows.push(insertOotdWeatherEach);
  }
  return insertOotdWeatherRows;
};

// 8. OOTD 최종 등록하기 - AddedWeather 테이블 내 cond 변경하기
async function patchAWeatherCond(connection, AWeatherIdxList){
  const updateAWeatherCondQuery =  `
        UPDATE AddedWeather
        SET cond = 'selected'
        WHERE AddedWeather.index = ?
  `;

  for (item of AWeatherIdxList){
    var updateAWeatherCondEach = await connection.query(
      updateAWeatherCondQuery, item);
  }
  return AWeatherIdxList;
}

// 8. OOTD 최종 등록하기 = AddedWho 테이블 내 일치하는 index 찾기
async function selectAddedWhoIdx(connection, userIdx, aWho) {
  const selectAddedWhoIdxQuery = `
          SELECT AWH.index
          FROM AddedWho AS AWH
          WHERE userIdx = ? AND who = ? AND status = 'active';
          `;
  
  let addedWhoIdxRows = [];
  for (who of aWho){
    let [addedWhoIdxEach] = await connection.query(
      selectAddedWhoIdxQuery, [userIdx, who]);
    addedWhoIdxRows.push(addedWhoIdxEach[0].index);
  }
  return addedWhoIdxRows;
};


// 8. OOTD 최종 등록하기 - Who 테이블 내 -1, -1
async function insertOotdWho (connection, ootdIdx) {
  const insertOotdWhoQuery = `
        INSERT INTO Who(ootdIdx)
        VALUES (?);
        `;
  const insertOotdWhoRow = await connection.query(
    insertOotdWhoQuery, ootdIdx);
  return insertOotdWhoRow;
};


// 8. OOTD 최종 등록하기 - Who 테이블 내 fixedWho
async function insertOotdFWho(connection, ootdIdx, fWho) {
  const insertOotdFWhoQuery = `
        INSERT INTO Who(ootdIdx, fixedWho)
        VALUES (?, ?);
    `;

  let insertOotdWhoRows = [];
  for (item of fWho){
    let insertOotdWhoEach = await connection.query(
      insertOotdFWhoQuery,
      [ootdIdx, item]);
      insertOotdWhoRows.push(insertOotdWhoEach);
  }
  return insertOotdWhoRows;
};

// 8. OOTD 최종 등록하기 - Who 테이블 내 addedWho
async function insertOotdAWho(connection, ootdIdx, AWhoIdxList) {
  const insertOotdAWhoQuery = `
        INSERT INTO Who(ootdIdx, addedWho)
        VALUES (?, ?);
    `;

  let insertOotdWhoRows = [];
  for (item of AWhoIdxList){
    let insertOotdWhoEach = await connection.query(
      insertOotdAWhoQuery,
      [ootdIdx, item]);
      insertOotdWhoRows.push(insertOotdWhoEach);
  }
  return insertOotdWhoRows;
};

// 8. OOTD 최종 등록하기 - AddedWho 테이블 내 cond 변경하기
async function patchAWhoCond(connection, AWhoIdxList){
  const updateAWhoCondQuery =  `
        UPDATE AddedWho
        SET cond = 'selected'
        WHERE AddedWho.index = ?
  `;

  for (item of AWhoIdxList){
    var updateAWhoCondEach = await connection.query(
      updateAWhoCondQuery, item);
  }
  return AWhoIdxList;
}

// 10. OOTD 수정하기 - 지난 작성 화면 불러오기
async function selectModiDateOotd(connection, userIdx){
  const selectModiDateOotdQuery = `
            SELECT distinct O.userIdx, AP.place, AW.weather, AWH.who,
            AC.bigClass, AC.smallClass
            
            FROM OOTD AS O
            LEFT JOIN (SELECT userIdx, place
                    FROM AddedPlace
                    WHERE status = 'active') AS AP
                ON AP.userIdx = O.userIdx
            LEFT JOIN (SELECT userIdx, weather
                    FROM AddedWeather
                    WHERE status = 'active') AS AW
                ON AW.userIdx = O.userIdx
            LEFT JOIN (SELECT userIdx, who
                    FROM AddedWho
                    WHERE status = 'active') AS AWH
                ON AWH.userIdx = O.userIdx
            LEFT JOIN (SELECT userIdx, bigClass, smallClass
                    FROM AddedClothes
                    WHERE status = 'active') AS AC
                ON AC.userIdx = O.userIdx
            WHERE O.userIdx = ?;
            `;
  const [modiDateOotd] = await connection.query(selectModiDateOotdQuery, userIdx);
  return modiDateOotd;
}


// 12. OOTD 완료 페이지 불러오기
async function selectCompleteDateOotd(connection, userIdx, date) {
  const selectCompleteDateOotdQuery = `
            SELECT distinct O.ootdIdx, O.date, O.lookname, O.lookpoint, O.comment,
              TMPH.imageUrl, TMPH.thumbnail, TMPL.fpName, TMPL.apName,
              TMWE.fwName, TMWE.awName, TMWH.fwhName, TMWH.awhName,
              TMCL.color, TMCL.fixedBig, TMCL.fixedSmall, TMCL.addedBig, TMCL.addedSmall

            FROM OOTD AS O
            LEFT JOIN ( SELECT Ph.ootdIdx, Ph.imageUrl, Ph.thumbnail
              FROM Photo AS Ph
                RIGHT JOIN OOTD AS O
                  ON Ph.ootdIdx = O.ootdIdx) AS TMPH
              ON O.ootdIdx = TMPH.ootdIdx
            LEFT JOIN ( SELECT PL.ootdIdx, PL.fixedPlace, PL.addedPlace, FP.place AS fpName, AP.place AS apName
              FROM Place as PL
                LEFT JOIN FixedPlace AS FP
                  ON PL.fixedPlace = FP.index
                LEFT JOIN AddedPlace AS AP
                  ON PL.addedPlace = AP.index AND (cond = 'selected' OR
                                                  (cond = 'unselected' AND AP.status = 'active'))
                ) AS TMPL
              ON O.ootdIdx = TMPL.ootdIdx
            LEFT JOIN ( SELECT WE.ootdIdx, WE.fixedWeather, WE.addedWeather, FW.weather AS fwName, AW.weather AS awName
              FROM Weather as WE
                LEFT JOIN FixedWeather AS FW
                  ON WE.fixedWeather = FW.index
                LEFT JOIN AddedWeather AS AW
                  ON WE.addedWeather = AW.index AND (cond = 'selected' OR
                                                  (cond = 'unselected' AND AW.status = 'active'))
              ) AS TMWE
              ON O.ootdIdx = TMWE.ootdIdx
            LEFT JOIN ( SELECT WH.ootdIdx, WH.fixedWho, WH.addedWho, FWH.who AS fwhName, AWH.who AS awhName
              FROM Who as WH
                LEFT JOIN FixedWho AS FWH
                    ON WH.fixedWho = FWH.index
                LEFT JOIN AddedWho AS AWH
                    ON WH.addedWho = AWH.index AND (cond = 'selected' OR
                                                  (cond = 'unselected' AND AWH.status = 'active'))
              ) AS TMWH
              ON O.ootdIdx = TMWH.ootdIdx
            LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
              FROM Clothes AS CL
                LEFT JOIN FixedClothes AS FC
                  ON CL.fixedType = FC.index
                LEFT JOIN AddedClothes AS AC
                  ON CL.addedType = AC.index  AND (cond = 'selected' OR
                                                  (cond = 'unselected' AND AC.status = 'active'))
                ) AS TMCL
              ON O.ootdIdx = TMCL.ootdIdx
            WHERE O.userIdx = ? AND O.date = ?;
            `;
  const [completeDateOotd] = await connection.query(selectCompleteDateOotdQuery, [userIdx, date]);
  return completeDateOotd;

};

module.exports = {
  selectDateOotd,
  selectClothesIdxIs,
  selectClothesIs,
  selectPlaceIdxIs,
  selectPlaceIs,
  selectWeatherIdxIs,
  selectWeatherIs,
  selectWhoIdxIs,
  selectWhoIs,
  insertNewOotd,
  insertOotdPhoto,
  selectAddedClothesIdx,
  insertOotdFClothes,
  insertOotdAClothes,
  patchAClothesCond,
  selectAddedPlaceIdx,
  insertOotdPlace,
  insertOotdFPlace,
  insertOotdAPlace,
  patchAPlaceCond,
  selectAddedWeatherIdx,
  insertOotdWeather,
  insertOotdFWeather,
  insertOotdAWeather,
  patchAWeatherCond,
  selectAddedWhoIdx,
  insertOotdWho,
  insertOotdFWho,
  insertOotdAWho,
  patchAWhoCond,
  selectCompleteDateOotd,
  selectModiDateOotd
};
