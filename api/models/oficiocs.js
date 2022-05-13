const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Admin{
    constructor(oficio){
        this.oficio = oficio;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO tboficio(oficio) VALUES(?)', [user.oficio],
            (err, rows, fields)=>{
                if(!err){
                    console.log('Oficio criado com sucesso!');
                }else{
                    console.log('Erro ao criar oficio', err);
                }
            }
        );
    }
    delete(user){
        return mysqlConnection.execute(
            'DELETE FROM tboficio where idOficio = ?', [user],
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