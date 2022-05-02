const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class User{
    constructor(userName, pass, roleId){
        this.userName = userName;
        this.pass = pass;
        this.roleId= roleId;
    }
    static save(user){
        return mysqlConnection.execute(
            'INSERT INTO users() VALUES(?, ?, ?)', [user.userName, user.pass, user.roleId],
            (err, rows, fields)=>{
                if(!err){
                    res.json('Usuário criado com sucesso!');
                }else{

                }
            }
        )
    }
}