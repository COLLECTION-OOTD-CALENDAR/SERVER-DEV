module.exports = function(app){
    const calendar = require('./calendarController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. Monthly 달력 OOTD 부르기 API
    app.get('/app/calendar/monthly', jwtMiddleware, calendar.getMonth);

    // 2. Weekly 달력 OOTD 부르기 API
    app.get('/app/calendar/weekly', jwtMiddleware, calendar.getWeek); 

};
