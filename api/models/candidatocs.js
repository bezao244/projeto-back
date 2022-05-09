const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Candidato{
    constructor(nome, cpf, idAvaliador, oficio){
        this.nome = nome;
        this.cpf = cpf;
        this.idAvaliador = idAvaliador;
        this.oficio = oficio;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO tbcandidato(nome, cpf, datainclusao, idavaliador, oficio) VALUES(?, ?, CURDDATE(),?, ?)', [user.nome, user.cpf, user.idAvaliador, user.oficio],
            (err, rows, fields)=>{
                if(!err){
                    console.log('Candidato criado com sucesso!');
                }else{
                    console.log('Erro ao criar candidato', err);
                }
            }
        );
    }
}