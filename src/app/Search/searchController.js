const searchProvider = require("./searchProvider");
const searchService = require("./searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var blankPattern = /^\s+|\s+$/g;

/**
 * API No. 15
 * API Name : [PWWC] 검색 초기화면 보여주기
 * [GET] /app/search/mainpage/:PWWC
 * Path Variable : PWWC
 */
exports.searchMain = async function (req, res) {

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

    return res.send(response(baseResponse.SUCCESS_SEARCH_MAIN, historyFinalResult));

};

/**
 * API No. 16
 * API Name : [PWWC] 검색 History 삭제하기(개별,전체) 
 * [PATCH] /app/search/deletion/:PWWC?type=
 * parameters : PWWC ,userIdx
 * body : content, color
 * query string : type
 */
 exports.searchDeletion = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    const PWWC = req.params.PWWC;
    const content = req.body.content;
    const type = req.query.type;
    const color = req.body.color;

    //삭제할 블럭이 지정되지 않았습니다.
    if(type == 1 && content === null){
        return res.send(response(baseResponse.HISTORY_CONTENT_UNDEFINED));
    }
    //전체삭제에 알맞지 않은 조건입니다. 
    if(type == 2 && content){
        return res.send(response(baseResponse.UNNECESSARY_CONTENT));
    }

    // PWWC flag 값이 입력되어야합니다.
    if(PWWC === '' || PWWC === null || PWWC === undefined || PWWC === NaN){
        return res.send(response(baseResponse.PWWC_EMPTY));
    }

    // 올바르지 않은 PWWC flag형식이 입력되었습니다. 
    if(isNaN(PWWC)){
        return res.send(response(baseResponse.PWWC_ERROR_TYPE));
    }

    // 유효하지 않은 PWWC flag(0,1,2,3) 값이 입력되었습니다.
    if(PWWC < 0 || PWWC > 3){
        return res.send(response(baseResponse.PWWC_INVALID_VALUE));
    }

    //Query String을 입력해야 합니다. (type이 아예 없는경우 || type이 비어있는경우)
    if(!type){
        return res.send(response(baseResponse.QUERY_STRING_EMPTY));
    }

    //올바르지 않은 Query String 형식입니다. (숫자가 아닌경우)
    if(isNaN(type)){
        return res.send(response(baseResponse.QUERY_STRING_ERROR_TYPE));
    }

    //유효하지 않은 Query String 값이 입력되었습니다. (1,2 가 아닌경우)
    if(type < 0 || type > 3){
        return res.send(response(baseResponse.QUERY_STRING_INVALID_VALUE));
    }
    //존재하지 않는 검색 내역입니다.
    const historyRows = await searchProvider.checkHistory(
        userIdx,
        PWWC,
        content,
    );
    if (historyRows.length == 0 && content !== undefined ){ // not null == 비워져있지 않다. == 무언가 존재한다. 
        return res.send(response(baseResponse.SEARCH_NOT_EXIST));
    }

    const editHistory = await searchService.patchHistory(
        userIdx,
        PWWC,
        content,
        type,
        color, 
    );

    return res.send(editHistory);


};



/**
 * API No. 17
 * API Name : 검색 결과 조회 API
 * [GET] /app/search/:PWWC
 * path variable : PWWC
 * query string : keyword1, keyword2, color1, color2, startAt, endAt
 */
