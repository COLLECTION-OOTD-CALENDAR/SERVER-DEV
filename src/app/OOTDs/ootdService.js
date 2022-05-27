const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");
const ootdDao2 = require("../OOTD/ootdDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// 8. OOTD 최종 등록하기 - (Query String인 mode = 2, 수정하기)
// 수정 전, 기존에 존재한 ootd의 status 를 inactive로 변경 즉, OOTD 삭제
exports.patchOriginStatus = async function (userIdx, ootdIdx){

    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteOotdResult = await ootdDao2.deleteOotdData(connection, userIdx, ootdIdx);
        const deleteClothesResult = await ootdDao2.deleteClothesData(connection, ootdIdx);
        const deletePhotoResult = await ootdDao2.deletePhotoData(connection, ootdIdx);
        const deletePlaceResult = await ootdDao2.deletePlaceData(connection, ootdIdx);
        const deleteWeatherResult = await ootdDao2.deleteWeatherData(connection, ootdIdx);
        const deleteWhoResult = await ootdDao2.deleteWhoData(connection, ootdIdx);

        connection.release();

        return ootdIdx;

    } catch(err){
        logger.error(`App - patchOriginStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

// 8. OOTD 최종 등록하기 - (Query String인 mode = 1, 등록하기)
exports.postOotd = async function (userIdx, date, lookname, photoIs, image,
    fClothes, aClothes, fPlace, aPlace, fWeather, aWeather,
    fWho, aWho, lookpoint, comment) {
    
    try {
        const connection = await pool.getConnection(async (conn) => conn);
            
        /*********************************************** */
        /****************OOTD 테이블 등록**************** */
        /*********************************************** */

        // OOTD 테이블 등록을 위한 params
        const lastRegisterOotdParams = [userIdx, date, lookname, photoIs, lookpoint, comment];
        
        // OOTD 테이블 등록
        const lastRegisterResult = await ootdDao.insertNewOotd(connection, lastRegisterOotdParams);
        // 새로 테이블에 등록하면서 생긴 ootdIdx
        const ootdIdxParam = lastRegisterResult[0].insertId;

        /*********************************************** */
        /****************Photo 테이블 등록*************** */
        /*********************************************** */

        // Photo 테이블 등록
        if(photoIs == 0){
            const ootdPhotoResult = await ootdDao.insertOotdPhoto(connection, ootdIdxParam, image);
        }

        /*********************************************** */
        /***************Clothes 테이블 등록************** */
        /*********************************************** */

        // AddedClothes 테이블 등록을 위한 param (index 이용해야하기 때문)
        let ootdAddedClothes = [];

        const AClothesIdxList = await ootdProvider.checkAddedClothesIdx(connection, userIdx, aClothes);
        // 미리 선언한 테이블에 찾은 AddedClothes의 index 넣기
        for (i in aClothes){
            let tmpAClothes = {};
            tmpAClothes["index"] = AClothesIdxList[i];
            tmpAClothes["color"] = aClothes[i].color;
            ootdAddedClothes.push(tmpAClothes);
        }
        
        // Clothes 테이블 - fixedType 등록
        const ootdFClothesResult = await ootdDao.insertOotdFClothes(connection, ootdIdxParam, fClothes);

        // Clothes 테이블 - addedType 등록
        const ootdAClothesResult = await ootdDao.insertOotdAClothes(connection, ootdIdxParam, ootdAddedClothes);

        // AddedClothes 테이블 - unselected -> selected로 변경
        const aClothesCondResult = await ootdDao.patchAClothesCond(connection, AClothesIdxList);


        /*********************************************** */
        /****************Place 테이블 등록*************** */
        /*********************************************** */

        // APlace 테이블 등록을 위한 param (index 이용해야하기 때문)
        const APlaceIdxList = await ootdProvider.checkAddedPlaceIdx(connection, userIdx, aPlace);

        // 두 Place 배열이 모두 비어있을 때
        if(!fPlace[0] && !aPlace[0]){
            const ootdPlaceResult = await ootdDao.insertOotdPlace(connection, ootdIdxParam);
        }else {
            // Place 테이블 등록 - fixedPlace 등록
            const ootdFPlaceResult = await ootdDao.insertOotdFPlace(connection, ootdIdxParam, fPlace);    

            // Place 테이블 등록 - addedPlace 등록
            const ootdAPlaceResult = await ootdDao.insertOotdAPlace(connection, ootdIdxParam, APlaceIdxList);
        
            // AddedPlace 테이블 - unselected -> selected로 변경
            const aPlaceCondResult = await ootdDao.patchAPlaceCond(connection, APlaceIdxList);
        }

        /*********************************************** */
        /***************Weather 테이블 등록************** */
        /*********************************************** */

        // AWeather 테이블 등록을 위한 param (index 이용해야하기 때문)
        const AWeatherIdxList = await ootdProvider.checkAddedWeatherIdx(connection, userIdx, aWeather);

        // 두 Weather 배열이 모두 비어있을 때
        if(!fWeather[0] && !aWeather[0]){
            const ootdWeatherResult = await ootdDao.insertOotdWeather(connection, ootdIdxParam);
        }else {
            // Weather 테이블 등록 - fixedWeather 등록
            const ootdFWeatherResult = await ootdDao.insertOotdFWeather(connection, ootdIdxParam, fWeather);

            // Weather 테이블 등록 - addedWeather 등록
            const ootdAWeatherResult = await ootdDao.insertOotdAWeather(connection, ootdIdxParam, AWeatherIdxList);
        
            // AddedWeather 테이블 - unselected -> selected로 변경
            const aWeatherCondResult = await ootdDao.patchAWeatherCond(connection, AWeatherIdxList);

        }

        /*********************************************** */
        /*****************Who 테이블 등록**************** */
        /*********************************************** */

        // AWho 테이블 등록을 위한 param (index 이용해야하기 때문)
        const AWhoIdxList = await ootdProvider.checkAddedWhoIdx(connection, userIdx, aWho);

        // 두 Who 배열이 모두 비어있을 때
        if(!fWho[0] && !aWho[0]){
            const ootdWhoResult = await ootdDao.insertOotdWho(connection, ootdIdxParam);
        }else {
            // Who 테이블 등록 - fixedWho 등록
            const ootdFWhoResult = await ootdDao.insertOotdFWho(connection, ootdIdxParam, fWho);

            // Who 테이블 등록 - addedWho 등록
            const ootdAWhoResult = await ootdDao.insertOotdAWho(connection, ootdIdxParam, AWhoIdxList);
        
            // AddedWho 테이블 - unselected -> selected로 변경
            const aWhoCondResult = await ootdDao.patchAWhoCond(connection, AWhoIdxList);

        
        }

        connection.release();

        return response(baseResponse.SUCCESS_LAST_REGISTER);

    } catch (err) {
        logger.error(`App - postOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};