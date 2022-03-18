const jwtMiddleware = require("../../../config/jwtMiddleware");
const calendarProvider = require("./calendarProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var lookpointPattern = /^[1-5]$/;

/**
 * API No. 6
 * API Name : Monthly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/monthly/:userIdx
 * path variable : userIdx
 * jwt : userIdx
 */
exports.getMonth = async function (req, res) {

    //console.log('[calendarController] getMonth start');
    const userIdx = req.verifiedToken.userIdx;

    // userIdx를 통한 Monthly 달력 OOTD 검색 함수 및 결과 저장
    const callMonthCalOotd = await calendarProvider.retrieveMonthlyList(userIdx);
    
    for(i in callMonthCalOotd){
        //lookpoint 값 추출 확인
        if(!lookpointPattern.test(callMonthCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        //date 값 추출 확인
        if(!datePattern.test(callMonthCalOotd[i].date)){
            return res.send(errResponse(baseResponse.DATE_RESPONSE_ERROR));
        }
    }

    const monthCalFinalResult = {};
    monthCalFinalResult["monthly"] = callMonthCalOotd;

    //console.log('[calendarController] getMonth finish')
    return res.send(response(baseResponse.SUCCESS_MONTHLY_CALENDAR, monthCalFinalResult));

}

/**
 * API No. 7
 * API Name : Weekly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/weekly/:userIdx
 * path variable : userIdx
 * jwt : userIdx
 */
exports.getWeek = async function (req, res) {

    //console.log('[calendarController] getWeek start');
    const userIdx = req.verifiedToken.userIdx;

    // userId를 통한 Weekly 달력 OOTD 검색 함수 및 결과 저장
    const callWeekCalOotd = await calendarProvider.retrieveWeeklyList(userIdx);

    for(i in callWeekCalOotd){
        // lookpoint 값 추출 확인
        if(!lookpointPattern.test(callWeekCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        //date 값 추출 확인
        if(!datePattern.test(callWeekCalOotd[i].date)){
            return res.send(errResponse(baseResponse.DATE_RESPONSE_ERROR));
        }

        if(callWeekCalOotd[i].imageUrl == null && callWeekCalOotd[i].imageCnt > 0){
            return res.send(errResponse(baseResponse.PRINT_IMG_ERROR));
        }
    }
    
    const weekCalFinalResult = {};
    weekCalFinalResult["weekly"] = callWeekCalOotd;

    //console.log('[calendarController] getWeek finish')
    return res.send(response(baseResponse.SUCCESS_WEEKLY_CALENDAR, weekCalFinalResult));

};