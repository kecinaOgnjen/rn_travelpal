const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');

router.route('/login').post(async function (req, res) {
    let retVal = {idToken: null, message: '', isSuccess: false};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }
        const {username, password} = req.body;

        const {rows} = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows == null || rows.length === 0) {
            retVal.msg = 'Username is not valid';
            return res.status(200).json(retVal);
        }

        const user_db = rows[0];
        if (password !== user_db.password) {
            retVal.msg = 'Password is not valid';
            return res.status(200).json(retVal);
        }

        const token = jwt.sign({
            username: username,
        }, config.serverSecretKey, {expiresIn: '365d'});
        retVal.idToken = token;
        retVal.isSuccess = true;
        res.status(200).json(retVal);
    } catch (err) {
        console.log({loginError: err.message});
        retVal.msg = err.message;
        res.status(200).json(retVal);
    }
});

module.exports = router;
