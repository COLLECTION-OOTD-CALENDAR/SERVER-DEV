const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

var regExp = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/; //전화번호 양식
var regExpcheck = /^01([0|1|6|7|8|9])([0-9]{3,4})?([0-9]{4})$/; //전화번호 값
var blank_pattern = /^\s+|\s+$/g; //공백문자만
var blank_all = /[\s]/g; //공백도 입력
var regExpName = /^[가-힣]{2,5}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/; //이름
var regExpSpecial = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;//특수문자 사용
var datePattern = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
// var regExpID = /^[a-z]+[a-z0-9]{5,14}$/g; //ID는 영문자로 시작하는 6~15자 영문자 또는 숫자
// var regExpPW = /^[a-z]+[a-z0-9]{5,14}$/g; //PW는 영문자로 시작하는 6~15자 영문자 또는 숫자


/**
 * API No. 0
 * API Name : 회원가입 API
 * [POST] /app/user/register
 * Body: name,nickname,ID,password,phoneNumber
 */
 exports.userRegister = async function (req, res) {


    const {name, nickname, ID, password, birthday, gender, phoneNumber} = req.body;

    // 빈 값 체크
    if (!name)
        return res.send(response(baseResponse.REGISTER_NAME_EMPTY));

    if (!nickname)
        return res.send(response(baseResponse.REGISTER_NICKNAME_EMPTY));

    if (!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY));

    if (!password)
        return res.send(response(baseResponse.REGISTER_PW_EMPTY));

    if (!birthday)
        return res.send(response(baseResponse.REGISTER_BIRTHDAY_EMPTY));

    if (!gender)
        return res.send(response(baseResponse.REGISTER_GENDER_EMPTY));

    if (!phoneNumber)
        return res.send(response(baseResponse.REGISTER_PHONE_EMPTY));

    //공백문자만 입력됐는지 체크
    var Name = name.toString();
    var Nickname = nickname.toString();
    var id = ID.toString();
    var Password = password.toString();
    var PhoneNumber = phoneNumber.toString();

    if(Name.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_ALL));
    }
    if(Nickname.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_ALL));
    }
    if(id.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_ALL));
    }
    if(Password.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_ALL));
    }
    if(PhoneNumber.replace(blank_pattern, '' ) == "" ){
        return res.send(response(baseResponse.REGISTER_BLANK_ALL));
    }
    
    //문자열에 공백이 있는 경우 
    
    if(blank_all.test(Name) == true || blank_all.test(Nickname) == true || blank_all.test(id) == true || blank_all.test(Password) == true || blank_all.test(PhoneNumber) == true){
        return res.send(response(baseResponse.REGISTER_BLANK_TEXT)); 
    }

    // date 값을 재할당. date 형식을 부여하기 위함
    const n_birthday = new Date(birthday);

    // date 형식 체크 
    if(!datePattern.test(birthday)){
        return res.send(errResponse(baseResponse.REGISTER_BIRTHDAY_ERROR_TYPE));
    }

    // 1900-01-01 ~ 오늘(로컬 날짜) 이내의 date(유효 date)인지 체크
    var birth_start = new Date('1900-01-01');
    var birth_end = new Date();

    if(n_birthday < birth_start || n_birthday > birth_end) {
        return res.send(errResponse(baseResponse.REGISTER_BIRTHDAY_INVALID_VALUE));
    }

    // gender 형식 체크 (정수가 아닐 경우 error)
    if(!Number.isInteger(gender)){
        return res.send(errResponse(baseResponse.REGISTER_GENDER_ERROR_TYPE));
    }

    // gender 값 1 또는 2인지 체크
    if(gender != 1 && gender != 2){
        return res.send(errResponse(baseResponse.REGISTER_GENDER_INVALID_VALUE));
    }

    // 길이 체크
    if (ID.length < 6 || ID.length > 15 )  
        return res.send(response(baseResponse.REGISTER_ID_LENGTH));

    if (password.length < 6 || password.length > 15 )  
        return res.send(response(baseResponse.REGISTER_PW_LENGTH));

    if (nickname.length < 2 || nickname.length > 6 )  
        return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));


    // 형식 체크 (by 정규표현식)

    if(!regExpName.test(name)){
        return res.send(response(baseResponse.REGISTER_NAME_REGEXP)); 
    }
    else if(regExpSpecial.test(nickname)){
        return res.send(response(baseResponse.REGISTER_NICKNAME_REGEXP));
    }
    // else if(!regExpID.test(id)){
    //     return res.send(response(baseResponse.REGISTER_ID_REGEXP));
    // }
    // else if(!regExpPW.test(Password)){
    //     return res.send(response(baseResponse.REGISTER_PW_REGEXP));
    // }
    else if (regExp.test(phoneNumber)){
        return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN));
    }
    else if (!regExpcheck.test(phoneNumber)){
        return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE));
    }


    // register 함수 실행을 통한 결과 값을 registerResponse에 저장
    const registerResponse = await userService.postRegister(
        name,
        nickname,
        ID,
        password,
        birthday,
        gender,
        phoneNumber,
    );

    // registerResponse 값을 json으로 전달
    return res.send(registerResponse);
};

