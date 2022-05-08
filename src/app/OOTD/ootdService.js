const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const ootdProvider = require("./ootdProvider");
const ootdDao = require("./ootdDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");




/**
 * API No. 9
 * API Name : 사용자 추가 블럭 등록 API
 */

exports.postNewBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        //1. 블럭 Content 중복 확인  
        const ContentRows = await ootdProvider.checkTagRedundancy(userIdx, Clothes, PWW, Content);
        if(ContentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT);

       
        const FixedContentRows = await ootdProvider.checkFixedRedundancy(Clothes, PWW, Content);
        if(FixedContentRows.length > 0)
            return errResponse(baseResponse.TAG_REDUNDANT_FIXED);


        //  2. 추가하는 블럭 20개 넘는지 체크, 20개 미만이면 추가
        const numberRows = await ootdProvider.checkTagNumber(userIdx, Clothes, PWW);
        if (numberRows.length >= 20)
            return errResponse(baseResponse.TAG_OVERFLOW);


        // 3. POST 쿼리문에 사용할 변수 값을 배열 형태로 전달
        

        
        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            const insertNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.insertAddedClothes(connection, insertNewBlockParams);
            connection.release();
            
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Clothes' : Content});
        }        
        else if(PWW == 0){
            insertNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.insertAddedPlace(connection, insertNewBlockParams);
            connection.release();
            
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Place' : Content});
        }
        else if(PWW == 1){
            insertNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.insertAddedWeather(connection, insertNewBlockParams);
            connection.release();
      
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Weather' : Content});
        }
        else if(PWW == 2){
            insertNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.insertAddedWho(connection, insertNewBlockParams);
            connection.release();
      
            
            return response(baseResponse.SUCCESS_NEW_BLOCK, {'added Who' : Content});
        }


    } catch (err) {
        logger.error(`App - postNewBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};




/**
 * API No. 9-1
 * API Name : 사용자 추가 블럭 삭제 API 
 */
exports.deleteBlock = async function (userIdx, Clothes, PWW, Content) {
    try {    
        // 1. 블럭 Content 존재 확인  
        // 해당하는 블럭의 status를 블러와서 길이가 0이면 아예 존재하지 않는 경우, 내용이 inactive이면 이미 삭제된 경우
        // TAG_ALREADY_DELETED
        // TAG_NEVER_EXISTED

        const ContentRows = await ootdProvider.checkTagExistence(userIdx, Clothes, PWW, Content);

        if(ContentRows.length == 0)
            return errResponse(baseResponse.TAG_NEVER_EXISTED);
        
        else if(ContentRows[0].status == "inactive")
            return errResponse(baseResponse.TAG_ALREADY_DELETED);



        const connection = await pool.getConnection(async (conn) => conn);

        if(PWW == -1){
            var flag;//undefined
            if(Clothes == 0) 
                flag = "Top";
            
            else if(Clothes == 1) 
                flag = "Bottom";

            else if(Clothes == 2) 
                flag = "Shoes";
            else if(Clothes == 3) 
                flag = "Etc"; 

            const deleteNewBlockParams = [userIdx, flag, Content];
            const clothesResult = await ootdDao.deleteAddedClothes(connection, deleteNewBlockParams);
            connection.release();
           
            
        }        
        else if(PWW == 0){
            const deleteNewBlockParams = [userIdx, Content];
            const placeResult = await ootdDao.deleteAddedPlace(connection, deleteNewBlockParams);
            connection.release();
             
        }
        else if(PWW == 1){
            const deleteNewBlockParams = [userIdx, Content];
            const weatherResult = await ootdDao.deleteAddedWeather(connection, deleteNewBlockParams);
            connection.release();
                   
      
        }
        else if(PWW == 2){
            const deleteNewBlockParams = [userIdx, Content];
            const whoResult = await ootdDao.deleteAddedWho(connection, deleteNewBlockParams);
            connection.release();
            
              
        }
        
        return response(baseResponse.SUCCESS_DELETE_BLOCK, {'deleted block' : Content});

    }catch (err) {
        logger.error(`App - deleteBlock Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

/**
 * API No. 11
 * API Name : OOTD 삭제하기 API
 */
exports.deleteOotd = async function (userIdx, date) {
    try {    
        
        const connection = await pool.getConnection(async (conn) => conn);

        //1. 해당 userIdx에 해당 date에 OOTD가 존재하는지 검증
        let ootdIdx = await ootdProvider.checkOotdExistence(userIdx, date);
        
       
        if(typeof(ootdIdx)=='undefined')
            return errResponse(baseResponse.DATE_OOTD_EMPTY);

        ootdIdx = ootdIdx.ootdIdx; 
        
        //ootd 삭제 - transaction 처리
        try{
            await connection.beginTransaction();
            
            //2. ootdIdx == OOTD.ootdIdx인 OOTD.status = "inactive"로 patch
            const deleteOotdResult = await ootdDao.deleteOotdData(connection, userIdx, ootdIdx);

            const deleteClothesResult = await ootdDao.deleteClothesData(connection, ootdIdx);

            const deletePhotoResult = await ootdDao.deletePhotoData(connection, ootdIdx);
            

            const deletePlaceResult = await ootdDao.deletePlaceData(connection, ootdIdx);

            const deleteWeatherResult = await ootdDao.deleteWeatherData(connection, ootdIdx);

            const deleteWhoResult = await ootdDao.deleteWhoData(connection, ootdIdx);


            await connection.commit();
            
            return response(baseResponse.SUCCESS_OOTD_DELETION); //, {'deleted ootd' : Content});
        }      
        catch(err){
            await connection.rollback();
            logger.error(`App - deleteOotd transcation error\n: ${err.message}`);
            return errResponse(baseResponse.OOTD_DELETION_RESPONSE_ERROR);
        }
        finally{            
            connection.release();            
        }      

    }
    catch (err) {
        logger.error(`App - deleteOotd Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};