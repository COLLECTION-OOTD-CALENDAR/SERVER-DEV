module.exports = function(app){
    const mylook = require('./mylookController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 13. MY LOOK 메인페이지 불러오기
    app.get('/app/mylook/mainpage/:lookpoint', jwtMiddleware , mylook.mylookMain);

    // 14. MY LOOK 상세페이지 
    app.get('/app/mylook/detail/:lookpoint', jwtMiddleware , mylook.mylookDetail); 


};


