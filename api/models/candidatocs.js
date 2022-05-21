const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Candidato {
    constructor(nome, cpf, idAvaliador, idEmpresa, idOficio) {
        this.nome = nome;
        this.cpf = cpf;
        this.idAvaliador = idAvaliador;
        this.idEmpresa = idEmpresa;
        this.idOficio = idOficio;
    }
    save(user) {
        return mysqlConnection.execute(
            'INSERT INTO tbcandidato(nome, cpf, datainclusao, idavaliador,idempresa, idoficio) VALUES(?, ?, CURRENT_DATE(),?, ?, ?)', [user.nome, user.cpf, user.idAvaliador, user.idEmpresa, user.idOficio],
            (err, rows, fields) => {
                if (!err) {
                    console.log('Candidato criado com sucesso!');
                } else {
                    console.log('Erro ao criar candidato', err);
                }
            }
        );
    }
    delete(user) {
        return mysqlConnection.execute(
            'DELETE FROM tbcandidato where idCandidato = ?', [user],
            (err, rows) => {
                if (!err) {
                    console.log('Candidato deletado com sucesso!');
                } else {
                    console.log('Erro ao deletar candidato', err);
                }
            }
        )
    }
}