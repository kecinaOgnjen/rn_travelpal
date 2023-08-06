const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');
const base64js = require('base64-js');
const fs = require("fs");

router.post('/addExperience', async (req, res) => {

    const { description, rate, location, image } = req.body;

    // Konvertuj sliku u base64
    const imageBase64 = req.body.image;

    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Spremi u bazu
    const insertResult = await pool.query(
        `INSERT INTO experiences (description, rate, location, image)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
        [description, rate, location, imageBuffer]
    );

    res.json({
        success: true,
        experienceId: insertResult.rows[0].id
    })

});

router.get('/getExperience', async (req, res) => {
    let retVal = {isSuccess: false};

    const result = await pool.query('SELECT * FROM experiences');

    const experiences = result.rows.map(row => {
        const imageBase64 = row.image.toString('base64');
        return {
            id: row.id,
            description: row.description,
            rate: row.rate,
            location: row.location,
            image:  imageBase64  // već base64
        };
    });

    res.json({
        isSuccess: true,
        experiences
    });
});

module.exports = router;
