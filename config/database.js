const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'collection-db.cg8qsbchd9qu.ap-northeast-2.rds.amazonaws.com',
    user: 'master',
    port: '3306',
    password: 'collection1234',
    database: 'collection'
});

module.exports = {
    pool: pool
};