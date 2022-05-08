const express = require('express');
const router= express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const User = require('../models/usercs');

var usuario = new User();

router.get('/', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM user', (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.json(users);
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

router.post('/listarPorAvaliador', (req, res) => {
    mysqlConnection.query('SELECT * FROM user where idAvaliador = ?',[req.body.idAvaliador], (err, rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(false);
        }
    });
});

router.post('/filtrarAvaliador', (req,res) => {

    let modal ={
        idAvaliador: req.body.idAvaliador,
        idOficio: req.body.idOficio,
        nome: req.body.nome,
        dataInclusao: req.body.dataInclusao
    }

    let query = `SELECT * FROM user where idAvaliador = ${modal.idAvaliador}`;

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
    mysqlConnection.query('SELECT * FROM user where nota is null', (err, rows)=>{
        if(!err){
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

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
        mysqlConnection.query('update user set nota = ? where idCandidato = ?',[req.body.nota, req.body.idCandidato], 
    (err, rows)=>{
       if(!err){
           res.json('Nota cadastrada com sucesso!');
       }else{
           console.log(err);
       }
   });
    }
});

router.post('/filtrarPorNome', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM user where username = ?', [req.body.userName], (err, rows, fields)=>{
        if(!err){
           
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

router.get('/filtrarPorTipo', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM user where roleid = ?', [req.body.roleId], (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.send(users);
        }else{
            console.log(err);
        }
    });
});

router.post('/create', (req,res)=>{
    let user = new User(req.body.userName, req.body.pass, req.body.roleId);

    console.log(user);
    if(user.userName != '' && user.pass != '' && user.roleId != ''){
        user.save(user);
        res.send(true);
    }else{
        res.json(false);
    }
    
});

router.post('/deletar', (req,res)=>{
    console.log('bateu aqui');
    mysqlConnection.execute(
        'DELETE FROM user where idCandidato = ?', [req.body.idCandidato],
        (err, rows, fields)=>{
            if(!err){
                var ok = 'Deletado com sucesso!';
               res.send(ok);
               console.log('Deletado')
            }else{
                res.send('Erro ao deletar usuário', err);
            }
        }
    )
});



router.post('/singin', (req,res)=>{
    const { userName, pass } = req.body;
    mysqlConnection.execute('SELECT * FROM user where username = ? and pass = ?', [userName, pass], 
    (err, rows, fields)=>{
        if(!err){
            if(rows.length > 0){
                res.send(rows);
               console.log('Usuário encontrado!');
            }else{
                console.log('Incorretos!');
                res.send(false);
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