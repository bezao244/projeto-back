const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class User{
    constructor(userName, pass, roleId){
        this.userName = userName;
        this.pass = pass;
        this.roleId= roleId;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO user VALUES(?, ?, ?)', [user.userName, user.pass, user.roleId],
            (err, rows, fields)=>{
                if(!err){
                    console.log('Usuário criado com sucesso!');
                }else{
                    console.log('Erro ao criar usuário', err);
                }
            }
        )
    }

    delete(user){
        return mysqlConnection.execute(
            'DELETE FROM user where username = ?', [user.userName],
            (err, rows, fields)=>{
                if(!err){
                    console.log('Usuário deletado com sucesso!');
                }else{
                    console.log('Erro ao deletar usuário', err);
                }
            }
        )
    }
}