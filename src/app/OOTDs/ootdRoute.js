module.exports = function(app){
    const ootd = require('./ootdController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 8. OOTD 최종 등록하기
    app.post('/app/ootd/last-register', jwtMiddleware, ootd.ootdRegister);

    // 8-2. 추가한 블록 내역 불러오기
    app.get('/app/ootd/default-block', jwtMiddleware, ootd.ootdDefaultBlock);

    // 10. OOTD 수정하기 - 지난 작성 화면 보여주기
    app.get('/app/ootd/modi', jwtMiddleware, ootd.ootdModi);

    // 12. OOTD 완료 페이지 불러오기
    app.get('/app/ootd/complete', jwtMiddleware, ootd.ootdComplete);

};
