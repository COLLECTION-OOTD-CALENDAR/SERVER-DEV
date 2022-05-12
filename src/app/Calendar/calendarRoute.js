module.exports = function(app){
    const calendar = require('./calendarController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 6. Monthly 달력 OOTD 부르기
    app.get('/app/calendar/monthly', jwtMiddleware, calendar.calendarMonthly);

    // 7. Weekly 달력 OOTD 부르기
    app.get('/app/calendar/weekly', jwtMiddleware, calendar.calendarWeekly); 

};
