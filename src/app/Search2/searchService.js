const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const searchProvider = require("./searchProvider");
const searchDao = require("./searchDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리 
// [PWWC] 검색 History 삭제하기(개별,전체) API
exports.editHistory = async function(userIdx, PWWC, content, type,color) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        if(type == 1){//개별삭제
            if(PWWC == 3){
                const editHistoryColor = await searchDao.updateHistoryColor(connection, userIdx, PWWC,content,color);
            }
            else{
                const editHistoryEach = await searchDao.updateHistoryEach(connection, userIdx, PWWC,content);
            }
        } 

        if(type == 2){//전체삭제
            const editHistoryAll = await searchDao.updateHistoryAll(connection, userIdx, PWWC);
        }

        connection.release();
        return response(baseResponse.SUCCESS_SEARCH_DELETION,{'PWWC': PWWC, 'content': content, 'color' : color});

    } catch (err) {
        logger.error(`App - editHistory Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};



