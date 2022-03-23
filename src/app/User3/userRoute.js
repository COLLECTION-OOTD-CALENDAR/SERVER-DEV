module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 회원가입API
    app.post('/app/user/register', user.postUsers);

};


