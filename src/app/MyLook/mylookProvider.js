const { pool } = require("../../../config/database");
const { response } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const mylookDao = require("./mylookDao");
const {errResponse} = require("../../../config/response");



//13. MY LOOK 메인페이지 불러오기 - (lookpoint별로 각 10장씩 불러오기)
exports.retrieveMylookMain = async function (lookpoint, userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const getOOTDResultParams = [lookpoint, userIdx];

    const getOOTDResult = await mylookDao.getOOTD(connection, getOOTDResultParams);

    const lastOOTDArr = new Array();
    for (var i=0 ; i<getOOTDResult.length; i++){
      if(i>9){
        break;
      } 
      if (getOOTDResult[i].thumbnail == 0 || getOOTDResult[i].thumbnail == null){
        var moment = require('moment');
        getOOTDResult[i].date = moment(getOOTDResult[i].date).format('YYYY-MM-DD');
        lastOOTDArr.push(getOOTDResult[i]);
      }
  };

    connection.release();

    return response(baseResponse.SUCCESS_MYLOOK_MAIN, {'lookpoint': lookpoint, lastOOTDArr});
    
  } catch (err) {
    logger.error(`App - retrieveMylookMain Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
 }
}


//14. MY LOOK 상세페이지 - (lookpoint 내에 날짜별로 ootd 불러오기)
exports.retrieveMylookDetail = async function (lookpoint, userIdx){
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const getOOTDResultParams = [lookpoint, userIdx];

    const getOOTDDetailResult = await mylookDao.getOOTD(connection, getOOTDResultParams);

    const lastOOTDDetailArr = new Array();
    for (var i=0 ; i<getOOTDDetailResult.length; i++){
      if (getOOTDDetailResult[i].thumbnail == 0 || getOOTDDetailResult[i].thumbnail == null){
        var moment = require('moment');
        getOOTDDetailResult[i].date = moment(getOOTDDetailResult[i].date).format('YYYY-MM-DD');
        lastOOTDDetailArr.push(getOOTDDetailResult[i]);
      }
  };

    connection.release();

    return response(baseResponse.SUCCESS_MYLOOK_DETAIL, {'lookpoint': lookpoint, lastOOTDDetailArr});
    
  } catch (err) {
    logger.error(`App - retrieveMylookDetail Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
 }
}



