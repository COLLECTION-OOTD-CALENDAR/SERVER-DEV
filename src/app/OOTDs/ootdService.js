const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");
const ootdDao2 = require("../OOTD/ootdDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

// OOTD 최종 등록하기 (Query String인 mode = 2)
// 기존에 존재한 ootd의 status 를 inactive로 변경 즉, OOTD 삭제
exports.modiOriginStatus = async function (userIdx, ootdIdx){

    //console.log('[ootdService] modiOriginStatus start');
    
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteOotdResult = await ootdDao2.deleteOotdData(connection, userIdx, ootdIdx);
        const deleteClothesResult = await ootdDao2.deleteClothesData(connection, ootdIdx);
        const deletePhotoResult = await ootdDao2.deletePhotoData(connection, ootdIdx);
        const deletePlaceResult = await ootdDao2.deletePlaceData(connection, ootdIdx);
        const deleteWeatherResult = await ootdDao2.deleteWeatherData(connection, ootdIdx);
        const deleteWhoResult = await ootdDao2.deleteWhoData(connection, ootdIdx);

        connection.release();

        //console.log('[ootdService] modiOriginStatus finish');

        return ootdIdx;

    } catch(err){
        logger.error(`App - lastRegisterOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

// OOTD 최종 등록하기 (Query String인 mode = 1)
exports.lastRegisterOotd = async function (userIdx, date, lookname, photoIs, image,
    fClothes, aClothes, fPlace, aPlace, fWeather, aWeather,
    fWho, aWho, lookpoint, comment) {
    
    //console.log('[ootdService] lastRegisterOotd start');
    
    try {
        const connection = await pool.getConnection(async (conn) => conn);

            
        /*********************************************** */
        /****************OOTD 테이블 등록**************** */
        /*********************************************** */

        // OOTD 테이블 등록을 위한 params
        const lastRegisterOotdParams = [userIdx, date, lookname, photoIs, lookpoint, comment];
        
        // OOTD 테이블 등록
        const lastRegisterResult = await ootdDao.registerNewOotd(connection, lastRegisterOotdParams);

        // 새로 테이블에 등록하면서 생긴 ootdIdx
        const ootdIdxParam = lastRegisterResult[0].insertId;

        // OOTD 테이블 등록 후 생성된 ootdIdx 가져오기
        // 위에서 insertId를 가지고 온다면 굳이 필요하진 않음 -> 일단 남겨놓은 코드
        //const lastRegisterOotdIdx = await ootdProvider.newOotdIdx(connection, userIdx, date);
        //console.log('새로 추가된 ootdIdx : ', lastRegisterOotdIdx["ootdIdx"]);
        //const ootdIdxParam = lastRegisterOotdIdx["ootdIdx"];

        /*********************************************** */
        /****************Photo 테이블 등록*************** */
        /*********************************************** */

        // Photo 테이블 등록
        if(photoIs == 0){
            const ootdPhotoResult = await ootdDao.registerOotdPhoto(connection, ootdIdxParam, image);
        }

        /*********************************************** */
        /***************Clothes 테이블 등록************** */
        /*********************************************** */

        // AddedClothes 테이블 등록을 위한 param (index 이용해야하기 때문)
        let ootdAddedClothes = [];

        const AClothesIdxList = await ootdProvider.addedClothesIdx(connection, userIdx, aClothes);
        
        // 미리 선언한 테이블에 찾은 AddedClothes의 index 넣기
        for (i in aClothes){
            let tmpAClothes = {};
            tmpAClothes["index"] = AClothesIdxList[i];
            tmpAClothes["color"] = aClothes[i].color;
            ootdAddedClothes.push(tmpAClothes);
        }

        // Clothes 테이블 - fixedType 등록
        const ootdFClothesResult = await ootdDao.registerOotdFClothes(connection, ootdIdxParam, fClothes);

        // Clothes 테이블 - addedType 등록
        const ootdAClothesResult = await ootdDao.registerOotdAClothes(connection, ootdIdxParam, ootdAddedClothes);


        /*********************************************** */
        /****************Place 테이블 등록*************** */
        /*********************************************** */

        // APlace 테이블 등록을 위한 param (index 이용해야하기 때문)
        const APlaceIdxList = await ootdProvider.addedPlaceIdx(connection, userIdx, aPlace);

        // 두 Place 배열이 모두 비어있을 때
        if(!fPlace[0] && !aPlace[0]){
            const ootdPlaceResult = await ootdDao.registerOotdPlace(connection, ootdIdxParam);
        }else {
            // Place 테이블 등록 - fixedPlace 등록
            const ootdFPlaceResult = await ootdDao.registerOotdFPlace(connection, ootdIdxParam, fPlace);    

            // Place 테이블 등록 - addedPlace 등록
            const ootdAPlaceResult = await ootdDao.registerOotdAPlace(connection, ootdIdxParam, APlaceIdxList);
        }

        /*********************************************** */
        /***************Weather 테이블 등록************** */
        /*********************************************** */

        // AWeather 테이블 등록을 위한 param (index 이용해야하기 때문)
        const AWeatherIdxList = await ootdProvider.addedWeatherIdx(connection, userIdx, aWeather);

        // 두 Weather 배열이 모두 비어있을 때
        if(!fWeather[0] && !aWeather[0]){
            const ootdWeatherResult = await ootdDao.registerOotdWeather(connection, ootdIdxParam);
            console.log('ootdWeatherResult : ', ootdWeatherResult);
        }else {
            // Weather 테이블 등록 - fixedWeather 등록
            const ootdFWeatherResult = await ootdDao.registerOotdFWeather(connection, ootdIdxParam, fWeather);

            // Weather 테이블 등록 - addedWeather 등록
            const ootdAWeatherResult = await ootdDao.registerOotdAWeather(connection, ootdIdxParam, AWeatherIdxList);
        }

        /*********************************************** */
        /*****************Who 테이블 등록**************** */
        /*********************************************** */

        // AWho 테이블 등록을 위한 param (index 이용해야하기 때문)
        const AWhoIdxList = await ootdProvider.addedWhoIdx(connection, userIdx, aWho);

        // 두 Who 배열이 모두 비어있을 때
        if(!fWho[0] && !aWho[0]){
            const ootdWhoResult = await ootdDao.registerOotdWho(connection, ootdIdxParam);
        }else {
            // Who 테이블 등록 - fixedWho 등록
            const ootdFWhoResult = await ootdDao.registerOotdFWho(connection, ootdIdxParam, fWho);

            // Who 테이블 등록 - addedWho 등록
            const ootdAWhoResult = await ootdDao.registerOotdAWho(connection, ootdIdxParam, AWhoIdxList);
        }

        connection.release();

        //console.log('[ootdService] lastRegisterOotd finish');

        return response(baseResponse.SUCCESS_LAST_REGISTER);

    } catch (err) {
        logger.error(`App - lastRegisterOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};