const CryptoJS = require("crypto-js")
const axios = require("axios")
const secret_config = require('./secret');
const baseResponseStatus = require("./baseResponseStatus");
const { errResponse } = require("./response");

const send_message = async function (req, res) {
    try {
        const phoneNumber = req.body.phoneNumber;
        // '-'를 제외하고 넘어오는지 확인하여 처리
        // const phoneNumber = tel.split("-").join("");

        // max - min + min (min보다 크거나 같으며 max보다 작다)
        const verificationCode = Math.floor(Math.random() * (999999-100000)) + 100000;
        
        // timestamp를 위한 날짜 String
        const date = Date.now().toString();

        // 환경 변수
        const sens_access_key = secret_config.NCP_SENS_ACCESS;
        const sens_secret_key = secret_config.NCP_SENS_SECRET;
        const sens_service_id = secret_config.NCP_SENS_ID;
        const sens_call_number = secret_config.NCP_SENS_NUMBER;

        // URL 관련 변수 선언
        const method = 'POST';
        const space = " ";
        const newLine = "\n";
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
        const url2 = `/sms/v2/services/${sens_service_id}/messages`;

        // signature 작성 : crypto-js 모듈을 이용한 암호화
        console.log(1);
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
        console.log(2);

        hmac.update(method);
        hmac.update(space);
        hmac.update(url2);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        console.log(sens_access_key);
        hmac.update(sens_access_key);
        const hash = hmac.finalize();
        console.log(3);
        const signature = hash.toString(CryptoJS.enc.Base64);
        console.log(4);

        // sens 서버로 요청 전송
        const smsRes = await axios({
            method : method,
            url : url,
            headers : {
                "Content-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": sens_access_key,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
            },
            data : {
                type : "SMS",
                countryCode : "82",
                from : sens_call_number,
                content : `[COLLECTION] 인증번호 [${verificationCode}]를 입력해주세요.`,
                messages : [{
                    to : `${phoneNumber}`
                }],

            },
        });
        console.log("response", smsRes.data);
        return res.send(response(baseResponseStatus.SUCCESS_SEND_SMS, {'verificationCode' : verificationCode}));
    } catch (err) {
        console.log(err);
        return res.send(errResponse(baseResponseStatus.SERVER_ERROR));
    }

};


module.exports = {
    send_message
};