const res = require('express/lib/response');
const mysqlConnection = require('../connection/connection');

module.exports = class Empresa{
    constructor(
        idUsuario, nomeEmpresa, cnpj, razaoSocial, dsLogradouro, cep, telResp, telFixo,
        cdAtiv, nomeResp, nmFantasia
        ){
        this.idUsuario = idUsuario;
        this.nomeEmpresa = nomeEmpresa;
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.dsLogradouro = dsLogradouro;
        this.cep = cep;
        this.telResp = telResp;
        this.telFixo = telFixo;
        this.cdAtiv = cdAtiv;
        this.nomeResp = nomeResp;
        this.nmFantasia = nmFantasia;
    }
    save(user){
        return mysqlConnection.execute(
            'INSERT INTO tbempresa(idUsuario, nomeEmpresa, cnpj, razaoSocial, dsLogradouro, cep, telResp, telFixo, cdAtiv, nomeResp, nmFantasia) VALUES(?, ?)', [user.idUsuario, user.nomeEmpresa,
                user.cnpj ,user.razaoSocial, user.dsLogradouro, user.cep, user.telResp, user.telFixo, user.cdAtiv, user.nomeResp, user.nmFantasia],
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