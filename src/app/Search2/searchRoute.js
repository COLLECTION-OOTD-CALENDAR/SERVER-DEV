module.exports = function(app){
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. [PWWC] 검색 History 삭제하기(개별,전체) API
    app.patch('/app/search/deletion/:PWWC',jwtMiddleware, search.delHistory);

};


