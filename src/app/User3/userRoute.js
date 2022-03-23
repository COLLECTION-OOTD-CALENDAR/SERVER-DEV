module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 회원가입API
    app.post('/app/user/register', user.postUsers);

    // 2. 중복 ID 확인 
    app.get('/app/user/duplicate-id',user.getDuplicateID);

    // 3. 닉네임 확인
    app.get('/app/user/check-nickname',user.getNickname);

    //4. 로그인 
    app.post('/app/user/login',user.postLogin);

    //5. 회원정보 수정 (닉네임)
    app.patch('/app/user/modi-nickname', jwtMiddleware, user.patchModiNickname);

    //6. 회원정보 수정 (비밀번호)
    app.patch('/app/user/modi-password',jwtMiddleware, user.patchModiPW);

    //7. 회원정보 수정 (전화번호)
    app.patch('/app/user/modi-phone',jwtMiddleware, user.patchModiPhone);

    //8. 회원탈퇴
    app.patch('/app/user/unregister',jwtMiddleware, user.deleteUnregister);

    //9.자동로그인
    app.get('/app/user/autologin',jwtMiddleware, user.autoLogin);

};


