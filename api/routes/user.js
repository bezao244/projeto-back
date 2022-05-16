const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');
const User = require('../models/usercs');
const Admin = require('../models/admincs');

var usuario = new User();

router.get('/', (req, res) => {
    return mysqlConnection.query('SELECT * FROM tbusuario', (err, rows, fields) => {
        if (!err) {
            let users = rows;
            res.json(users);
        } else {
            console.log(err);
        }
    });
});

router.get('/buscarTipoConta', (req, res) => {
    return mysqlConnection.query('SELECT tipoConta FROM tbcontas', (err, rows, fields) => {
        if (!err) {
            let contas = rows;
            res.json(contas);
        } else {
            console.log(err);
        }
    });
});

router.post('/buscarDadosUsuario', (req, res) => {
    console.log(req.body)
    return mysqlConnection.query('SELECT * FROM tbusuario WHERE idUsuario = ?', [req.body.idUsuario], (err, rows, fields) => {
        if (!err) {
            let users = rows;
            res.send(users);
        } else {
            console.log(err);
        }
    });
});

router.post('/filtrar', (req, res) => {
    let nome = req.body.parametro + '%';
    mysqlConnection.query('SELECT * FROM tbusuario WHERE idUsuario LIKE ? or email LIKE ?', [nome, nome], (err, rows) => {
        if (!err) {

            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.get('/filtrarPorTipo', (req, res) => {
    return mysqlConnection.query('SELECT * FROM tbusuario where tipoperfil = ?', [req.body.tipoPerfil], (err, rows, fields) => {
        if (!err) {
            let users = rows;
            res.send(users);
        } else {
            console.log(err);
        }
    });
});

//ADICIONAR
router.post('/adicionarOficioCandidato', (req, res) => {
    mysqlConnection.query('select idOficio from oficio where descricao = ?', [req.body.descricao],
        (err, rows) => {
            let idOficio = rows[0].idOficio;
            let idCandidato = req.body.idCandidato;
            usuario.adicionarOficio(idOficio, idCandidato);
            res.send('Oficio adicionado com sucesso!')
        });
});

//BÁSICOS
router.post('/create', (req, res) => {
    let user = new User(req.body.email, req.body.senha, req.body.tipoPerfil);

    console.log(user);
    if (user.email != '' && user.senha != '' && user.tipoPerfil != '') {
        user.save(user);
        mysqlConnection.query('SELECT idUsuario FROM tbusuario where email = ?', [user.email],
            (err, rows) => {
                if (!err) {
                    res.send(rows);
                } else {
                    res.send(false)
                }
            });
    } else {
        res.send(false);
    }

});

router.post('/createAdmin', (req, res) => {
    var admin = new Admin(req.body.idUsuario, req.body.nome);
    admin.save(admin);
    res.send(true);
});





router.post('/deletar', (req, res) => {
    mysqlConnection.execute(
        'DELETE FROM tbusuario where idUsuario = ?', [req.body.idUsuario],
        (err, rows, fields) => {
            if (!err) {
                res.send(true);
                console.log('Deletado');
            } else {
                res.send(false);
                console.log(err);
            }
        }
    )
});
router.post('/singin', (req, res) => {
    const { email, senha } = req.body;
    mysqlConnection.execute('SELECT * FROM tbusuario where email = ? and senha = ?', [email, senha],
        (err, rows, fields) => {
            if (!err) {
                if (rows.length > 0) {
                    var modal = {
                        idUsuario: rows[0].idUsuario,
                        tipoPerfil: rows[0].tipoPerfil,
                        ok: true
                    }
                    res.send(modal);
                    console.log('Usuário encontrado!');
                } else {
                    console.log('Incorretos!');
                    var modal = {
                        ok: false
                    }
                    res.send(modal);
                }
            } else {
                console.log(err);
            }
        });
});

router.post('/test', verifyToken, (req, res) => {
    res.json('Certo ');
});

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json('Não autorizado');
    }
    const token = req.headers.authorization.substr(7);
    if (token != '') {
        const content = jwt.verify(token, 'stil');
        req.data = content;
        next();
    } else {
        res.status(401).json('Token vazio!');
    }
}
module.exports = router;