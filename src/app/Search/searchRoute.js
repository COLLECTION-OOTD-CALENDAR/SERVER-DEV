module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 15. [PWWC] 검색 초기화면 보여주기 API
    app.get('/app/search/mainpage/:PWWC', jwtMiddleware, search.searchMain);

    // 16. [PWWC] 검색 History 삭제하기(개별,전체) API
    app.patch('/app/search/deletion/:PWWC',jwtMiddleware, search.searchDeletion);

    // 17. 매칭페이지 검색결과 보여주기 + 선택한 날짜의 결과 조회하기 API
    app.get('/app/search/:PWWC',jwtMiddleware, search.searchPWWC); 

    // 19. [PWWC] 매칭 페이지 검색 키워드 제안
    app.get('/app/search/suggestion/:PWWC', jwtMiddleware, search.searchSuggestKeyword);


};
