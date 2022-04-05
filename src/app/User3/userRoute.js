module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    const verify = require('../../../config/sms');

    // 1. 회원가입API
    app.post('/app/user/register', user.postUsers);

    // 2. 인증번호 전송하기 API
    app.post('/app/user/send-verification', verify.send_message);

};


