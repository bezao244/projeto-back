const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Avaliador {
    constructor(idUsuario, nome, cpf) {
        this.idUsuario = idUsuario,
            this.nome = nome,
            this.cpf = cpf
    }
    save(user) {
        return mysqlConnection.execute(
            'INSERT INTO tbavaliador(idUsuario, idAvaliador, nome, cpf) VALUES(?, ?, ?, ?)', [user.idUsuario, user.idUsuario, user.nome, user.cpf],
            (err, rows, fields) => {
                if (!err) {
                    console.log('Avaliador criado com sucesso!');
                } else {
                    console.log('Erro ao criar avaliador', err);
                }
            }
        );
    }
}