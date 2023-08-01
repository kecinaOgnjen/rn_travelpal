const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');

router.route('/getUserInfo').post(async function (req, res) {
    let retVal = {isSuccess: false};

    try {
        const {id} = req.body; // Pretpostavljamo da šaljete ID kao parametar u body-ju, možete ga i poslati kao query parametar ili path parametar

        if (!id) {
            // Ako nije dostavljen ID, vratite grešku
            retVal.message = 'ID nije dostavljen.';
            return res.status(400).json(retVal);
        }

        const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (rows && rows.length > 0) {
            const userInfo = rows[0];

            // Vraćamo informacije o korisniku
            retVal.isSuccess = true;
            retVal.userInfo = {
                username: userInfo.username,
                full_name: userInfo.full_name,
                password: userInfo.password,
                email: userInfo.email,
                phone: userInfo.phone_number,
            };
            return res.status(200).json(retVal);
        } else {
            // Ako korisnik sa datim ID-om ne postoji, vraćamo odgovarajuću poruku
            retVal.message = 'Korisnik sa datim ID-om nije pronađen.';
            return res.status(404).json(retVal);
        }
    } catch (err) {
        console.log({getUserInfoError: err.message});
        retVal.message = err.message;
        res.status(500).json(retVal);
    }
})

module.exports = router;
