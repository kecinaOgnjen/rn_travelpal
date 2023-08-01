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
    let retVal = {idToken: null, isSuccess: false};
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }
        const {username, password} = req.body;

        const {rows} = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows == null || rows.length === 0) {
            retVal.message = 'Username is not valid';
            return res.status(200).json(retVal);
        }

        const user_db = rows[0];
        if (password !== user_db.password) {
            retVal.message = 'Password is not valid';
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
        retVal.message = err.message;
        res.status(200).json(retVal);
    }
});

router.route('/register').post(async function (req, res) {
    let retVal = {isSuccess: false };
    try {
        if (!req.body) {
            res.status(200).json(retVal);
            return;
        }
        const { fullName, username, password, email, phoneNumber } = req.body;

        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows && rows.length > 0) {
            retVal.message = 'Korisničko ime je već zauzeto.';
            return res.status(200).json(retVal);
        }

        const insertQuery = 'INSERT INTO users (full_name, username, password, email, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const result = await pool.query(insertQuery, [fullName, username, password, email, phoneNumber]);

        // Očitavamo ID novog korisnika iz rezultata INSERT upita
        const userId = result.rows[0].id;

        retVal.isSuccess = true;
        retVal.userId = userId; // Dodajemo ID korisnika u odgovor
        res.status(200).json(retVal);
    } catch (err) {
        console.log({ registerError: err.message });
        retVal.message = err.message;
        res.status(200).json(retVal);
    }
});



module.exports = router;
