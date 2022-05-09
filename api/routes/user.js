const express = require('express');
const router= express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const User = require('../models/usercs');
const Admin = require('../models/admincs');
const Candidato = require('../models/candidatocs');
const Avaliador = require('../models/avaliadorcs');
const Empresa = require('../models/empresacs');

var usuario = new User();
var admin = new Admin();
var candidato = new Candidato();
var avaliador = new Avaliador();
var empresa = new Empresa();


//LISTAGEM
router.get('/', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM tbusuario LIMIT 5', (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.json(users);
        }else{
            console.log(err);
        }
    });
});

router.get('/buscarTipoConta', (req,res)=>{
    return mysqlConnection.query('SELECT tipoConta FROM tbcontas', (err, rows, fields)=>{
        if(!err){
            let contas = rows;
            res.json(contas);
        }else{
            console.log(err);
        }
    });
});

router.get('/buscarOficios', (req,res)=>{
    return mysqlConnection.query('SELECT oficio FROM tboficio', (err, rows, fields)=>{
        if(!err){
            let oficios = rows;
            res.json(oficios);
        }else{
            console.log(err);
        }
    });
});


router.post('/listarPorEmpresa', (req, res) => {
    mysqlConnection.query('SELECT * FROM user where idEmpresa = ?',[req.body.idEmpresa], (err, rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(false);
        }
    });
});
router.post('/buscarNomeEmpresa', (req, res) => {
    mysqlConnection.query('SELECT * FROM user where idUsuario = ?',[req.body.idUsuario], (err, rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(false);
        }
    });
});

router.post('/listarPorAvaliador', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbcandidato where idAvaliador = ?',[req.body.idAvaliador], (err, rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(false);
        }
    });
});


//FILTROS
router.post('/filtrarAvaliador', (req,res) => {

    let modal ={
        idAvaliador: req.body.idAvaliador,
        idOficio: req.body.idOficio,
        nome: req.body.nome,
        dataInclusao: req.body.dataInclusao
    }

    let query = `SELECT * FROM tbcandidato where idAvaliador = ${modal.idAvaliador}`;

    if(modal.idOficio != 0){
    query += `AND idOficio =  ${modal.idOficio}`;        
    }
    if(modal.nome != 0){
        query += `AND nome =  ${modal.nome}`;        
    }
    if(modal.dataInclusao != 0){
        query += `AND datainclusao =  ${modal.dataInclusao}`;        
    }

    mysqlConnection.execute(query, (err, rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(false);
        }
    });

});

router.get('/filtrarPorNota', (req,res)=>{
    mysqlConnection.query('SELECT * FROM tbcandidato where notafinal is null', (err, rows)=>{
        if(!err){
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

router.post('/filtrarPorNome', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM tbusuario where email = ?', [req.body.email], (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

router.get('/filtrarPorTipo', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM tbusuario where tipoperfil = ?', [req.body.tipoPerfil], (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

//ADICIONAR
router.post('/adicionarOficioCandidato', (req, res)=>{
    mysqlConnection.query('select idOficio from oficio where descricao = ?', [req.body.descricao],
     (err,rows)=>{
        let idOficio = rows[0].idOficio;
        let idCandidato = req.body.idCandidato;
        usuario.adicionarOficio(idOficio, idCandidato);
        res.send('Oficio adicionado com sucesso!')  
     });
});

router.get('/adicionarNotaCandidato', (req,res)=>{
    if(req.body.nota > 100){
        res.json('Nota muito alta');
    }else{
        mysqlConnection.query('update tbcandidato set notafinal = ? where idCandidato = ?',[req.body.notafinal, req.body.idCandidato], 
    (err, rows)=>{
       if(!err){
           res.json('Nota cadastrada com sucesso!');
       }else{
           console.log(err);
       }
   });
    }
});


//BÁSICOS
router.post('/create', (req,res)=>{
    let user = new User(req.body.email, req.body.senha, req.body.tipoPerfil);

    console.log(user);
    if(user.email != '' && user.senha != '' && user.tipoPerfil != ''){
        user.save(user);
        mysqlConnection.query('SELECT idUsuario FROM tbusuario where email = ?', [user.email], 
        (err, rows)=>{
            if(!err){
                res.send(rows);
            }else{
                 res.send(false)
            }
        } );
    }else{
        res.send(false);
    }
    
});

router.post('/createAdmin', (req, res)=>{
    var admin = new Admin(req.body.idUsuario, req.body.nome);
    admin.save(admin);
    res.send(true);
});

router.post('/createAvaliador', (req, res)=>{
    var avaliador = new Avaliador(req.body.idUsuario, req.body.nome, req.body.cpf);
    avaliador.save(avaliador);
    res.send(true);
});

router.post('/deletar', (req,res)=>{
    mysqlConnection.execute(
        'DELETE FROM tbusuario where idUsuario = ?', [req.body.idUsuario],
        (err, rows, fields)=>{
            if(!err){
               res.send(true);
               console.log('Deletado');
            }else{
                res.send(false);
                console.log(err);
            }
        }
    )
});



router.post('/singin', (req,res)=>{
    const { email, senha } = req.body;
    mysqlConnection.execute('SELECT * FROM tbusuario where email = ? and senha = ?', [email, senha], 
    (err, rows, fields)=>{
        if(!err){
            if(rows.length > 0){
                var modal = {
                    idUsuario: rows[0].idUsuario,
                    tipoPerfil: rows[0].tipoPerfil,
                    ok: true
                }
                res.send(modal);
               console.log('Usuário encontrado!');
            }else{
                console.log('Incorretos!');
                var modal = {
                    ok: false
                }
                res.send(modal);
            }
        }else{
            console.log(err);
        }
    });
});

router.post('/test', verifyToken,  (req, res)=>{
    res.json('Certo ');
});

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).json('Não autorizado');
    }
    const token = req.headers.authorization.substr(7);
    if(token != ''){
        const content = jwt.verify(token, 'stil');
        req.data = content;
        next();
    }else{
        res.status(401).json('Token vazio!');
    }
}


module.exports = router;