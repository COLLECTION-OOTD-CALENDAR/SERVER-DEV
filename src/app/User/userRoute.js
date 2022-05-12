module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const verify = require('../../../config/sms');

    // 0. 회원가입
    app.post('/app/user/register', user.userRegister);

    // 1. 중복 ID 확인 
    app.get('/app/user/duplicate-id',user.userDuplicateID);

    // 2. 닉네임 확인
    app.get('/app/user/check-nickname',user.userNickname);

    //3. 로그인 
    app.post('/app/user/login',user.userLogin);

    //3-1.자동로그인
    app.get('/app/user/autologin',jwtMiddleware, user.userAutoLogin);

    //4-1. 회원정보 수정 (닉네임)
    app.patch('/app/user/modi-nickname', jwtMiddleware, user.userModiNickname);

    //4-2. 회원정보 수정 (비밀번호)
    app.patch('/app/user/modi-password',jwtMiddleware, user.userModiPW);

    //4-3. 회원정보 수정 (전화번호)
    app.patch('/app/user/modi-phone',jwtMiddleware, user.userModiPhone);

    //5. 회원탈퇴
    app.patch('/app/user/unregister',jwtMiddleware, user.userUnregister);

    //20.아이디찾기
    app.get('/app/user/find-id',user.userFindID);

    //21.비밀번호찾기
    app.get('/app/user/find-password',user.userFindPW);

    //22. 비밀번호 재설정 (비밀번호 찾기 후 호출되는 API)
    app.patch('/app/user/reset-password', jwtMiddleware, user.patchPassword);

    // ?. 인증번호 전송하기
    app.post('/app/user/send-verification', verify.send_message);

};


