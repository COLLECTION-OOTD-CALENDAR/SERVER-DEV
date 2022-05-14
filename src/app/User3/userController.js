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
    const registerResponse = await userService.postUser(
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