/**
 * API No. 1
 * API Name : 중복 ID 확인 
 * [GET] /app/user/duplicate-id
 * query string : ID
 */

 exports.userDuplicateID = async function (req, res) {

    const ID = req.query.ID;
    var id = ID.toString();

    try{

        //빈 값 체크
        if (!ID){
            return res.send(response(baseResponse.REGISTER_ID_EMPTY));
        }
        
        //공백문자만 입력됐는지 체크
        if(id.replace(blank_pattern, '' ) == "" ){
            return res.send(response(baseResponse.REGISTER_BLANK_ALL));
        }

        //문자열에 공백이 있는 경우
        if(blank_all.test(id) == true){
            return res.send(response(baseResponse.REGISTER_BLANK_TEXT)); 
        }

        //중복 체크
        const IDRows = await userProvider.checkID(ID);
        if (IDRows.length > 0){
            return res.send(response(baseResponse.REGISTER_ID_REDUNDANT));
        }
        else{
            return res.send(response(baseResponse.SUCCESS_DUPLICATE_ID));
        }
    } catch (err) {
        logger.error(`App - userDuplicateID Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }

    
};


/**
 * API No. 2
 * API Name : 닉네임 확인
 * [GET] /app/user/check-nickname
 * query string : nickname
 */

 exports.userNickname = async function(req, res) {

    const nickname = req.query.nickname;
    var Nickname = nickname.toString();
    
    try{
        //빈 값 체크
        if(!nickname)
            return res.send(response(baseResponse.REGISTER_NICKNAME_EMPTY)); 

        //공백문자만 입력됐는지 체크
        if(Nickname.replace(blank_pattern, '' ) == "" ){
            return res.send(response(baseResponse.REGISTER_BLANK_ALL));
        }

        //문자열에 공백이 있는 경우
        if(blank_all.test(Nickname) == true){
            return res.send(response(baseResponse.REGISTER_BLANK_TEXT)); 
        }

        //길이 체크
        if(nickname.length < 2 || nickname.length > 6 )  
            return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));

        //정규식 체크 - 닉네임에 특수문자 불가능
        if(regExpSpecial.test(nickname))
            return res.send(response(baseResponse.REGISTER_NICKNAME_REGEXP));

        //중복 체크
        const nicknameRows = await userProvider.checkNickname(nickname);
        if (nicknameRows.length > 0){
            return res.send(response(baseResponse.REGISTER_NICKNAME_REDUNDANT));
        }
        else{
            return res.send(response(baseResponse.SUCCESS_DUPLICATE_NICKNAME));
        }
    } catch (err) {
        logger.error(`App - userNickname Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }


};

/**
 * API NO. 3
 * API Name : 로그인
 * [POST] /app/user/login
 * body: ID, password
 */

 exports.userLogin = async function (req, res) {

    const ID = req.body.ID;
    const password = req.body.password;

    //빈 값 체크
    if(!ID)
        return res.send(response(baseResponse.REGISTER_ID_EMPTY)); 

    if(!password)
        return res.send(response(baseResponse.REGISTER_PW_EMPTY)); 


    const logInResponse = await userService.postLogIn(ID,password);

    return res.send(logInResponse);
}

/**
 * API No. 3-1
 * API Name : 자동로그인
 * [GET] /app/user/autologin
 * path variable : userIdx
 */

 exports.userAutoLogin = async function (req, res) {
    const userIdx = req.verifiedToken.userIdx;
    console.log(userIdx);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};



/**
 * API NO.4-1
 * API Name : 회원정보 수정 (닉네임)
 * [PATCH] /app/user/modi-nickname/:userIdx
 * path variable : userIdx
 * body : nickname
 */

 exports.userModiNickname = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    
    const nickname = req.body.nickname;

    const nicknameRows = await userProvider.checkNickname(nickname);


    
    //중복 체크
    if (nicknameRows.length > 0){
        return res.send(response(baseResponse.REGISTER_NICKNAME_REDUNDANT));
    }

    //빈 값 체크
    else if (!nickname) 
        return res.send(response(baseResponse.MODI_NEW_NICKNAME_EMPTY));

    //정규식 체크 - 닉네임에 특수문자 불가능
    else if(regExpSpecial.test(nickname)){
        return res.send(response(baseResponse.REGISTER_NICKNAME_REGEXP));
    }

    //길이 체크
    else if (nickname.length < 2 || nickname.length > 6 ){
        return res.send(response(baseResponse.REGISTER_NICKNAME_LENGTH));
    }  


    const patchNickname = await userService.patchNickname(nickname, userIdx);
    return res.send(patchNickname);

    

}

