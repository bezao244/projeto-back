const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Empresa {
    constructor(
        idUsuario, nomeEmpresa, cnpj, razaoSocial, dsLogradouro, cep, telResp, telFixo, nomeResp, nmFantasia
    ) {
        this.idUsuario = idUsuario;
        this.nomeEmpresa = nomeEmpresa;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.dsLogradouro = dsLogradouro;
        this.cep = cep;
        this.telResp = telResp;
        this.telFixo = telFixo;
        this.nomeResp = nomeResp;
        this.nmFantasia = nmFantasia;
    }
    save(user) {
        return mysqlConnection.execute(
            'INSERT INTO tbempresa(idUsuario, idEmpresa, nomeEmpresa, cnpj, razaoSocial, dsLogradouro, cep, telResp, telFixo, cdAtiv, nomeResp, nmFantasia) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)', [user.idUsuario, user.idUsuario, user.nomeEmpresa,
            user.cnpj, user.razaoSocial, user.dsLogradouro, user.cep, user.telResp, user.telFixo, user.nomeResp, user.nmFantasia],
            (err, rows, fields) => {
                if (!err) {
                    console.log('Empresa criado com sucesso!');
                } else {
                    console.log('Erro ao criar empresa', err);
                }
            }
        );
    }
}