const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 22
 * API Name : 비밀번호 재설정 API
 * [PATCH] /app/user/reset-password 
 * body : newPassword, checkPassword
 */

exports.patchPassword = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    
    const newPassword = req.body.newPassword;

    const checkPassword = req.body.checkPassword;



    //빈 값 체크
    if (!newPassword){
        return res.send(errResponse(baseResponse.MODI_NEW_PW_EMPTY));
    }
    else if(!checkPassword){
        return res.send(errResponse(baseResponse.MODI_CHECK_PW_EMPTY));
    }
            
    //길이 체크
    if (newPassword.length < 6 || newPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_NEW_PW_LENGTH));
    }  
    else if (checkPassword.length < 6 || checkPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_CHECK_PW_LENGTH));
    }  


        
    const updatePwResponse = await userService.updatePw(
        userIdx, 
        newPassword
    );

    return res.send(updatePwResponse)

}
