const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class User{
    constructor(email, senha, tipoPerfil){
        this.email = email;
        this.senha = senha;
        this.tipoPerfil= tipoPerfil;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO tbusuario(email, senha, tipoperfil, datainclusao) VALUES(?, ?, ?, CURDATE())', [user.email, user.senha, user.tipoPerfil],
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
            'DELETE FROM tbusuario idUsuario = ?', [user.idUsuario],
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