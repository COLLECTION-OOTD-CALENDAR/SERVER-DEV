const calendarProvider = require("./calendarProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var lookpointPattern = /^[1-5]$/;

/**
 * API No. 6
 * API Name : Monthly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/monthly
 * jwt : userIdx
 */
exports.calendarMonthly = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const callMonthCalOotd = await calendarProvider.retrieveMonthlyList(userIdx);
    
    // 형식 및 유효성 검사 - lookpoint pattern, date pattern
    for(i in callMonthCalOotd){
        if(!lookpointPattern.test(callMonthCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        if(!datePattern.test(callMonthCalOotd[i].date)){
            return res.send(errResponse(baseResponse.DATE_RESPONSE_ERROR));
        }
    }

    const monthCalFinalResult = {};
    monthCalFinalResult["monthly"] = callMonthCalOotd;

    return res.send(response(baseResponse.SUCCESS_MONTHLY_CALENDAR, monthCalFinalResult));

}

/**
 * API No. 7
 * API Name : Weekly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/weekly
 * jwt : userIdx
 */
exports.calendarWeekly = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const callWeekCalOotd = await calendarProvider.retrieveWeeklyList(userIdx);

    // 형식 및 유효성 검사 - lookpoint pattern, date pattern, img
    for(i in callWeekCalOotd){
        if(!lookpointPattern.test(callWeekCalOotd[i].lookpoint)){
            return res.send(errResponse(baseResponse.LOOKPOINT_RESPONSE_ERROR));
        }
        if(!datePattern.test(callWeekCalOotd[i].date)){
            return res.send(errResponse(baseResponse.DATE_RESPONSE_ERROR));
        }

        if(callWeekCalOotd[i].imageUrl == null && callWeekCalOotd[i].imageCnt > 0){
            return res.send(errResponse(baseResponse.PRINT_IMG_ERROR));
        }
    }
    
    const weekCalFinalResult = {};
    weekCalFinalResult["weekly"] = callWeekCalOotd;

    return res.send(response(baseResponse.SUCCESS_WEEKLY_CALENDAR, weekCalFinalResult));

};