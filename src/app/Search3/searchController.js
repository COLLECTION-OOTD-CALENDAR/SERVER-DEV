const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("./searchProvider");
//const searchService = require("./searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var blankPattern = /^\s+|\s+$/g;

/**
 * API No. 15
 * API Name : [PWWC] 검색 초기화면 보여주기 API
 * [GET] /app/search/mainpage/:PWWC
 * Path variable : PWWC
 */
exports.searchMain = async function (req, res) {

    console.log('[searchController] searchMain start');
    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;

    // PWWC Path variable이 입력되지 않았을 때
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    // PWWC Path variable이 숫자가 아닌 경우(약한 검사)
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }

    // PWWC Path variable이 0,1,2,3 값이 아닌 경우
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    const searchHistoryResult = await searchProvider.retrieveSearchHistory(userIdx, PWWC);

    // 객체 형태로 변경
    const historyFinalResult = {};
    historyFinalResult["history"] = searchHistoryResult;

    console.log('[searchController] searchMain finish');

    return res.send(response(baseResponse.SUCCESS_SEARCH_MAIN, historyFinalResult));

};


/**
 * API No. 19
 * API Name : [PWWC] 매칭 페이지 검색 키워드 제안 API
 * [GET] /app/search/suggestion/:PWWC
 * Path variable : PWWC
 * Query string : keyword1
 */
exports.suggestSearchKeyword = async function (req, res) {

    console.log('[searchController] suggestSearchKeyword start');

    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;
    var keyword1 = req.query.keyword1;

    // PWWC Path variable이 입력되지 않았을 때
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    // PWWC Path variable이 숫자가 아닌 경우(약한 검사)
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }

    // PWWC Path variable이 0,1,2,3 값이 아닌 경우
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    // Keyword1 Query string이 없는 경우 (key / value)
    if(!keyword1){
        return res.send(errResponse(baseResponse.KEYWORD1_EMPTY));
    }
    
    // Keyword1 Query String에 공백만 입력된 경우
    keyword1 = keyword1.toString();
    if(keyword1.replace(blankPattern, '') == ""){
        return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));
    }

    // Keyword1의 길이가 6글자를 넘을 경우
    if(keyword1.length > 6){
        return res.send(errResponse(baseResponse.SEARCH_KEYWORD_LENGTH));
    }

    const suggestKeywordResult = await searchProvider.retrieveSuggestKeyword(userIdx, PWWC, keyword1);

    // Response error : 존재하는 검색 키워드 존재 X
    if(!suggestKeywordResult[0]){
        return res.send(errResponse(baseResponse.SEARCH_TAG_NOT_EXIST));
    }

    // 객체 형태로 변경
    const suggestFinalResult = {};
    suggestFinalResult["suggestion"] = suggestKeywordResult;

    console.log('[searchController] suggestSearchKeyword finish');

    return res.send(response(baseResponse.SUCCESS_SEARCH_SUGGEST, suggestFinalResult));
};
