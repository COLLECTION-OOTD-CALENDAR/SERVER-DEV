const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// 0. 회원가입 - (ID 중복 확인, 닉네임 중복 확인, 비밀번호 암호화)
exports.postRegister = async function (name, nickname, ID, password, birthday, gender, phoneNumber) {
    try {
        //ID 중복 확인
        const IDRows = await userProvider.checkID(ID);
        if (IDRows.length > 0)
            return errResponse(baseResponse.REGISTER_ID_REDUNDANT);

        // 닉네임 중복 확인 
        const nicknameRows = await userProvider.checkNickname(nickname);
            if (nicknameRows.length > 0)
                return errResponse(baseResponse.REGISTER_NICKNAME_REDUNDANT);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [name, nickname, ID, hashedPassword, birthday, gender, phoneNumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const userResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        connection.release();

        return response(baseResponse.SUCCESS_REGISTER,
            {'name': name, 'nickname' : nickname ,'ID' : ID, 'password' : hashedPassword, 'birthday' : birthday, 'gender' : gender, 'phoneNumber' : phoneNumber});

    } catch (err) {
        logger.error(`App - register Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 3. 로그인 - (ID 여부 확인, 비밀번호 확인, 토큰 생성 Service)
exports.postLogIn = async function (ID, password) {
    try {
        // ID 여부 확인
        const IDRows = await userProvider.checkID(ID);
         if (IDRows.length < 1) {
            return errResponse(baseResponse.LOGIN_ID_WRONG);
         }
        const selectID = IDRows[0].ID

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        
        const passwordRows = await userProvider.checkPassword(selectID);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.LOGIN_PW_WRONG);
        }

        // 계정 상태 확인 

        const userInfoRows = await userProvider.checkAccount(ID);

        if (userInfoRows[0].status === "inactive") {
            return errResponse(baseResponse.LOGIN_UNREGISTER_USER); //탈퇴한 USER
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].ID,
                userIdx : userInfoRows[0].userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS_LOGIN, {'userId': userInfoRows[0].ID, 'nickname': userInfoRows[0].nickname, 'name': userInfoRows[0].name, 'jwt': token});

    } catch (err) {
        logger.error(`App - postLogIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//4-1. 회원정보 수정 (닉네임) - (닉네임 변경) 
exports.patchNickname = async function (nickname, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateNicknameInfo(connection, nickname, userIdx)
        connection.release();
        return response(baseResponse.SUCCESS_USERS_MODI,{'nickname': nickname});

    } catch (err) {
        logger.error(`App - editNickname Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//4-2 . 회원정보 수정(비밀번호) - (비밀번호 HASHED 처리 -> 변경)
exports.patchPW = async function (userIdx,originPassword,newPassword) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(originPassword)
            .digest("hex");

        const passwordRows = await userProvider.checkPasswordUserIdx(userIdx);

        if(passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.LOGIN_PW_WRONG);
        }

        const hashedNewPassword = await crypto
            .createHash("sha512")
            .update(newPassword)
            .digest("hex");

        const updatePWResultParams = [hashedNewPassword, userIdx]

        const editUserResult = await userDao.updatePWInfo(connection, updatePWResultParams)
        connection.release();

        return response(baseResponse.SUCCESS_USERS_MODI,{'password': hashedNewPassword});

    } catch (err) {
        logger.error(`App - editPW Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//4-3. 회원정보 수정(전화번호) - (전화번호 변경)
exports.patchPhone = async function (phoneNumber, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        

        const updatePhoneResultParams = [phoneNumber, userIdx]

        const editUserResult = await userDao.updatePhoneInfo(connection, updatePhoneResultParams)
        connection.release();

        return response(baseResponse.SUCCESS_USERS_MODI,{'phoneNumber': phoneNumber});

    } catch (err) {
        logger.error(`App - editPhone Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//5. 회원탈퇴 - (비밀번호 확인 이후 탈퇴)
exports.patchUnregister = async function (password, userIdx) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const passwordRows = await userProvider.checkPasswordUserIdx(userIdx); 

        if(passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.UNREGISTER_PW_WRONG);
        }
 
        const unregisterUser = await userDao.updateUnregisterUser(connection, userIdx)
        connection.release();

        return response(baseResponse.SUCCESS_UNREGISTER);

    } catch (err) {
        logger.error(`App - unregister Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}



//22. 비밀번호 재설정 API
 exports.updatePw = async function (userIdx,newPassword) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        

        const hashedNewPassword = await crypto
            .createHash("sha512")
            .update(newPassword)
            .digest("hex");

        const updatePWParams = [hashedNewPassword, userIdx]

        const updatePwdResult = await userDao.updatePwdReset(connection, updatePWParams)
        connection.release();

        return response(baseResponse.SUCCESS_RESET_PW);

    } catch (err) {
        logger.error(`App - updatePw Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


