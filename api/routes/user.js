const express = require('express');
const router= express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const User = require('../models/usercs');

router.get('/', (req,res)=>{
    mysqlConnection.query('SELECT * FROM user', (err, rows, fields)=>{
        if(!err){
            let users = rows;
            res.json(users);
        }else{
            console.log(err);
        }
    });
});

router.get('/create', (req,res)=>{
    let user = new User( req.body.userName, req.body.pass, req.body.roleId);
    if(user.userName != '' && user.pass != '' && user.roleId != ''){
        user.save(user);
    }else{
        res.json('Erro ao salvar!, dados do usuário em branco!');
    }
    
});

router.get('/deletar', (req,res)=>{
    mysqlConnection.execute(
        'DELETE FROM user where username = ?', [req.body.userName],
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
    mysqlConnection.query('SELECT * FROM user where username = ? and pass = ?', [userName, pass], 
    (err, rows, fields)=>{
        if(!err){
            if(rows.length > 0){
                //encriptando a senha 
               let data = JSON.stringify(rows[0]);
               const token = jwt.sign(data, 'stil');
               res.json('Usuário encontrado!');
            }else{
                res.json('Incorretos!');
            }
            console.log(rows);
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