const calendarProvider = require("./calendarProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
var lookpointPattern = /^[1-5]$/;

/**
 * API No. 6
 * API Name : Monthly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/monthly/:userIdx
 * Path Variable : userIdx
 * jwt : userIdx
 */
exports.calendarMonthly = async function (req, res) {

    //console.log('[calendarController] getMonth start');
    const userIdx = req.verifiedToken.userIdx;

    const callMonthCalOotd = await calendarProvider.retrieveMonthlyList(userIdx);
    
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

    //console.log('[calendarController] getMonth finish')
    return res.send(response(baseResponse.SUCCESS_MONTHLY_CALENDAR, monthCalFinalResult));

}

/**
 * API No. 7
 * API Name : Weekly 달력 OOTD 부르기 API + JWT
 * [GET] /app/calendar/weekly/:userIdx
 * Path Variable : userIdx
 * jwt : userIdx
 */
exports.calendarWeekly = async function (req, res) {

    //console.log('[calendarController] getWeek start');
    const userIdx = req.verifiedToken.userIdx;

    const callWeekCalOotd = await calendarProvider.retrieveWeeklyList(userIdx);

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

    //console.log('[calendarController] getWeek finish')
    return res.send(response(baseResponse.SUCCESS_WEEKLY_CALENDAR, weekCalFinalResult));

};