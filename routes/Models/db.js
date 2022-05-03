const mysql = require("mysql2");

// const  bluebird = require('bluebird');
const dbConfig = require("../config/db.config.js");

let config={
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
}

// create the pool
const pool = mysql.createPool(config);

// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

//now override the 'query' function to simply return the data
let db={
    query: async (sql, params)=>{
        [result,]=await promisePool.query(sql,params);
        return result;
    }
}

module.exports = db;