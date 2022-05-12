const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리 
// 회원가입 API
exports.postUser = async function (name, nickname, ID, password, birthday, gender, phoneNumber) {
    try {
        // ID 중복 확인
        // UserProvider에서 해당 ID와 같은 User 목록을 받아서 IDRows에 저장한 후, 배열의 길이를 검사한다.
        // -> 길이가 0 이상이면 이미 해당 ID를 갖고 있는 User가 조회된다는 의미
        const IDRows = await userProvider.checkID(ID);
        if (IDRows.length > 0)
            return errResponse(baseResponse.REGISTER_ID_REDUNDANT);

        // 닉네임 중복 확인 
        // ID 중복 확인 방법과 동일하게 진행 
        const nicknameRows = await userProvider.checkNickname(nickname);
            if (nicknameRows.length > 0)
                return errResponse(baseResponse.REGISTER_NICKNAME_REDUNDANT);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
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
