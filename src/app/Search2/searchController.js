const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("./searchProvider");
const searchService = require("./searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : [PWWC] 검색 History 삭제하기(개별,전체) API
 * [PATCH] /app/search/deletion/:PWWC?type=
 */
exports.delHistory = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;
    const content = req.body.content;
    const type = req.query.type;
    const color = req.body.color;

    //삭제할 블럭이 지정되지 않았습니다.
    if(type == 1 && content === null){
        return res.send(errResponse(baseResponse.HISTORY_CONTENT_UNDEFINED));
    }
    //전체삭제에 알맞지 않은 조건입니다. 
    if(type == 2 && content){
        return res.send(errResponse(baseResponse.UNNECESSARY_CONTENT));
    }

    // PWWC flag 값이 입력되어야합니다.
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    // 올바르지 않은 PWWC flag형식이 입력되었습니다. 
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }

    // 유효하지 않은 PWWC flag(0,1,2,3) 값이 입력되었습니다.
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    //Query String을 입력해야 합니다. (type이 아예 없는경우 || type이 비어있는경우)
    if(!type){
        return res.send(errResponse(baseResponse.QUERY_STRING_EMPTY));
    }

    //올바르지 않은 Query String 형식입니다. (숫자가 아닌경우)
    if(isNaN(type)){
        return res.send(errResponse(baseResponse.QUERY_STRING_ERROR_TYPE));
    }

    //유효하지 않은 Query String 값이 입력되었습니다. (1,2 가 아닌경우)
    if(type < 0 || type > 3){
        return res.send(errResponse(baseResponse.QUERY_STRING_INVALID_VALUE));
    }
    //존재하지 않는 검색 내역입니다.
    const historyRows = await searchProvider.historyCheck(
        userIdx,
        PWWC,
        content,
    );
    if (historyRows.length < 0){
        return res.send(errResponse(baseResponse.SEARCH_NOT_EXIST));
    }

    const editHistory = await searchService.editHistory(
        userIdx,
        PWWC,
        content,
        type,
        color,
    );

    return res.send(editHistory);


};










