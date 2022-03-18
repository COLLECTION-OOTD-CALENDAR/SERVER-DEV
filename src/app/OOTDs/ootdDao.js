
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

//  입력된 date에 해당하는 ootd 존재 여부 체크
async function checkDateOotd(connection, userIdx, date) {

  const checkDateOotdQuery = `
                SELECT ootdIdx, userIdx, date
                FROM OOTD
                WHERE userIdx = ? AND date = ? AND status = 'active';
                `;

  const [ootdDateRow] = await connection.query(checkDateOotdQuery, [userIdx, date]);
  return ootdDateRow[0];
};


// fixedClothes의 index 존재 여부 체크
async function checkClothesIdxIs(connection, data) {

  const checkClothesIdxQuery = `
                SELECT FC.index, bigClass, smallClass
                FROM FixedClothes AS FC
                WHERE FC.index = ?;
                `;
  const checkFClothesRow = await connection.query(checkClothesIdxQuery, data);
  return checkFClothesRow[0];
};

// addedClothes의 smallClass 존재 여부 체크
async function checkClothesIs(connection, userIdx, data) {

  const checkClothesQuery = `
                SELECT AC.index, userIdx, smallClass
                FROM AddedClothes AS AC
                WHERE userIdx = ? AND smallClass = ? AND status = 'active';
                `;
  const checkAClothesRow = await connection.query(checkClothesQuery, [userIdx, data]);
  return checkAClothesRow[0];
};


// fixedPlace의 index 존재 여부 체크
async function checkPlaceIdxIs(connection, data) {

  const checkPlaceIdxQuery = `
                SELECT FP.index, place
                FROM FixedPlace AS FP
                WHERE FP.index = ?;
                `;
  const checkFPlaceRow = await connection.query(checkPlaceIdxQuery, data);
  return checkFPlaceRow[0];
};

// addedPlace의 place 존재 여부 체크
async function checkPlaceIs(connection, userIdx, data) {

  const checkPlaceQuery = `
                SELECT AP.index, userIdx, place
                FROM AddedPlace AS AP
                WHERE userIdx = ? AND place = ? AND status = 'active';
                `;
  const checkAPlaceRow = await connection.query(checkPlaceQuery, [userIdx, data]);
  return checkAPlaceRow[0];
};


// fixedWeather의 index 존재 여부 체크
async function checkWeatherIdxIs(connection, data) {

  const checkWeatherIdxQuery = `
                SELECT FW.index, weather
                FROM FixedWeather AS FW
                WHERE FW.index = ?;
                `;
  const checkFWeatherRow = await connection.query(checkWeatherIdxQuery, data);
  return checkFWeatherRow[0];
};

// addedWeather의 weather 존재 여부 체크
async function checkWeatherIs(connection, userIdx, data) {

  const checkWeatherQuery = `
                SELECT AW.index, userIdx, weather
                FROM AddedWeather AS AW
                WHERE userIdx = ? AND weather = ? AND status = 'active';
                `;
  const checkAWeatherRow = await connection.query(checkWeatherQuery, [userIdx, data]);
  return checkAWeatherRow[0];
};


// fixedWho의 index 존재 여부 체크
async function checkWhoIdxIs(connection, data) {

  const checkWhoIdxQuery = `
                SELECT FWH.index, who
                FROM FixedWho AS FWH
                WHERE FWH.index = ?;
                `;
  const checkFWhoRow = await connection.query(checkWhoIdxQuery, data);
  return checkFWhoRow[0];
};

// addedWeather의 who 존재 여부 체크
async function checkWhoIs(connection, userIdx, data) {

  const checkWhoQuery = `
                SELECT AWH.index, userIdx, who
                FROM AddedWho AS AWH
                WHERE userIdx = ? AND who = ? AND status = 'active';
                `;
  const checkAWhoRow = await connection.query(checkWhoQuery, [userIdx, data]);
  return checkAWhoRow[0];
};


/*************************************************************** */
/*************************************************************** */

