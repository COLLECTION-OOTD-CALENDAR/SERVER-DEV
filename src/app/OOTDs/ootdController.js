const ootdProvider = require("./ootdProvider");
const ootdService = require("./ootdService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var blankPattern = /^\s+|\s+$/g;
var lookpointPattern = /^[1-5]$/;

/**
 * API No. 8
 * API Name : OOTD 최종 등록하기
 * [POST] /app/ootd/last-register/:userIdx
 * Query String : mode (1 : register 2 : modi)
 * Body : date, lookname, photoIs, image[{imageUrl, thumbnail}],
 * fClothes[{index, color}], aClothes[{bigClass, smallClass, color}], 
 * fPlace[placeIdx], aPlace[place], fWeather[weatherIdx], aWeather[weather],
 * fWho[whoIdx], aWho[who], lookpoint, comment
 * (FixedPlace.index 값은 받을 수 있지만 AddedPlace.index 는 받을 수 없어서 Place.addedPlace -1 여부 체크하고 AddedPlace.place 값과 비교) 
 * jwt : userIdx
 */

exports.ootdRegister = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    const mode = req.query.mode;

    let {date, lookname, photoIs, image, fClothes, aClothes,
    fPlace, aPlace, fWeather, aWeather, fWho, aWho, lookpoint, comment} = req.body;

    // request body 풀어내기
    const n_date = new Date(date);
    const n_lookpoint = Math.trunc(lookpoint);

    // color 배열
    const colorArr = [ "#d60f0f", "#f59a9a", "#ffb203", "#fde6b1", "#71a238", "#b7de89",
    "#ea7831", "#273e88", "#4168e8", "#a5b9fa", "#894ac7", "#dcacff",
    "#ffffff", "#888888", "#191919", "#e8dcd5", "#c3b5ac", "#74461f"]

    // bigClass 배열
    const bigArr = ["Top", "Bottom", "Shoes", "Etc"];

    /*********************************************** */
    /*****************request error***************** */
    /*********************************************** */

    // mode가 없을 경우 error
    if(!mode){
        return res.send(errResponse(baseResponse.MODE_EMPTY));
    }

    // 숫자가 아닌 경우 error : 약한 검사
    if(isNaN(mode)){
        return res.send(errResponse(baseResponse.MODE_ERROR_TYPE));
    }

    // mode가 유효한 값이 아닌 경우(1,2) : 강한 검사
    if(mode != 1 && mode != 2){
        return res.send(errResponse(baseResponse.MODE_INVALID_VALUE));
    }

    // date 빈 값 체크
    if(!date) {
        return res.send(errResponse(baseResponse.DATE_EMPTY));
    }

    // date 형식 체크 
    if(!datePattern.test(date)){
        return res.send(errResponse(baseResponse.DATE_ERROR_TYPE));
    }

    // 2010년 1월 1일 ~ 2099년 12월 31 일 이내의 date(유효 date)인지 체크
    var date_start = new Date('2010-01-01');
    var date_end = new Date('2100-01-01');

    if(n_date < date_start || n_date > date_end) {
        return res.send(errResponse(baseResponse.DATE_INVALID_VALUE));
    }

    // lookname 빈 값 체크, key에 looknam이 없을 때
    if(!lookname){
        return res.send(errResponse(baseResponse.LOOKNAME_EMPTY));
    }

    // lookname에 공백만 입력된 경우
    lookname = lookname.toString();
    if(lookname.replace(blankPattern, '') == ""){
        return res.send(errResponse(baseResponse.REGISTER_BLANK_ALL));
    }

    // lookname 길이가 27자리를 초과할 때
    if(lookname.length > 27){
        return res.send(errResponse(baseResponse.LOOKNAME_LENGTH));
    }

    // photoIs 빈 값 체크
    if(photoIs === '' || photoIs === null || photoIs === undefined || photoIs === NaN){
        return res.send(errResponse(baseResponse.PHOTOIS_EMPTY));
    }

    // photoIs 형식 체크 (정수가 아닐 경우 error)
    if(!Number.isInteger(photoIs)){
        return res.send(errResponse(baseResponse.PHOTOIS_ERROR_TYPE));
    }

    // photoIs 값 -1 또는 0인지 체크
    if(photoIs != -1 && photoIs != 0){
        return res.send(errResponse(baseResponse.PHOTOIS_INVALID_VALUE));
    }

    // image 키가 없을 경우 & 값이 비어있을 경우
    if(!image){
        return res.send(errResponse(baseResponse.REGISTER_IMAGE_EMPTY));
    }
    
    // image 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(image)){
        return res.send(errResponse(baseResponse.IMAGE_ERROR_TYPE));
    }

    // photoIs 는 0인데 Image value인 배열 내 객체가 없을 경우
    if(photoIs == 0 && !image[0]){
        return res.send(errResponse(baseResponse.REGISTER_IMAGE_OBJ));
    }

    // thumbnail = 0 개수 검사를 하기 위함
    let cntThumb = 0;
    for(item of image){ // 배열의 원소가 하나라도 있어야 들어오는 반복문
        
        // thumbnail = 0 개수 검사를 하기 위함
        if(item == image[0]){
            cntThumb = -1;
        }

        // imgUrl 키가 없을 경우
        if(!item["imageUrl"]) {
            return res.send(errResponse(baseResponse.REGISTER_IMGURL_EMPTY));
        }

        // thumbnail 키가 없을 경우 (0이 가능하기에 이렇게)
        if(item["thumbnail"] === '' || item["thumbnail"] === null || item["thumbnail"] === undefined || item["thumbnail"] === NaN){
            return res.send(errResponse(baseResponse.REGISTER_THUMBNAIL_EMPTY));
        }
        
        // 입력된 이미지 URL이 S3에 존재하지 않는 경우 : 할 필요성이 낮아 하지 않음
        // 이미지 값 string 형태로 변형
        let imgUrlStr = item["imageUrl"].toString();
        item["imageUrl"] = imgUrlStr;

        // thumbnail 형식 체크 (정수가 아닐 경우 error)
        if(!Number.isInteger(item["thumbnail"])){
            return res.send(errResponse(baseResponse.THUMBNAIL_ERROR_TYPE));
        }
        // thumbnail 값 -1 또는 0인지 체크
        if(item["thumbnail"] != -1 && item["thumbnail"] != 0){
            return res.send(errResponse(baseResponse.THUMBNAIL_INVALID_VALUE));
        }
        
        // thumbnail에 1개의 0이 없을 경우
        if(item["thumbnail"] == 0){
            cntThumb+=1;
        }
    }

    // thumbnail에 1개의 0이 없을 경우
    if(cntThumb != 0){
        return res.send(errResponse(baseResponse.THUMBNAIL_MANY_MAIN));
    }

    // fClothes 키가 없을 경우, 빈 값인 경우
    if(!fClothes) {
        return res.send(errResponse(baseResponse.REGISTER_FCLOTHES_EMPTY));
    }
    // fClothes 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(fClothes)){
        return res.send(errResponse(baseResponse.REGISTER_FCLOTHES_ERROR_TYPE));
    }

    // aClothes 키가 없을 경우, 빈 값인 경우
    if(!aClothes){
        return res.send(errResponse(baseResponse.REGISTER_ACLOTHES_EMPTY));
    }
    // aClothes 변수 형식 체크 (배열이 아닐 경우 error)
    if(!Array.isArray(aClothes)){
        return res.send(errResponse(baseResponse.REGISTER_ACLOTHES_ERROR_TYPE));
    }
    
    // 선택된 Clothes가 없을 경우
    if(!fClothes[0] && !aClothes[0]){
        return res.send(errResponse(baseResponse.REGISTER_CLOTHES_EMPTY));
    }else {
        // fClothes 내 객체 조건 
        for(item of fClothes){
            // index 키가 없을 경우 및 빈 값인 경우
            if(!item["index"]){
                return res.send(errResponse(baseResponse.FCLOTHES_INDEX_EMPTY));
            }

            // color 키가 없을 경우 및 빈 값인 경우
            if(!item["color"]){
                return res.send(errResponse(baseResponse.FCLOTHES_COLOR_EMPTY));
            }

            // 올바르지 않은 fixedClothes index 형식 (정수가 아닌 경우)
            if(!Number.isInteger(item["index"])){
                return res.send(errResponse(baseResponse.FCLOTHES_ERROR_TYPE));
            }
            
            // color toString 해준 뒤 color 배열에 존재하는 값인지 확인
            let fixedColorStr = item["color"].toString();
            item["color"] = fixedColorStr;
            if(colorArr.indexOf(item["color"]) == -1){
                return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
            }

        }

        // aClothes 내 객체 조건 
        for(let i in aClothes){
            // bigClass 키가 없을 경우 및 빈 값인 경우
            if(!aClothes[i].bigClass){
                return res.send(errResponse(baseResponse.ACLOTHES_BIG_EMPTY));
            }

            // smallClass 키가 없을 경우 및 빈 값인 경우
            if(!aClothes[i].smallClass){
                return res.send(errResponse(baseResponse.ACLOTHES_SMALL_EMPTY));
            }

            // color 키가 없을 경우 및 빈 값인 경우
            if(!aClothes[i].color){
                return res.send(errResponse(baseResponse.ACLOTHES_COLOR_EMPTY));
            }

            // 존재하지 않는 옷 카테고리
            let strBig = (aClothes[i].bigClass).toString();
            aClothes[i].bigClass = strBig;
            if(bigArr.indexOf(aClothes[i].bigClass) == -1){
                return res.send(errResponse(baseResponse.BIG_CLASS_NOT_MATCH));
            }

            // smallClass string화
            let strSmall = (aClothes[i].smallClass).toString();
            aClothes[i].smallClass = strSmall;

            // 유효하지 않은 COLOR 값
            let addedColorStr = (aClothes[i].color).toString();
            aClothes[i].color = addedColorStr;
            if(colorArr.indexOf(aClothes[i].color) == -1){
                return res.send(errResponse(baseResponse.COLOR_INVALID_VALUE));
            }
        }

    }


    // Place (fPlace & aPlace) key가 없는 경우 및 빈 값 체크
    if(!fPlace || !aPlace){
        return res.send(errResponse(baseResponse.REGISTER_PLACE_EMPTY));
    }
    else if(!Array.isArray(fPlace) || !Array.isArray(aPlace)){ // fPlace와 aPlace 형식이 배열인지 체크
        return res.send(errResponse(baseResponse.REGISTER_PLACE_ERROR_TYPE));
    }
    else {
        let placeCnt = 0;
        // 올바르지 않은 fPlace index 형식
        for(item of fPlace){
            if(!Number.isInteger(item)){
                return res.send(errResponse(baseResponse.FPLACE_ERROR_TYPE));
            }
            placeCnt++;
        }

        //aPlace 자체 String 변경
        for(let i in aPlace){

            item = aPlace[i].toString();
            aPlace[i] = item;
            placeCnt++;
        }
        
        // 최대 두 개의 장소 선택 가능
        if(placeCnt > 2){
            return res.send(errResponse(baseResponse.REGISTER_PLACE_MAX));
        }
    }

    // Weather (fWeather & aWeather) key가 없는 경우 및 빈 값 체크
    if(!fWeather || !aWeather){
        return res.send(errResponse(baseResponse.REGISTER_WEATHER_EMPTY));
    }
    else if(!Array.isArray(fWeather) || !Array.isArray(aWeather)){ // fWeather와 aWeather 형식이 배열인지 체크
        return res.send(errResponse(baseResponse.REGISTER_WEATHER_ERROR_TYPE));
    }
    else{
        let weatherCnt = 0;
        // 올바르지 않은 fWeather index 형식
        for(item of fWeather){
            if(!Number.isInteger(item)){
                return res.send(errResponse(baseResponse.FWEATHER_ERROR_TYPE));
            }
            weatherCnt++;
        }
        // aWeather 자체 String 변경
        for(let i in aWeather){
            item = aWeather[i].toString();
            aWeather[i] = item;
            weatherCnt++;
        }

        // 최대 두 개의 날씨 선택 가능
        if(weatherCnt > 2){
            return res.send(errResponse(baseResponse.REGISTER_WEATHER_MAX));
        }
    }

    // Who (fWho & aWho) key가 없는 경우 및 빈 값 체크
    if(!fWho || !aWho){
        return res.send(errResponse(baseResponse.REGISTER_WHO_EMPTY));
    }
    else if(!Array.isArray(fWho) || !Array.isArray(aWho)){ // fWho와 aWho 형식이 배열인지 체크
        return res.send(errResponse(baseResponse.REGISTER_WHO_ERROR_TYPE));
    }    
    else {
        let whoCnt = 0;
        // 올바르지 않은 fWho index 형식
        for(item of fWho){
            if(!Number.isInteger(item)){
                return res.send(errResponse(baseResponse.FWHO_ERROR_TYPE));
            }
            whoCnt++;
        }
        // aWho 자체 String 변경
        for(let i in aWho){
            item = aWho[i].toString();
            aWho[i] = item;
            whoCnt++;
        }

        // 최대 두 개의 누구 선택 가능
        if(whoCnt > 2){
            return res.send(errResponse(baseResponse.REGISTER_WHO_MAX));
        }
    }

    // LOOKPOINT key가 없는 경우 및 빈 값 체크
    if(!lookpoint){
        return res.send(errResponse(baseResponse.LOOKPOTNT_EMPTY));
    }
    
    if(!isInt(lookpoint)){
        return res.send(errResponse(baseResponse.LOOKPOINT_ERROR_TYPE));
    }
    // LOOKPOINT 범위 체크
    if(!lookpointPattern.test(n_lookpoint)){
        return res.send(errResponse(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    //코멘트가 있는 경우
    if(comment){
        comment = comment.toString();
        // COMMENT 길이 체크
        if(comment.length > 65535){
            return res.send(errResponse(baseResponse.COMMENT_LENGTH));
        }
    }

    
    /********************************************** */
    /****************response error**************** */
    /********************************************** */

    // 나중에 ootdService 내부 코드들과 합치는 게 좋긴 했으나,
    // 특정 테이블에만 값이 삽입될 경우 방지를 위해 따로 뺌
    // 추후 코드 리팩토링 기간 내 transaction 처리 가능 여부 열어놓기

    // 입력한 날짜에 OOTD 존재 여부 체크
    const ootdRow = await ootdProvider.checkOotdDate(userIdx, n_date);

    // ootdRow의 결과와 mode가 잘 맞지 않는 경우
    // ootdRow가 없는데 수정모드일 경우, ootdRow가 있는데 등록모드일 경우 error
    if(ootdRow && mode == 1){ // 입력된 date에 이미 OOTD 존재 (새로 등록시 문제)
        return res.send(errResponse(baseResponse.OOTD_ALREADY_EXIST));
    }
    else if (!ootdRow && mode == 2){ // 입력된 date OOTD 존재안함 (수정시 문제)
        return res.send(errResponse(baseResponse.OOTD_NOT_EXIST));
    }

    // 수정모드일 때, status : active -> inactive이므로 OOTD 삭제 코드 활용 예정
    if(mode == 2){
        const modiOriginResult = await ootdService.patchOriginStatus(userIdx, ootdRow.ootdIdx);
    }

    // 등록할 수 없는 옷(fClothes->index, aClothes->smallClass)
    for (item of fClothes){
        const fclothesRow = await ootdProvider.checkClothes(userIdx, item["index"]);

        // 존재하는 고정 옷이 아닐 때
        if(fclothesRow.length == 0){
            return res.send(errResponse(baseResponse.CLOTHES_NOT_MATCH));
        }
    }
    for (item of aClothes){
        const aClothesParams = item["smallClass"];
        const aclothesRow = await ootdProvider.checkClothes(userIdx, aClothesParams);

        // 사용자가 추가한 옷이 아닐 때
        if(aclothesRow.length == 0){
            return res.send(errResponse(baseResponse.CLOTHES_NOT_MATCH));
        }
    
    }

    // 등록할 수 없는 Place (fPlace->index, aPlace->place)
    for (item of fPlace){
        const fplaceRow = await ootdProvider.checkPlace(userIdx, item);

        // 존재하는 고정 장소가 아닐 때
        if(fplaceRow.length == 0){
            return res.send(errResponse(baseResponse.PLACE_NOT_MATCH));
        }
    }
    for (item of aPlace){
        const aplaceRow = await ootdProvider.checkPlace(userIdx, item);

        // 사용자가 추가한 장소가 아닐 때
        if(aplaceRow.length == 0){
            return res.send(errResponse(baseResponse.PLACE_NOT_MATCH));
        }
    }

    // 등록할 수 없는 Weather (fWeather->index, aWeather->weather)
    for (item of fWeather){
        const fweatherRow = await ootdProvider.checkWeather(userIdx, item);

        // 존재하는 고정 날씨가 아닐 때
        if(fweatherRow.length == 0){
            return res.send(errResponse(baseResponse.WEATHER_NOT_MATCH));
        }
    }
    for (item of aWeather){
        const aweatherRow = await ootdProvider.checkWeather(userIdx, item);

        // 사용자가 추가한 날씨가 아닐 때
        if(aweatherRow.length == 0){
            return res.send(errResponse(baseResponse.WEATHER_NOT_MATCH));
        }

    }

    // 등록할 수 없는 Who (fWho->index, aWho->who)
    for (item of fWho){
        const fwhoRow = await ootdProvider.checkWho(userIdx, item);
        
        // 존재하는 고정 누구가 아닐 때
        if(fwhoRow.length == 0){
            return res.send(errResponse(baseResponse.WHO_NOT_MATCH));
        }
    }
    for (item of aWho){
        const awhoRow = await ootdProvider.checkWho(userIdx, item);
        
        // 사용자가 추가한 누구가 아닐 때
        if(awhoRow.length == 0){
            return res.send(errResponse(baseResponse.WHO_NOT_MATCH));
        }
    }

    // 최종 등록 API 
    const registerUserOotd = await ootdService.postOotd(userIdx, date, lookname, photoIs, image, fClothes, aClothes,
        fPlace, aPlace, fWeather, aWeather, fWho, aWho, n_lookpoint, comment);
    
    return res.send(registerUserOotd);

};

function isInt(lookpoint){
    return typeof lookpoint === "number" && isFinite(lookpoint) && Math.floor(lookpoint) === lookpoint;
}


/**
 * API No. 8-2
 * API Name : 추가한 블록 내역 불러오기
 * [GET] /app/ootd/default-block
 * jwt : userIdx
 */

exports.ootdDefaultBlock = async function (req, res){

    const userIdx = req.verifiedToken.userIdx;

    const callDefaultOotd = await ootdProvider.retrieveAddedOotd(userIdx);

    return res.send(response(baseResponse.SUCCESS_OOTD_DEFAULT, callDefaultOotd));


};

/**
 * API No. 10
 * API Name : OOTD 수정하기 - 지난 작성 화면 보여주기
 * [GET] /app/ootd/modi
 * Query String : date
 * jwt : userIdx
 */

exports.ootdModi = async function (req, res){

    const userIdx = req.verifiedToken.userIdx;
    const date = req.query.date;

    // query string으로 date가 들어오지 않았을 경우
    if(!date){
        return res.send(errResponse(baseResponse.DATE_EMPTY));
    }

    // date 형식 체크 
    if(!datePattern.test(date)){
        return res.send(errResponse(baseResponse.DATE_ERROR_TYPE));
    }

    // 2010년 1월 1일 ~ 2099년 12월 31 일 이내의 date(유효 date)인지 체크
    var date_start = new Date('2010-01-01');
    var date_end = new Date('2100-01-01');
    let n_date = new Date(date);

    // 유효하지 않은 date 입력
    if(n_date < date_start || n_date > date_end) {
        return res.send(errResponse(baseResponse.DATE_INVALID_VALUE));
    }

    // 최종 반환할 변수 선언
    let result = {};

    // 해당 OOTD data 부르기
    const callCompleteOotd = await ootdProvider.retrieveCompleteOotd(userIdx, date);
    if(!callCompleteOotd){
        return res.send(errResponse(baseResponse.DATE_OOTD_EMPTY));
    }
    result["selected"] = callCompleteOotd;

    // 사용자가 지금까지 추가한 (삭제하지 않은) added~ 부르기
    const callModiOotd = await ootdProvider.retrieveAddedOotd(userIdx);
    result["added"] = callModiOotd;

    return res.send(response(baseResponse.SUCCESS_OOTD_MODI, result));
};



/**
 * API No. 12
 * API Name : OOTD 완료 페이지 불러오기
 * [GET] /app/ootd/complete
 * Query String : date
 * jwt : userIdx
 */
exports.ootdComplete = async function (req, res){

    const userIdx = req.verifiedToken.userIdx;
    const date = req.query.date;

    // query string으로 date가 들어오지 않았을 경우
    if(!date){
        return res.send(errResponse(baseResponse.DATE_EMPTY));
    }
    
    // date 형식 체크 
    if(!datePattern.test(date)){
        return res.send(errResponse(baseResponse.DATE_ERROR_TYPE));
    }

    // 2010년 1월 1일 ~ 2099년 12월 31 일 이내의 date(유효 date)인지 체크
    var date_start = new Date('2010-01-01');
    var date_end = new Date('2100-01-01');
    let n_date = new Date(date);

    // 유효하지 않은 date 입력
    if(n_date < date_start || n_date > date_end) {
        return res.send(errResponse(baseResponse.DATE_INVALID_VALUE));
    }

    const callCompleteOotd = await ootdProvider.retrieveCompleteOotd(userIdx, date);
    if(!callCompleteOotd){
        return res.send(errResponse(baseResponse.DATE_OOTD_EMPTY));
    }

    return res.send(callCompleteOotd);

};
