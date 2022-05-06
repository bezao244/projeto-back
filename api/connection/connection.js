const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'angular'
});
mysqlConnection.connect(err=>{
    if(err){
        console.log('Error ', err);
    }else{
        console.log('DB ok');
    }
});

module.exports = mysqlConnection;