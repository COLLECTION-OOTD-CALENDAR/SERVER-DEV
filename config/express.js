const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();
    var bodyParser = require('body-parser'); 

    app.use(compression());
            
    app.use(bodyParser.json({limit:'50mb'})); 
    app.use(bodyParser.urlencoded({extended:true, limit:'50mb'})); 

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
        require('../src/app/User/userRoute')(app);
    require('../src/app/OOTD/ootdRoute')(app);
    require('../src/app/Calendar/calendarRoute')(app);
    require('../src/app/MyLook/mylookRoute')(app);
    require('../src/app/OOTDs/ootdRoute')(app);
    require('../src/app/Search3/searchRoute')(app);
    require('../src/app/Search2/searchRoute')(app);
    require('../src/app/Search/searchRoute')(app);

    //require('../src/app/Search/searchRoute')(app);

    return app;
};