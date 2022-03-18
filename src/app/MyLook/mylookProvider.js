const { pool } = require("../../../config/database");
const { response } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const mylookDao = require("./mylookDao");
const {errResponse} = require("../../../config/response");

// Provider: Read 비즈니스 로직 처리

//if가 만드는 로직 ~ 

//myLook 메인페이지 API
exports.getMyLookMain = async function (lookpoint, userIdx){
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
    logger.error(`App - getMyLookMain Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
 }
}


//myLook 상세페이지 API
exports.getMyLookDetail = async function (lookpoint, userIdx){
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
    logger.error(`App - getMyLookDetail Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
 }
}



