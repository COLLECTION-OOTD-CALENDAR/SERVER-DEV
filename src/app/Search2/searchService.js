const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

const searchDao = require("./searchDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");


// 16. [PWWC] 검색 History 삭제하기(개별,전체)
exports.patchHistory = async function(userIdx, PWWC, content, type, color) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        if(type == 1){//개별삭제
            if(PWWC == 3){//개별삭제 중 color
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



