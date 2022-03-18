const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveSearchHistory = async function (userIdx, PWWC) {

  console.log('[searchProvider] retrieveSearchHistory start');

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    
    // color도 함께 출력 (Color)
    if (PWWC == 3){
      // Dao 쿼리문의 결과를 호출
      const colorHistoryResult = await searchDao.selectColorHistory(connection, userIdx, PWWC);
      // connection 해제
      connection.release();

      console.log('[searchProvider] retrieveSearchHistory finish');

      return colorHistoryResult;

    } else { // color는 출력하지 않음 (Place, Weather, Who)
      // Dao 쿼리문의 결과를 호출
      const PWWHistoryResult = await searchDao.selectPWWHistory(connection, userIdx, PWWC);
      // connection 해제
      connection.release();

      console.log('[searchProvider] retrieveSearchHistory finish');
      
      return PWWHistoryResult;
    }

  } catch (err){
    logger.error(`App - retrieveSearchHistory Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

exports.retrieveSuggestKeyword = async function (userIdx, PWWC, keyword1) {
  
  console.log('[searchProvider] retrieveSuggestKeyword start');

  const suggestionKeywordParams = [userIdx, keyword1];
  
  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    
    // Place 값들 출력
    if (PWWC == 0){
      // Dao 쿼리문의 결과를 호출
      const placeSuggestResult = await searchDao.selectPlaceSuggestion(connection, suggestionKeywordParams);
      // connection 해제
      connection.release();

      console.log('[searchProvider] retrieveSuggestKeyword finish');
      return placeSuggestResult;

    } else if (PWWC == 1) { // Weather 값들 출력

      const weatherSuggestResult = await searchDao.selectWeatherSuggestion(connection, suggestionKeywordParams);
      connection.release();

      console.log('[searchProvider] retrieveSuggestKeyword finish');
      return weatherSuggestResult;

    } else if (PWWC == 2){ // Who 값들 출력

      const whoSuggestResult = await searchDao.selectWhoSuggestion(connection, suggestionKeywordParams);
      connection.release();

      console.log('[searchProvider] retrieveSuggestKeyword finish');
      return whoSuggestResult;


    } else if (PWWC == 3){ // color도 함께 출력 (Color)

      const colorSuggestResult = await searchDao.selectColorSuggestion(connection, suggestionKeywordParams);
      connection.release();

      console.log('[searchProvider] retrieveSuggestKeyword finish');
      return colorSuggestResult;
    } 

  } catch (err) {
    logger.error(`App - retrieveSuggestKeyword Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};
