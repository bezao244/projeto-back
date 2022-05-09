const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Admin{
    constructor(idUsuario, nome){
        this.idUsuario = idUsuario;
        this.nome = nome;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO tbadmin(idUsuario, nome) VALUES(?, ?)', [user.idUsuario, user.nome],
            (err, rows, fields)=>{
                if(!err){
                    console.log('Admin criado com sucesso!');
                }else{
                    console.log('Erro ao criar admin', err);
                }
            }
        );
    }
}