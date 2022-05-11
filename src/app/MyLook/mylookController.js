const mylookProvider = require("./mylookProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");



/**
 * API No. 13
 * API Name : MY LOOK 메인페이지 불러오기
 * [GET] /app/mylook/mainpage/:lookpoint
 * path variable : userIdx , lookpoint
 */
exports.mylookMain = async function (req, res) {


    const userIdx = req.verifiedToken.userIdx;

    const lookpoint = req.params.lookpoint;

  
    if(!lookpoint){
        return res.send(response(baseResponse.LOOKPOTNT_EMPTY));
    }
    else if(lookpoint < 0 || lookpoint > 5){
        return res.send(response(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    const getMyLook = await mylookProvider.retrieveMylookMain(lookpoint, userIdx);
    return res.send(getMyLook);

}



/**
 * API No.14 
 * API Name : MY LOOK 상세페이지 
 * [GET] /app/mylook/detail/:lookpoint
 * path variable : userIdx, lookpoint
 */

 exports.mylookDetail = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const lookpoint = req.params.lookpoint;

    if(!lookpoint){
        return res.send(response(baseResponse.LOOKPOTNT_EMPTY));
    }
    if(lookpoint < 0 || lookpoint > 5){
        return res.send(response(baseResponse.LOOKPOINT_INVALID_VALUE));
    }

    const getMyLookD = await mylookProvider.retrieveMylookDetail(lookpoint, userIdx);
    return res.send(getMyLookD);
}










