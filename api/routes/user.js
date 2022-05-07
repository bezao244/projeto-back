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
<<<<<<< HEAD
=======
    console.log(req.body.userName);
>>>>>>> f8c5bc92da546b87dbe11e1b9e3c16503e91b0e1
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
        res.send('Usuário criado com sucesso!');
    }else{
        res.json('Erro ao salvar!, dados do usuário em branco!');
    }
    
});

router.post('/deletar', (req,res)=>{
    mysqlConnection.execute(
        'DELETE FROM user where idCandidato = ?', [req.body.idCandidato],
        (err, rows, fields)=>{
            if(!err){
                res.json('Usuário deletado com sucesso!');
            }else{
                res.json('Erro ao deletar usuário', err);
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