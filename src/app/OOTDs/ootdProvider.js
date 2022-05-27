const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const ootdDao = require("./ootdDao");

// 8. OOTD 최종 등록하기 - 입력한 날짜에 OOTD 존재 여부 체크
exports.checkOotdDate = async function (userIdx, date) {

  try {

    // DB에 연결
    const connection = await pool.getConnection(async (conn) => conn);
    const ootdDateCheckResult = await ootdDao.selectDateOotd(connection, userIdx, date);
    connection.release();

    return ootdDateCheckResult;

  }catch(err) {
    logger.error(`App - checkOotdDate Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// 8. OOTD 최종 등록하기 - 등록할 수 없는 옷 (fClothes->index, aClothes->smallClass) 체크
exports.checkClothes = async function (userIdx, data) {

  try {

    // DB에 연결
    const connection = await pool.getConnection(async (conn) => conn);
    
    // data가 정수일 경우 (fClothes->index)
    if(Number.isInteger(data) && typeof data == 'number'){ 
      const clothesCheckResult = await ootdDao.selectClothesIdxIs(connection, data);
      connection.release();

      return clothesCheckResult;
    }
    else { // data가 string일 경우 (aClothes->smallClass)
      const clothesCheckResult = await ootdDao.selectClothesIs(connection, userIdx, data);
      connection.release();

      return clothesCheckResult;
    }
  }catch(err) {
    logger.error(`App - checkClothes Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 8. OOTD 최종 등록하기 - 등록할 수 없는 Place (fPlace->index, aPlace->place) 체크
exports.checkPlace = async function (userIdx, data) {

  try {

    // DB에 연결
    const connection = await pool.getConnection(async (conn) => conn);

    // data가 정수일 경우 (fPlace->index)
    if(Number.isInteger(data) && typeof data == 'number'){ 
      const placeCheckResult = await ootdDao.selectPlaceIdxIs(connection, data);
      connection.release();

      return placeCheckResult;
    }
    else { // data가 string일 경우 (aPlace->place)
      const placeCheckResult = await ootdDao.selectPlaceIs(connection, userIdx, data);
      connection.release();

      return placeCheckResult;
    }
  }catch(err) {
    logger.error(`App - checkPlace Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 8. OOTD 최종 등록하기 - 등록할 수 없는 Weather (fWeather->index, aWeather->weather) 체크
exports.checkWeather = async function (userIdx, data) {

  try {

    // DB에 연결
    const connection = await pool.getConnection(async (conn) => conn);
    
    // data가 정수일 경우 (fWeather->index)
    if(Number.isInteger(data) && typeof data == 'number'){ 
      const weatherCheckResult = await ootdDao.selectWeatherIdxIs(connection, data);
      connection.release();

      return weatherCheckResult;
    }
    else { // data가 string일 경우 (aWeather->weather)
      const weatherCheckResult = await ootdDao.selectWeatherIs(connection, userIdx, data);
      connection.release();
      
      return weatherCheckResult;
    }
  }catch(err) {
    logger.error(`App - checkWeather Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 8. OOTD 최종 등록하기 - 등록할 수 없는 Who (fWho->index, aWho->who) 체크
exports.checkWho = async function (userIdx, data) {

  try {

    // DB에 연결
    const connection = await pool.getConnection(async (conn) => conn);
    
    // data가 정수일 경우 (fWho->index)
    if(Number.isInteger(data) && typeof data == 'number'){
      const whoCheckResult = await ootdDao.selectWhoIdxIs(connection, data);
      connection.release();
      
      return whoCheckResult;
    }
    else { // data가 string일 경우 (aWho->who)
      const whoCheckResult = await ootdDao.selectWhoIs(connection, userIdx, data);
      connection.release();
      
      return whoCheckResult;
    
    }
  }catch(err) {
    logger.error(`App - checkWho Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// 8. OOTD 최종 등록하기 - userIdx와 aClothes의 bigClass, smallClass를 이용한 index 추출하기
exports.checkAddedClothesIdx = async function (connection, userIdx, aClothes){

  const addedClothesIdxResult = await ootdDao.selectAddedClothesIdx(connection, userIdx, aClothes);
  return addedClothesIdxResult;
};

// 8. OOTD 최종 등록하기 - userIdx와 aPlace의 place를 이용한 index 추출하기
exports.checkAddedPlaceIdx = async function (connection, userIdx, aPlace){
  
  const addedPlaceIdxResult = await ootdDao.selectAddedPlaceIdx(connection, userIdx, aPlace);
  return addedPlaceIdxResult;
};

// 8. OOTD 최종 등록하기 - userIdx와 aWeather의 weather를 이용한 index 추출하기
exports.checkAddedWeatherIdx = async function (connection, userIdx, aWeather){

  const addedWeatherIdxResult = await ootdDao.selectAddedWeatherIdx(connection, userIdx, aWeather);
  return addedWeatherIdxResult;
};

// 8. OOTD 최종 등록하기 - userIdx와 aWho의 who를 이용한 index 추출하기
exports.checkAddedWhoIdx = async function (connection, userIdx, aWho){

  const addedWhoIdxResult = await ootdDao.selectAddedWhoIdx(connection, userIdx, aWho);
  return addedWhoIdxResult;
};


// 10. OOTD 수정하기 - 지난 작성 화면 보여주기
exports.retrieveAddedOotd = async function (userIdx){

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);

    // Dao 쿼리문의 결과를 호출
    const modiOotdListResult = await ootdDao.selectModiDateOotd(connection, userIdx);
    // connection 해제
    connection.release();

    let added = {};

    // 추가한 항목들이 없을 경우
    if(!modiOotdListResult[0].place && !modiOotdListResult[0].weather && !modiOotdListResult[0].who
      && !modiOotdListResult[0].bigClass){
      
        added["aPlace"] = [];
        added["aWeather"] = [];
        added["aWho"] = [];
        added = getAddedBigClass(added);
            
        return added;
    }

    for (let row of modiOotdListResult){
      // added Place, Weather, Who 리스트 생성 및 data 추가
      added["aPlace"] = getPlaceList(row, added["aPlace"]);
      added["aWeather"] = getWeatherList(row, added["aWeather"]);
      added["aWho"] = getWhoList(row, added["aWho"]);

      // added에 대한 bigClass Key 생성
      added = getAddedBigClass(added);
      
      let bigKey = 'a'+row.bigClass;

      // added Clothes(bigClass) 리스트 내 data 추가
      if(!hasAdded(added[bigKey], row.smallClass)){
        added[bigKey].push(row.smallClass);
      }

    }

    return added;

  } catch(err) {
    logger.error(`App - retrieveAddedOotd Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};

// 10. OOTD 수정하기 - 지난 작성 화면 보여주기 - Added place list를 채우는 함수
function getPlaceList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.place != null && tags.indexOf(row.place) < 0){
    tags.push(row.place);
  }

  return tags;
};

// 10. OOTD 수정하기 - 지난 작성 화면 보여주기 - Added weather list를 채우는 함수
function getWeatherList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.weather != null && tags.indexOf(row.weather) < 0){
    tags.push(row.weather);
  }

  return tags;
};

// 10. OOTD 수정하기 - 지난 작성 화면 보여주기 -Added who list를 채우는 함수
function getWhoList(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.who != null && tags.indexOf(row.who) < 0){
    tags.push(row.who);
  }

  return tags;
};

// 10. OOTD 수정하기 - 지난 작성 화면 보여주기 -Added big Class key 및 배열 생성
function getAddedBigClass(added){
  if(!added["aTop"] && !added["aBottom"] && !added["aShoes"] && !added["aEtc"]){
    added["aTop"] = [];
    added["aBottom"] = [];
    added["aShoes"] = [];
    added["aEtc"] = [];
  }

  return added;

};

// 10. OOTD 수정하기 - 지난 작성 화면 보여주기 -Added list 내 주어진 data가 존재하는 지 체크
function hasAdded(list, data){
  if(data == null) return true;
  for(let each of list){
    if(each == data) return true;
  }

  return false;
};


// 12. OOTD 완료 페이지 불러오기
exports.retrieveCompleteOotd = async function (userIdx, date){

  try {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const completeOotdListResult = await ootdDao.selectCompleteDateOotd(connection, userIdx, date);
    // connection 해제
    connection.release();

    // 입력된 날짜의 ootd가 존재하는지 체크
    if(!completeOotdListResult[0]){
      return completeOotdListResult[0];
    }

    let ootd = {};
    var moment = require('moment');

    // 출력된 row들을 종합하여 출력 JSON 형태 만들기
    for (let row of completeOotdListResult){
      // 처음 row를 정리할 때 고정된 값을 결과 JSON에 대입
      if(row === completeOotdListResult[0]){
        ootd["ootdIdx"] = row.ootdIdx;
        ootd["date"] = moment(row.date).format('YYYY-MM-DD');
        ootd["lookname"] = row.lookname;
        ootd["lookpoint"] = row.lookpoint;
        ootd["comment"] = row.comment;
      }

      // image, place, weather, who value에 새로운 data 대입
      ootd["image"] = getImages(row, ootd["image"]);
      ootd["place"] = getPlaces(row, ootd["place"]);
      ootd["weather"] = getWeathers(row, ootd["weather"]);
      ootd["who"] = getWhos(row, ootd["who"]);

      // bigClass Key 생성
      ootd = getBigClass(ootd);
      
      // fixed smallClass 넣기
      if(row.fixedBig != null){
        let data = {smallClass : row.fixedSmall, color : row.color};

        if(!hasClothes(ootd[row.fixedBig], data)){
          ootd[row.fixedBig].push(data);
        }
      }
      else { // added smallClass 넣기
        let data = {smallClass : row.addedSmall, color : row.color};

        if(!hasClothes(ootd[row.addedBig], data)){
          ootd[row.addedBig].push(data);
        }
      }
      
    }

    return response(baseResponse.SUCCESS_OOTD_COMPLETE, ootd);

  } catch(err) {
    logger.error(`App - retrieveCompleteOotd Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }

};


// 12. OOTD 완료 페이지 불러오기 - Image value를 채우는 함수
function getImages(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  }else {
    tags = tmp;
  }

  for (let each of tags){
    if(each.imageUrl == row.imageUrl && each.thumbnail == row.thumbnail) return tags;
  }

  if(row.imageUrl != null && tags.indexOf(row.imageUrl) < 0){
    let data = { imageUrl : row.imageUrl, thumbnail : row.thumbnail};
    tags.push(data);
  }

  return tags;
};

// 12. OOTD 완료 페이지 불러오기 - Place value를 채우는 함수
function getPlaces(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fpName != null && tags.indexOf(row.fpName) < 0){
    tags.push(row.fpName);
  }

  if(row.apName != null && tags.indexOf(row.apName) < 0){
    tags.push(row.apName);
  }
  return tags;
};

// 12. OOTD 완료 페이지 불러오기 - Weather value를 채우는 함수
function getWeathers(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fwName != null && tags.indexOf(row.fwName) < 0){
    tags.push(row.fwName);
  }

  if(row.awName != null && tags.indexOf(row.awName) < 0){
    tags.push(row.awName);
  }
  return tags;
};

// 12. OOTD 완료 페이지 불러오기 - Who value를 채우는 함수
function getWhos(row, tmp){
  let tags;

  if(tmp === undefined || tmp === null) {
    tags = [];
  } else {
    tags = tmp;
  }

  if(row.fwhName != null && tags.indexOf(row.fwhName) < 0){
    tags.push(row.fwhName);
  }

  if(row.awhName != null && tags.indexOf(row.awhName) < 0){
    tags.push(row.awhName);
  }
  return tags;
};

// 12. OOTD 완료 페이지 불러오기 - BigClass에 해당하는 key를 모두 만드는 함수
function getBigClass(ootd){
  if(!ootd["Top"] && !ootd["Bottom"] && !ootd["Shoes"] && !ootd["Etc"]){
    ootd["Top"] = [];
    ootd["Bottom"] = [];
    ootd["Shoes"] = [];
    ootd["Etc"] = [];
  }

  return ootd;
};

// 12. OOTD 완료 페이지 불러오기 - list(BigClass)에 data가 존재하는지 확인하는 함수
function hasClothes(list, data){
  for(let each of list){
    if(each.smallClass == data.smallClass && each.color == data.color) return true;
  }

  return false;
};