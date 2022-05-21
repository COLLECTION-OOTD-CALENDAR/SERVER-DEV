// 15. [PWWC] 검색 초기화면 보여주기 - Color 탭
async function selectColorHistory(connection, userIdx, PWWC) {
  const selectColorHistoryQuery = `
                SELECT History.index, content, color
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectColorHistoryQuery, [userIdx, PWWC]);
  return historyRows;
};

// 15. [PWWC] 검색 초기화면 보여주기 - Place, Weather, Who 탭
async function selectPWWHistory(connection, userIdx, PWWC) {
  const selectPWWHistoryQuery = `
                SELECT History.index, content
                FROM History
                WHERE userIdx = ? AND PWWC = ? AND status = 'active'
                ORDER BY createAt DESC;
                `;
  const [historyRows] = await connection.query(selectPWWHistoryQuery, [userIdx, PWWC]);
  return historyRows;
};




// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (개별 API)
async function updateHistoryEach(connection, userIdx, PWWC,content) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (개별 중 COLOR API)
async function updateHistoryColor(connection, userIdx, PWWC,content,color) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx= ? AND PWWC = ? AND content = ? AND color = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC,content,color]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (전체 삭제 API)
async function updateHistoryAll(connection, userIdx, PWWC) {
  const updateSearchQuery = `
    UPDATE History
    SET status = "inactive"
    WHERE userIdx = ? AND PWWC = ?;`;
  const updateSearchRow = await connection.query(updateSearchQuery, [userIdx, PWWC]);
  return updateSearchRow;
}

// 16. [PWWC] 검색 History 삭제하기(개별,전체) - (History 검색 내역검사) 
async function selectHistory(connection,userIdx,PWWC,content) {
  const selectHistoryQuery = `
    SELECT content
    FROM History
    WHERE userIdx = ? AND PWWC = ? AND content = ?;`;
  const IDRow = await connection.query(selectHistoryQuery, [userIdx,PWWC,content]);
  return IDRow[0];
}

// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - history 처리 -> 개수 체크
async function selectHistoryCnt(connection, userIdx, PWWC) {

  const selectHistoryQuery = `
    SELECT count(content) as count
    FROM History
    WHERE status = 'active' AND userIdx = ? AND PWWC = ?;
                `;

  const selectHistoryParams = [userIdx, PWWC];

  const [historyRows] = await connection.query(selectHistoryQuery, selectHistoryParams);
  return historyRows[0].count;
}

// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - history 처리 -> 중복 체크 (history의 idx반환)
async function selectOldHistory(connection, userIdx, PWWC, keyword, color) {
  var selectOldHistoryParams = [];
  var selectOldHistoryQuery =``;

  if(PWWC != 3){
    selectOldHistoryQuery = `
        SELECT History.index 
        FROM History
        WHERE userIdx = ? AND PWWC = ? AND content = ? AND color IS NULL AND status = 'active';
                `; 
    selectOldHistoryParams = [userIdx, PWWC, keyword];//
  }
  else{
    selectOldHistoryQuery = `
        SELECT History.index 
        FROM History
        WHERE userIdx = ? AND PWWC = ? AND content = ? AND color = ? AND status = 'active';
                `; 
    selectOldHistoryParams = [userIdx, PWWC, keyword, color];
  }
   
  const [oldHistoryRows] = await connection.query(
        selectOldHistoryQuery, 
        selectOldHistoryParams);

  return oldHistoryRows[0];
};

// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - history 처리 -> 가장 오래된 history idx반환
async function selectOldestHistory(connection, userIdx, PWWC){
    const selectOldestHistoryQuery = `
      SELECT History.index
      FROM History
      WHERE userIdx = ? AND PWWC = ? AND status = 'active'
      ORDER BY History.index
      LIMIT 1
        `;

  const selectHistoryParams = [userIdx, PWWC];

  const [historyRows] = await connection.query(selectOldestHistoryQuery, selectHistoryParams);
  return historyRows[0].index;

}



// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - history 처리 -> 가장 오래된 history 삭제
async function deleteOneHistory(connection, userIdx, PWWC, index){

  const updateOneHistQuery = `
        UPDATE History 
        SET History.status = 'inactive', History.updateAt = CURRENT_TIMESTAMP
        WHERE History.index = ? AND History.userIdx = ? AND History.PWWC = ?;
        `;

  const updateOneHistParams = [index, userIdx, PWWC];

  const updateOneHistRow = await connection.query(updateOneHistQuery, updateOneHistParams);
  return updateOneHistRow[0]; 
}

//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - history 처리 -> history 추가
async function insertHistory(connection, insertNewHistoryParams) {
  //insertNewHistoryParams = [userIdx, PWWC, keyword, color];
  const insertHistoryQuery = `
      INSERT INTO History(userIdx, PWWC, content, color)
      VALUES (?, ?, ?, ?);
  `;
  const insertHistoryQueryRow = await connection.query(
      insertHistoryQuery,
      insertNewHistoryParams
  );

  return insertHistoryQueryRow[0];
};



//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Added Place 키워드 존재 체크
async function selectAddedPlaceCheck(connection, userIdx, keyword1) {
  const selectAddedPlaceQuery = `
        SELECT AddedPlace.index
        FROM AddedPlace
        WHERE userIdx = ? AND place = ?;
                `;
  const selectAddedPlaceParams = [userIdx, keyword1]
  const [selectAddedPlaceRows] = await connection.query(
      selectAddedPlaceQuery, 
      selectAddedPlaceParams);

  return selectAddedPlaceRows[0];
}

//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Fixed Place 키워드 존재 체크
async function selectFixedPlaceCheck(connection, keyword1) {
  const selectFixedPlaceQuery = `
        SELECT FixedPlace.index
        FROM FixedPlace
        WHERE place = ?;
                `;
  const [selectFixedPlaceRows] = await connection.query(
    selectFixedPlaceQuery, 
      keyword1);

  return selectFixedPlaceRows[0];
}



//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Added Weather 키워드 존재 체크
async function selectAddedWeatherCheck(connection, userIdx, keyword1) {
  const selectAddedWeatherQuery = `
        SELECT AddedWeather.index
        FROM AddedWeather
        WHERE userIdx = ? AND weather = ?;
                `;
  const selectAddedWeatherParams = [userIdx, keyword1]
  const [selectAddedWeatherRows] = await connection.query(
      selectAddedWeatherQuery, 
      selectAddedWeatherParams);

  return selectAddedWeatherRows[0];
}

//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Fixed Weather 키워드 존재 체크
async function selectFixedWeatherCheck(connection, keyword1) {
  const selectFixedWeatherQuery = `
        SELECT FixedWeather.index
        FROM FixedWeather
        WHERE weather = ?;
                `;
  const [selectFixedWeatherRows] = await connection.query(
    selectFixedWeatherQuery, 
      keyword1);

  return selectFixedWeatherRows[0];
}



//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Added Who 키워드 존재 체크
async function selectAddedWhoCheck(connection, userIdx, keyword1) {
  const selectAddedWhoQuery = `
        SELECT AddedWho.index
        FROM AddedWho
        WHERE userIdx = ? AND who = ?;
                `;
  const selectAddedWhoParams = [userIdx, keyword1]
  const [selectAddedWhoRows] = await connection.query(
      selectAddedWhoQuery, 
      selectAddedWhoParams);

  return selectAddedWhoRows[0];
}

//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Fixed Who 키워드 존재 체크
async function selectFixedWhoCheck(connection, keyword1) {
  const selectFixedWhoQuery = `
        SELECT FixedWho.index
        FROM FixedWho
        WHERE who = ?;
                `;
  const [selectFixedWhoRows] = await connection.query(
    selectFixedWhoQuery, 
      keyword1);

  return selectFixedWhoRows[0];
}


//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Added Clothes 키워드 존재 체크
async function selectAddedClothesCheck(connection, userIdx, keyword1) {
  const selectAddedClothesQuery = `
        SELECT AddedClothes.index
        FROM AddedClothes
        WHERE userIdx = ? AND smallClass = ?;
                `;
  const selectAddedClothesParams = [userIdx, keyword1]
  const [selectAddedClothesRows] = await connection.query(
      selectAddedClothesQuery, 
      selectAddedClothesParams);

  return selectAddedClothesRows[0];
}

//17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Fixed Clothes 키워드 존재 체크
async function selectFixedClothesCheck(connection, keyword1) {
  const selectFixedClothesQuery = `
        SELECT FixedClothes.index
        FROM FixedClothes
        WHERE smallClass = ?;
                `;
  const [selectFixedClothesRows] = await connection.query(
    selectFixedClothesQuery, 
      keyword1);

  return selectFixedClothesRows[0];
}



// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Place
async function selectSearchPlaceList(connection, userIdx, keyword1){
  const selectSearchPlaceQuery = `
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
    WHERE O.ootdIdx IN (
        SELECT O.ootdIdx
        FROM OOTD O
            INNER JOIN ( SELECT PL.ootdIdx, PL.fixedPlace, PL.addedPlace, FP.place AS fpName, AP.place AS awName
          FROM Place as PL
            LEFT JOIN FixedPlace AS FP
              ON PL.fixedPlace = FP.index
            LEFT JOIN AddedPlace AS AP
              ON PL.addedPlace = AP.index
            WHERE FP.place = ? OR AP.place = ?) AS TMPL
          ON O.ootdIdx = TMPL.ootdIdx
        WHERE O.userIdx = ? AND status = 'active')
    ORDER BY O.date;
        `;
  const selectSearchPlaceParams = [keyword1, keyword1, userIdx];
  const [searchPlaceRows] = await connection.query(selectSearchPlaceQuery, selectSearchPlaceParams);
  return searchPlaceRows;
};



// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Weather
async function selectSearchWeatherList(connection, userIdx, keyword1){
  const selectSearchWeatherQuery = `
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
      WHERE O.ootdIdx IN (
          SELECT O.ootdIdx
          FROM OOTD O
              INNER JOIN ( SELECT WE.ootdIdx, WE.fixedWeather, WE.addedWeather, FW.weather AS fwName, AW.weather AS awName
            FROM Weather as WE
              LEFT JOIN FixedWeather AS FW
                ON WE.fixedWeather = FW.index
              LEFT JOIN AddedWeather AS AW
                ON WE.addedWeather = AW.index
              WHERE FW.weather = ? OR AW.weather = ?) AS TMWE
            ON O.ootdIdx = TMWE.ootdIdx
          WHERE O.userIdx = ? AND status = 'active')
      ORDER BY O.date;
        `;
  const selectSearchWeatherParams = [keyword1, keyword1, userIdx];
  const [searchWeatherRows] = await connection.query(selectSearchWeatherQuery, selectSearchWeatherParams);
  return searchWeatherRows;
};



// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Who
async function selectSearchWhoList(connection, userIdx, keyword1){
  const selectSearchWhoQuery = `
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
      WHERE O.ootdIdx IN (
          SELECT O.ootdIdx
          FROM OOTD O
              INNER JOIN ( SELECT WH.ootdIdx, WH.fixedWho, WH.addedWho, FWH.who AS fwhName, AWH.who AS awhName
            FROM Who as WH
              LEFT JOIN FixedWho AS FWH
                ON WH.fixedWho = FWH.index
              LEFT JOIN AddedWho AS AWH
                ON WH.addedWho = AWH.index
              WHERE FWH.who = ? OR AWH.who = ?) AS TMWH
            ON O.ootdIdx = TMWH.ootdIdx
          WHERE O.userIdx = ? AND status = 'active')
      ORDER BY O.date;
        `;
  const selectSearchWhoParams = [keyword1, keyword1, userIdx];
  const [searchWhoRows] = await connection.query(selectSearchWhoQuery, selectSearchWhoParams);
  return searchWhoRows;
};


// 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 - Color
async function selectSearchColorList(connection, userIdx, keyword1, color1){
  const selectSearchColorQuery = `
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
      WHERE O.ootdIdx IN (
          SELECT O.ootdIdx
          FROM OOTD O
              INNER JOIN ( SELECT CL.ootdIdx, CL.fixedType, CL.addedType, CL.color, FC.bigClass AS fixedBig, FC.smallClass AS fixedSmall, AC.bigClass AS addedBig, AC.smallClass AS addedSmall
                FROM Clothes AS CL
                  LEFT JOIN FixedClothes AS FC
                    ON CL.fixedType = FC.index
                  LEFT JOIN AddedClothes AS AC
                    ON CL.addedType = AC.index
                  WHERE (FC.smallClass = ? OR AC.smallClass = ?) AND CL.color = ?) AS TMCL
                ON O.ootdIdx = TMCL.ootdIdx
          WHERE O.userIdx = ? AND status = 'active')
      ORDER BY O.date;
        `;
  const selectSearchColorParams = [keyword1, keyword1, color1, userIdx];
  const [searchColorRows] = await connection.query(selectSearchColorQuery, selectSearchColorParams);
  return searchColorRows;
};

// 19. [PWWC] 매칭 페이지 검색 키워드 제안 - Place
async function selectPlaceSuggestion(connection, suggestionKeywordParams) {
  const placeSuggestionQuery = `
                SELECT place
                FROM (SELECT place, createAt
                  FROM FixedPlace fixed
                  UNION
                  SELECT place, createAt
                  FROM AddedPlace added
                  WHERE added.userIdx = ?) AS UP
                WHERE INSTR(place, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(placeSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// 19. [PWWC] 매칭 페이지 검색 키워드 제안 - Weather
async function selectWeatherSuggestion(connection, suggestionKeywordParams) {
  const weatherSuggestionQuery = `
                SELECT weather
                FROM (SELECT weather, createAt
                  FROM FixedWeather fixed
                  UNION
                  SELECT weather, createAt
                  FROM AddedWeather added
                  WHERE added.userIdx = ?) AS UW
                WHERE INSTR(weather, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(weatherSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// 19. [PWWC] 매칭 페이지 검색 키워드 제안 - Who
async function selectWhoSuggestion(connection, suggestionKeywordParams) {
  const whoSuggestionQuery = `
                SELECT who
                FROM (SELECT who, createAt
                  FROM FixedWho fixed
                  UNION
                  SELECT who, createAt
                  FROM AddedWho added
                  WHERE added.userIdx = ?) AS UWH
                WHERE INSTR(who, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(whoSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};

// 19. [PWWC] 매칭 페이지 검색 키워드 제안 - Color
async function selectColorSuggestion(connection, suggestionKeywordParams) {
  const colorSuggestionQuery = `
                SELECT smallClass
                FROM (SELECT smallClass, createAt
                  FROM FixedClothes fixed
                  UNION
                  SELECT smallClass, createAt
                  FROM AddedClothes added
                  WHERE added.userIdx = ?) AS UC
                WHERE INSTR(smallClass, ?) > 0
                ORDER BY createAt;
                `;
  const [suggestRows] = await connection.query(colorSuggestionQuery, suggestionKeywordParams);
  return suggestRows;
};









module.exports = {

  //15. [PWWC] 검색 초기화면 보여주기 
  selectColorHistory,
  selectPWWHistory,

  //16. [PWWC] 검색 History 삭제하기(개별,전체)
  updateHistoryEach,
  updateHistoryColor,
  updateHistoryAll,
  selectHistory,

  //17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 API
  selectHistoryCnt,
  selectOldHistory,

  selectOldestHistory,

  deleteOneHistory,
  insertHistory,  
  
  selectAddedPlaceCheck,
  selectFixedPlaceCheck,
  
  selectAddedWeatherCheck,
  selectFixedWeatherCheck,

  selectAddedWhoCheck,
  selectFixedWhoCheck,

  selectAddedClothesCheck,
  selectFixedClothesCheck,


  selectSearchPlaceList,
  selectSearchWeatherList,
  selectSearchWhoList,
  selectSearchColorList,


  //19. [PWWC] 매칭 페이지 검색 키워드 제안
  selectPlaceSuggestion,
  selectWeatherSuggestion,
  selectWhoSuggestion,
  selectColorSuggestion
};
