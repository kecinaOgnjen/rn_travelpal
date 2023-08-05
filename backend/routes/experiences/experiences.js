const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');

router.post('/addExperience', async (req, res) => {
    const retVal = { isSuccess: false };
    try {
        if (!req.body) {
            res.status(400).json(retVal);
            return;
        }

        const { description, rate, location, image } = req.body;

        // Ovdje možete dodati validaciju podataka prije nego što ih unesete u bazu

        const insertQuery = 'INSERT INTO experiences (description, rate, location, image) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await pool.query(insertQuery, [description, rate, location, image]);

        // Očitavamo ID novog iskustva iz rezultata INSERT upita
        const experienceId = result.rows[0].id;

        retVal.isSuccess = true;
        retVal.experienceId = experienceId; // Dodajemo ID iskustva u odgovor
        res.status(200).json(retVal);
    } catch (err) {
        console.log({ addExperienceError: err.message });
        retVal.message = err.message;
        res.status(500).json(retVal);
    }
});

module.exports = router;