/**
 * API NO.4-2
 * API Name : 회원정보 수정(비밀번호)
 * [PATCH] /app/user/modi-password/:userIdx
 * path variable : userIdx
 * body : originPassword, newPassword, checkPassword
 */

 exports.userModiPW = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;
    
    const originPassword = req.body.originPassword;

    const newPassword = req.body.newPassword;

    const checkPassword = req.body.checkPassword;



    //빈 값 체크
    if (!originPassword){
        return res.send(response(baseResponse.MODI_OLD_PW_EMPTY));
    }
    else if (!newPassword){
        return res.send(response(baseResponse.MODI_NEW_PW_EMPTY));
    }
    else if(!checkPassword){
        return res.send(response(baseResponse.MODI_CHECK_PW_EMPTY));
    }
            
    //길이 체크
    if (originPassword.length < 6 || originPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_PW_LENGTH));
    }  
    else if (newPassword.length < 6 || newPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_NEW_PW_LENGTH));
    }  
    else if (checkPassword.length < 6 || checkPassword.length > 15){
        return res.send(response(baseResponse.REGISTER_CHECK_PW_LENGTH));
    }  


        
    const patchPW = await userService.patchPW(
        userIdx, 
        originPassword,
        newPassword,
        checkPassword,
    );

    return res.send(patchPW)

}




/**
 * API NO. 4-3
 * API Name : 회원정보 수정 (전화번호)
 * [PATCH] /app/user/modi-phone/:userIdx
 * path variable : userIdx
 * body : phoneNumber
 */

 exports.userModiPhone = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const phoneNumber = req.body.phoneNumber;

//빈 값 체크
    if (!phoneNumber){
        return res.send(response(baseResponse.MODI_NEW_PHONE_EMPTY));
    }

//정규식 체크 -하이픈 사용금지
    else if (regExp.test(phoneNumber)) 
        return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN));

//정규식 체크 - 전화번호 형식 오류
    else if (!regExpcheck.test(phoneNumber))
        return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE));
        
    const patchPhone = await userService.patchPhone(phoneNumber, userIdx);
    return res.send(patchPhone);
}



/**
 * API No. 5
 * API Name : 회원탈퇴 
 * [PATCH] /app/user/unregister:userIdx
 * path variable : userIdx
 * body : password
 */

 exports.userUnregister = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    const password = req.body.password;

    if (!password)
            res.send(response(baseResponse.UNREGISTER_PW_EMPTY));

    const patchUnregister = await userService.patchUnregister(password, userIdx);
    return res.send(patchUnregister);

}



