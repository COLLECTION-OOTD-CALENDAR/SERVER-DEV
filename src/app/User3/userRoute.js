module.exports = function(app){
    const user = require('./userController');

    const verify = require('../../../config/sms');

    // 0. 회원가입
    app.post('/app/user/register', user.userRegister);

    // ?. 인증번호 전송하기
    app.post('/app/user/send-verification', verify.send_message);

};


