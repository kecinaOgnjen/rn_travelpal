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

// POST /addExperience

router.post('/addExperience', async (req, res) => {
    console.log(req.body);

    const imageBase64 = req.body.image;
    const { description, location, rate } = req.body;

    if(!imageBase64 || !imageBase64.startsWith('data:image')) {
        return res.status(400).json({error: 'Nevalidna slika'});
    }

    // Define the path to save the image
    const path = './uploads/image-' + Date.now() + '.jpg';

    // Create buffer from base64 string
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(base64Data, 'base64');

    // Write to file
    fs.writeFile(path, dataBuffer, function (error) {
        if (error) {
            res.status(500).send({ message: 'Error saving image!' });
        } else {
            res.status(200).send({ message: 'Image saved successfully', path: path });
        }
    });



    res.json({
        success: true,
        id: 1
    })

});



router.post('/addExperience-old', async (req, res) => {
    console.log(req.body);

    const imageBase64 = req.body.image;
    const { description, location, rate } = req.body;

    if(!imageBase64 || !imageBase64.startsWith('data:image')) {
        return res.status(400).json({error: 'Nevalidna slika'});
    }


    const imageBuffer = Buffer.from(imageBase64, 'base64');

    const insertQuery = `
    INSERT INTO experiences (description, location, rate, image)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

    const values = [
        description,
        location,
        rate,
        imageBuffer // base64 slika
    ];

    const result = await pool.query(insertQuery, values);

    res.json({
        success: true,
        id: result.rows[0].id
    })

});


router.get('/getExperience', async (req, res) => {
    const result = await pool.query('SELECT * FROM experiences');

    const experiences = result.rows.map(row => {
        const imageBase64 = row.image.toString('base64'); // Convert image buffer to base64
        return {
            id: row.id,
            description: row.description,
            rate: row.rate,
            location: row.location,
            image: imageBase64
        };
    });

    res.json({
        isSuccess: true,
        experiences
    });
});

module.exports = router;