exports.searchPWWC = async function (req, res) {

    // color 배열
    const colorArr = [ "#d60f0f", "#f59a9a", "#ffb203", "#fde6b1", "#71a238", "#b7de89",
    "#ea7831", "#273e88", "#4168e8", "#a5b9fa", "#894ac7", "#dcacff",
    "#ffffff", "#888888", "#191919", "#e8dcd5", "#c3b5ac", "#74461f"]

    let datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

    var lookpointPattern = /^[1-5]$/;
    var blank_pattern = /^\s+|\s+$/g;


    //1. jwt token검증
    const userIdx = req.verifiedToken.userIdx;

    
    var PWWC = req.params.PWWC;  
    // PWWC 빈값 검사
    if(!PWWC){
        return res.send(errResponse(baseResponse.PWWC_EMPTY));
    }

    PWWC = parseInt(PWWC);

    //PWWC 형식 검사
    if(isNaN(PWWC)){
        return res.send(errResponse(baseResponse.PWWC_ERROR_TYPE));
    }
    //PWWW 값 유효성 검사 - 0: place, 1: weather, 2: who, 3: color
    if(PWWC < 0 || PWWC > 3){
        return res.send(errResponse(baseResponse.PWWC_INVALID_VALUE));
    }

    /**
     * Query String: keyword1, keyword2, color1, color2             //startAt, endAt 
     */
    
    let keyword1 = req.query.keyword1;
    let keyword2 = req.query.keyword2;

    var color1 = req.query.color1;       
    var color2 = req.query.color2;

    var startAt = req.query.startAt;
    var endAt = req.query.endAt;


    if (!keyword1) {
        return res.send(errResponse(baseResponse.KEYWORD1_EMPTY));
    }

    var keyword1_test = keyword1.toString();
    if(keyword1_test.replace(blank_pattern, '' ) == "" ){
        return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));  
    }

    keyword1 = keyword1.toString().trim();
    
    if(keyword1.length > 6){            
        return res.send(errResponse(baseResponse.SEARCH_KEYWORD_LENGTH));
    }


    if(keyword2){
        var keyword2_test = keyword2.toString();
        if(keyword2_test.replace(blank_pattern, '' ) == "" ){
            return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));  
        }

        keyword2 = keyword2.toString().trim();
        
        if(keyword2.length > 6){            
            return res.send(errResponse(baseResponse.SEARCH_KEYWORD_LENGTH));
        }
    }else{
        keyword2 = null;
    }


    if(PWWC == 3){ // color 검색일 경우
        //color1 빈값 검사 
        if(!color1){    
            return res.send(errResponse(baseResponse.COLOR1_EMPTY));
        }        
        
        color1 = color1.toString().trim();

        //color1 값 유효성 검사                         ㅌ -> color 선택안할시 다른 string으로 보내주시술?
        if(colorArr.indexOf(color1) == -1){        //정해진 color 값들 이외의 값이 들어온 경우
            return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
        }
        else if(keyword2){//검색어가 2개인 경우      
            if(!color2){                                // keyword2에 해당하는 color2가 입력되지 않은 경우
                return res.send(errResponse(baseResponse.COLOR2_EMPTY));
            }        
            color2 = color2.toString().trim();  
            if(colorArr.indexOf(color2) == -1){          //정해진 color 값들 이외의 값이 들어온 경우
                return res.send(errResponse(baseResponse.COLOR2_INVALID_VALUE));
            }
        }
        else if(color2 && (!keyword2)){                 //검색어가 2개인 경우 - color2에 해당하는 keyword2가 입력되지 않은 경우
            return res.send(errResponse(baseResponse.KEYWORD2_EMPTY));
        }   
    }
    else if( (PWWC != 3) && (color1 || color2) ){       //color검색이 아닌 경우 color1, color2가 존재할 경우 에러
        return res.send(errResponse(baseResponse.UNNECESSARY_COLOR));
        
    }

    if(startAt && (!endAt)){ //startAt만 입력
        return res.send(errResponse(baseResponse.ENDAT_EMPTY));
    }
    else if(endAt && (!startAt)){  //endAt만 입력했을 경우
        return res.send(errResponse(baseResponse.STARTAT_EMPTY));
    }
    else if (startAt && endAt) {

        startAt = new Date(startAt.toString().trim());
        endAt = new Date(endAt.toString().trim());
        if(datePattern.test(startAt)){     //yyyy-MM-dd 형식 검사
            return res.send(errResponse(baseResponse.STARTAT_ERROR_TYPE));  
        }
        if(datePattern.test(endAt)){     //yyyy-MM-dd 형식 검사
            return res.send(errResponse(baseResponse.ENDAT_ERROR_TYPE));  
        }
        
        const dateRangeStart = new Date('2010-01-01');
        const dateRangeEnd = new Date('2099-12-31');

        if( startAt < dateRangeStart || startAt > dateRangeEnd){
            return res.send(errResponse(baseResponse.STARTAT_INVALID_VALUE));  
        }
        if( endAt < dateRangeStart || endAt > dateRangeEnd){
            return res.send(errResponse(baseResponse.ENDAT_INVALID_VALUE));
        }
    }
    else{                               // ((!startAt) && (!endAt))
        startAt = null;
        endAt = null;
    }
    
    

    //1. history 처리 @searchService - 개수 조회, 자동삭제, history추가
    const historyResponse = await searchService.postNewHistory(
        userIdx, PWWC, keyword1, keyword2, color1, color2, 
    );


    //2. 검색 결과 보여지기 @searchProvider - keyword1로 가져온 결과에서 keyword2가 null이 아니면 keyword2 포함하지 않는 것 제외하기
    const searchResultResponse = await searchProvider.retrieveSearchResult(
        userIdx, PWWC, keyword1, keyword2, color1, color2, startAt, endAt
    );


    if(!searchResultResponse){
        if(startAt && endAt){
            return res.send(errResponse(baseResponse.SEARCH_DATE_OOTD_EMPTY));
        }
        else{
            return res.send(errResponse(baseResponse.SEARCH_NOT_FOUND));
        }
    }     

    const searchFinalResult = {};

    searchFinalResult["match"] = searchResultResponse;
       


    if(startAt && endAt){
        return res.send(response(baseResponse.SUCCESS_MATCH_DATE, searchFinalResult));
    }
    else{
        return res.send(response(baseResponse.SUCCESS_MATCH, searchFinalResult));
    }

};


/**
 * API No. 19
 * API Name : [PWWC] 매칭 페이지 검색 키워드 제안
 * [GET] /app/search/suggestion/:PWWC
 * Path Variable : PWWC
 * Query String : keyword1
 */
exports.searchSuggestKeyword = async function (req, res) {

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

    return res.send(response(baseResponse.SUCCESS_SEARCH_SUGGEST, suggestFinalResult));
};