// API 8 : OOTD 최종 등록하기 - OOTD 테이블
async function registerNewOotd(connection, lastRegisterOotdParams) {
  const registerNewOotdQuery = `
        INSERT INTO OOTD(userIdx, date, lookname, photoIs, lookpoint, comment)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
  const registerNewOotdRow = await connection.query(
    registerNewOotdQuery,
    lastRegisterOotdParams
  );

  return registerNewOotdRow;
};

// API 8 : OOTD 최종 등록하기 - OOTD 테이블 내 ootdIdx 찾아오기
/*
async function checkNewOotd(connection, userIdx, date) {
  const checkNewOotdQuery = `
                SELECT ootdIdx
                FROM OOTD
                WHERE userIdx = ? AND date = ?;
                `;
  const checkNewOotdRow = await connection.query(checkNewOotdQuery, [userIdx, date]);
  return checkNewOotdRow[0];
};
*/

// API 8 : OOTD 최종 등록하기 - Photo 테이블
async function registerOotdPhoto(connection, ootdIdx, image) {
  const registerOotdPhotoQuery = `
        INSERT INTO Photo(ootdIdx, thumbnail, imageUrl)
        VALUES (?, ?, ?);
    `;

  let registerOotdPhotoRows = [];

  for (item of image){
    let registerOotdPhotoEach = await connection.query(
      registerOotdPhotoQuery,
      [ootdIdx, item["thumbnail"], item["imageUrl"]]);
    registerOotdPhotoRows.push(registerOotdPhotoEach);
  }

  return registerOotdPhotoRows;
};


// API 8 : OOTD 최종 등록하기 - AddedClothes 테이블 내 일치하는 index 찾기
async function getAddedClothesIdx(connection, userIdx, aClothes){
  const getAddedClothesIdxQuery = `
        SELECT AC.index
        FROM AddedClothes AS AC
        WHERE userIdx = ? AND bigClass = ? AND smallClass = ? AND status = 'active'
        ;`;
  
  let returnList = [];
  for (item of aClothes){
    let [getAddedClothesIdxEach] = await connection.query(
      getAddedClothesIdxQuery, [userIdx, item["bigClass"], item["smallClass"]]
    );
    returnList.push(getAddedClothesIdxEach[0].index);
  }
  return returnList;
};


// API 8 : OOTD 최종 등록하기 - Clothes 테이블 내 fixedType
async function registerOotdFClothes(connection, ootdIdx, ootdFixedClothes) {
  const registerOotdFClothesQuery = `
        INSERT INTO Clothes(ootdIdx, fixedType, color)
        VALUES (?, ?, ?);
    `;

  let registerOotdClothesRows = [];
  for (item of ootdFixedClothes){
    let registerOotdClothesEach = await connection.query(
      registerOotdFClothesQuery,
      [ootdIdx, item["index"], item["color"]]);
      registerOotdClothesRows.push(registerOotdClothesEach);
  }
  return registerOotdClothesRows;
};


// API 8 : OOTD 최종 등록하기 - Clothes 테이블 내 addedType
async function registerOotdAClothes(connection, ootdIdx, ootdAddedClothes) {
  const registerOotdAClothesQuery = `
        INSERT INTO Clothes(ootdIdx, addedType, color)
        VALUES (?, ?, ?);
    `;

  let registerOotdClothesRows = [];
  for (item of ootdAddedClothes){
    let registerOotdClothesEach = await connection.query(
      registerOotdAClothesQuery,
      [ootdIdx, item["index"], item["color"]]);
      registerOotdClothesRows.push(registerOotdClothesEach);
  }
  return registerOotdClothesRows;
};


// API 8 : OOTD 최종 등록하기 - AddedPlace 테이블 내 일치하는 index 찾기
async function getAddedPlaceIdx(connection, userIdx, aPlace) {
  const getAddedPlaceIdxQuery = `
          SELECT AP.index
          FROM AddedPlace AS AP
          WHERE userIdx = ? AND place = ? AND status = 'active';
          `;
  
  let addedPlaceIdxRows = [];
  for (place of aPlace){
    let [addedPlaceIdxEach] = await connection.query(
      getAddedPlaceIdxQuery, [userIdx, place]);
    addedPlaceIdxRows.push(addedPlaceIdxEach[0].index);
    console.log('[ootdDao] addedPlaceIdxRows : ', addedPlaceIdxRows);
  }
  return addedPlaceIdxRows;

};

// API 8 : OOTD 최종 등록하기 - Place 테이블 내 -1, -1
async function registerOotdPlace (connection, ootdIdx) {
  const registerOotdPlaceQuery = `
        INSERT INTO Place(ootdIdx)
        VALUES (?);
        `;
  const registerOotdPlaceRow = await connection.query(
    registerOotdPlaceQuery, ootdIdx);
  return registerOotdPlaceRow;
};

// API 8 : OOTD 최종 등록하기 - Place 테이블 내 fixedPlace
async function registerOotdFPlace (connection, ootdIdx, fPlace) {
  const registerOotdFPlaceQuery = `
        INSERT INTO Place(ootdIdx, fixedPlace)
        VALUES (?, ?);
    `;

  let registerOotdPlaceRows = [];
  for (item of fPlace){
    let registerOotdPlaceEach = await connection.query(
      registerOotdFPlaceQuery,
      [ootdIdx, item]);
    registerOotdPlaceRows.push(registerOotdPlaceEach);
  }
  return registerOotdPlaceRows;
};

// API 8 : OOTD 최종 등록하기 - Place 테이블 내 addedPlace
async function registerOotdAPlace (connection, ootdIdx, APlaceIdxList) {
  const registerOotdAPlaceQuery = `
        INSERT INTO Place(ootdIdx, addedPlace)
        VALUES (?, ?);
    `;

  let registerOotdPlaceRows = [];
  for (item of APlaceIdxList){
    let registerOotdPlaceEach = await connection.query(
      registerOotdAPlaceQuery,
      [ootdIdx, item]);
    registerOotdPlaceRows.push(registerOotdPlaceEach);
  }
  return registerOotdPlaceRows;
};


// API 8 : OOTD 최종 등록하기 - AddedWeather 테이블 내 일치하는 index 찾기
async function getAddedWeatherIdx(connection, userIdx, aWeather) {
  const getAddedWeatherIdxQuery = `
          SELECT AW.index
          FROM AddedWeather AS AW
          WHERE userIdx = ? AND weather = ? AND status = 'active';
          `;
  
  let addedWeatherIdxRows = [];
  for (weather of aWeather){
    let [addedWeatherIdxEach] = await connection.query(
      getAddedWeatherIdxQuery, [userIdx, weather]);
    addedWeatherIdxRows.push(addedWeatherIdxEach[0].index);
  }
  return addedWeatherIdxRows;
};

// API 8 : OOTD 최종 등록하기 - Weather 테이블 내 -1, -1
async function registerOotdWeather (connection, ootdIdx) {
  const registerOotdWeatherQuery = `
        INSERT INTO Weather(ootdIdx)
        VALUES (?);
        `;
  const registerOotdWeatherRow = await connection.query(
    registerOotdWeatherQuery, ootdIdx);
  return registerOotdWeatherRow;
};

// API 8 : OOTD 최종 등록하기 - Weather 테이블 내 fixedWeather
async function registerOotdFWeather(connection, ootdIdx, fWeather) {
  const registerOotdFWeatherQuery = `
        INSERT INTO Weather(ootdIdx, fixedWeather)
        VALUES (?, ?);
    `;

  let registerOotdWeatherRows = [];
  for (item of fWeather){
    let registerOotdWeatherEach = await connection.query(
      registerOotdFWeatherQuery,
      [ootdIdx, item]);
      registerOotdWeatherRows.push(registerOotdWeatherEach);
  }
  return registerOotdWeatherRows;
};

// API 8 : OOTD 최종 등록하기 - Weather 테이블 내 addedWeather
async function registerOotdAWeather(connection, ootdIdx, AWeatherIdxList) {
  const registerOotdAWeatherQuery = `
        INSERT INTO Weather(ootdIdx, addedWeather)
        VALUES (?, ?);
    `;

  let registerOotdWeatherRows = [];
  for (item of AWeatherIdxList){
    let registerOotdWeatherEach = await connection.query(
      registerOotdAWeatherQuery,
      [ootdIdx, item]);
      registerOotdWeatherRows.push(registerOotdWeatherEach);
  }
  return registerOotdWeatherRows;
};

// API 8 : OOTD 최종 등록하기 = AddedWho 테이블 내 일치하는 index 찾기
async function getAddedWhoIdx(connection, userIdx, aWho) {
  const getAddedWhoIdxQuery = `
          SELECT AWH.index
          FROM AddedWho AS AWH
          WHERE userIdx = ? AND who = ? AND status = 'active';
          `;
  
  let addedWhoIdxRows = [];
  for (who of aWho){
    let [addedWhoIdxEach] = await connection.query(
      getAddedWhoIdxQuery, [userIdx, who]);
    addedWhoIdxRows.push(addedWhoIdxEach[0].index);
  }
  return addedWhoIdxRows;
};


// API 8 : OOTD 최종 등록하기 - Who 테이블 내 -1, -1
async function registerOotdWho (connection, ootdIdx) {
  const registerOotdWhoQuery = `
        INSERT INTO Who(ootdIdx)
        VALUES (?);
        `;
  const registerOotdWhoRow = await connection.query(
    registerOotdWhoQuery, ootdIdx);
  return registerOotdWhoRow;
};


// API 8 : OOTD 최종 등록하기 - Who 테이블 내 fixedWho
async function registerOotdFWho(connection, ootdIdx, fWho) {
  const registerOotdFWhoQuery = `
        INSERT INTO Who(ootdIdx, fixedWho)
        VALUES (?, ?);
    `;

  let registerOotdWhoRows = [];
  for (item of fWho){
    let registerOotdWhoEach = await connection.query(
      registerOotdFWhoQuery,
      [ootdIdx, item]);
      registerOotdWhoRows.push(registerOotdWhoEach);
  }
  return registerOotdWhoRows;
};

// API 8 : OOTD 최종 등록하기 - Who 테이블 내 addedWho
async function registerOotdAWho(connection, ootdIdx, AWhoIdxList) {
  const registerOotdAWhoQuery = `
        INSERT INTO Who(ootdIdx, addedWho)
        VALUES (?, ?);
    `;

  let registerOotdWhoRows = [];
  for (item of AWhoIdxList){
    let registerOotdWhoEach = await connection.query(
      registerOotdAWhoQuery,
      [ootdIdx, item]);
      registerOotdWhoRows.push(registerOotdWhoEach);
  }
  return registerOotdWhoRows;
};

// API 10 : OOTD 수정하기 - 지난 작성 화면 불러오기
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


// API 12 : OOTD 완료 페이지 불러오기
async function selectDateOotd(connection, userIdx, date) {
  const selectDateOotdQuery = `
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
                  ON PL.addedPlace = AP.index ) AS TMPL
              ON O.ootdIdx = TMPL.ootdIdx
            LEFT JOIN ( SELECT WE.ootdIdx, WE.fixedWeather, WE.addedWeather, FW.weather AS fwName, AW.weather AS awName
              FROM Weather as WE
                LEFT JOIN FixedWeather AS FW
                  ON WE.fixedWeather = FW.index
                LEFT JOIN AddedWeather AS AW
                  ON WE.addedWeather = AW.index ) AS TMWE
              ON O.ootdIdx = TMWE.ootdIdx
            LEFT JOIN ( SELECT WH.ootdIdx, WH.fixedWho, WH.addedWho, FWH.who AS fwhName, AWH.who AS awhName
              FROM Who as WH
                LEFT JOIN FixedWho AS FWH
                    ON WH.fixedWho = FWH.index
                LEFT JOIN AddedWho AS AWH
                    ON WH.addedWho = AWH.index ) AS TMWH
              ON O.ootdIdx = TMWH.ootdIdx
            LEFT JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
              FROM Clothes AS CL
                LEFT JOIN FixedClothes AS FC
                  ON CL.fixedType = FC.index
                LEFT JOIN AddedClothes AS AC
                  ON CL.addedType = AC.index ) AS TMCL
              ON O.ootdIdx = TMCL.ootdIdx
            WHERE O.userIdx = ? AND O.date = ? AND status = 'active';
            `;
  const [completeDateOotd] = await connection.query(selectDateOotdQuery, [userIdx, date]);
  return completeDateOotd;

};

module.exports = {
  checkDateOotd,
  checkClothesIdxIs,
  checkClothesIs,
  checkPlaceIdxIs,
  checkPlaceIs,
  checkWeatherIdxIs,
  checkWeatherIs,
  checkWhoIdxIs,
  checkWhoIs,
  registerNewOotd,
  //checkNewOotd,
  registerOotdPhoto,
  getAddedClothesIdx,
  registerOotdFClothes,
  registerOotdAClothes,
  getAddedPlaceIdx,
  registerOotdPlace,
  registerOotdFPlace,
  registerOotdAPlace,
  getAddedWeatherIdx,
  registerOotdWeather,
  registerOotdFWeather,
  registerOotdAWeather,
  getAddedWhoIdx,
  registerOotdWho,
  registerOotdFWho,
  registerOotdAWho,
  selectDateOotd,
  selectModiDateOotd
};
