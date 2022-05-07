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



/**
 * API No. 22
 * API Name : 비밀번호 재설정 API
 **/

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