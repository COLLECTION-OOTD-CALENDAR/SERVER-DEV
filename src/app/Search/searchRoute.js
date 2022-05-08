module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 API
    app.get('/app/search/:PWWC',jwtMiddleware, search.searchPWWC); 

};
