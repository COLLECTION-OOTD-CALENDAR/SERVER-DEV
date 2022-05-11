const jwtMiddleware = require("../../../config/jwtMiddleware");
const mylookProvider = require("./mylookProvider");
const mylookService = require("./mylookService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");



/**
 * API No. 13
 * API Name : MY LOOK 메인페이지 불러오기
 * [GET] /app/mylook/mainpage/:lookpoint
 * path variable : userIdx , lookpoint
 */
exports.getMyLookMain = async function (req, res) {


    const userIdx = req.verifiedToken.userIdx;

    const lookpoint = req.params.lookpoint;

  
    if(!lookpoint){
        return res.send(errResponse(baseResponse.LOOKPOTNT_EMPTY));
    }
    else if(lookpoint < 0 || lookpoint > 5){
        return res.send(errResponse(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    const getMyLook = await mylookProvider.getMyLookMain(lookpoint, userIdx);
    return res.send(getMyLook);

}



/**
 * API No.14 
 * API Name : MY LOOK 상세페이지 
 * [GET] /app/mylook/detail/:lookpoint
 * path variable : userIdx, lookpoint
 */

 exports.getMyLookDetail = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const lookpoint = req.params.lookpoint;

    if(!lookpoint){
        return res.send(errResponse(baseResponse.LOOKPOTNT_EMPTY));
    }
    if(lookpoint < 0 || lookpoint > 5){
        return res.send(errResponse(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    const getMyLookD = await mylookProvider.getMyLookDetail(lookpoint, userIdx);
    return res.send(getMyLookD);
}