/**
 * API No. 20
 * API Name : 아이디 찾기 
 * [GET] /app/user/find-id
 * query string : name, phoneNumber
 */

 exports.userFindID = async function(req, res) {

    const name = req.query.name;
    const phoneNumber = req.query.phoneNumber;

    try{
        //빈 값 체크
        if (!name){
            return res.send(response(baseResponse.REGISTER_NAME_EMPTY));
        }
        if (!phoneNumber){
            return res.send(response(baseResponse.REGISTER_PHONE_EMPTY));
        }

        // 형식 체크 (by 정규표현식)
        if(!regExpName.test(name)){
            return res.send(response(baseResponse.REGISTER_NAME_REGEXP)); 
        }

        if (regExp.test(phoneNumber)){
            return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN));
        }
        if (!regExpcheck.test(phoneNumber)){
            return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE));
        }

        //공백문자만 입력됐는지 체크
        if(name.replace(blank_pattern, '' ) == "" || phoneNumber.replace(blank_pattern, '' ) == "" ){
            return res.send(response(baseResponse.REGISTER_BLANK_ALL));
        }

        //문자열에 공백이 있는 경우
        if(blank_all.test(name) == true || blank_all.test(phoneNumber) == true){
            return res.send(response(baseResponse.REGISTER_BLANK_TEXT)); 
        }

        //이름을 동일하게 갖고 있는 USER가 없는 경우 
        const findIDResponse = await userProvider.retrieveID(name, phoneNumber);
        
        if(findIDResponse.length < 1)
            return res.send(response(baseResponse.USER_NOT_EXIST))
        else{
            return res.send(response(baseResponse.SUCCESS_FIND_ID, {'userId' : findIDResponse[0].ID}))
        }

        //전화번호를 동일하게 갖고 있는 USER가 없는 경우 
        // const findIDResponse = await userProvider.retrieveID(name, phoneNumber);
        
        // if(findIDResponse.length < 1)
        //     return res.send(response(baseResponse.USER_NOT_EXIST))
        // else{
        //     return res.send(response(baseResponse.SUCCESS_FIND_ID, {'userId' : findIDResponse[0].ID}))
        // }
            
  
    } catch (err) {
        logger.error(`App - userFindID Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }

};

/**
 * API No. 21
 * API Name : 비밀번호 찾기
 * [GET] /app/user/find-password
 * query string : name, phoneNumber, ID
 */

 exports.userFindPW = async function(req, res) {

    const name = req.query.name;
    const phoneNumber = req.query.phoneNumber;
    const ID = req.query.ID;

    try{
        //빈 값 체크
        if (!name){
            return res.send(response(baseResponse.REGISTER_NAME_EMPTY));
        }
        if (!ID){
            return res.send(response(baseResponse.REGISTER_ID_EMPTY));
        }
        if (!phoneNumber){
            return res.send(response(baseResponse.REGISTER_PHONE_EMPTY));
        }

        // 형식 체크 (by 정규표현식)
        if(!regExpName.test(name)){
            return res.send(response(baseResponse.REGISTER_NAME_REGEXP)); 
        }

        if (regExp.test(phoneNumber)){
            return res.send(response(baseResponse.REGISTER_PHONE_ERROR_TYPE_HYPHEN));
        }
        if (!regExpcheck.test(phoneNumber)){
            return res.send(response(baseResponse.REGISTER_PHONE_INVALID_VALUE));
        }

        //길이 체크
        if (ID.length < 6 || ID.length > 15 )  
            return res.send(response(baseResponse.REGISTER_ID_LENGTH));

        //공백문자만 입력됐는지 체크
        if(name.replace(blank_pattern, '' ) == "" || ID.replace(blank_pattern, '' ) == ""  || phoneNumber.replace(blank_pattern, '' ) == "" ){
            return res.send(response(baseResponse.REGISTER_BLANK_ALL));
        }

        //문자열에 공백이 있는 경우
        if(blank_all.test(name) == true || blank_all.test(ID) == true || blank_all.test(phoneNumber) == true){
            return res.send(response(baseResponse.REGISTER_BLANK_TEXT)); 
        }

        //이름, 전화번호를 동일하게 갖고 있는 USER가 없는 경우 
        const findPWResponse = await userProvider.checkFindPW(name, ID, phoneNumber);
        
        if(findPWResponse.length < 1)
            return res.send(response(baseResponse.USER_NOT_EXIST))
        else{
            return res.send(response(baseResponse.SUCCESS_FIND_PW))
        }
            
  
    } catch (err) {
        logger.error(`App - userFindPW Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(response(baseResponse.DB_ERROR));
    }

};





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




