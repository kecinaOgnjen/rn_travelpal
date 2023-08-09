const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');
const nodemailer = require('nodemailer');


router.route('/getDestinations').get(async function (req, res) {
    let retVal = { isSuccess: false };

    try {
        const { rows } = await pool.query('SELECT * FROM destinations');

        if (rows && rows.length > 0) {
            retVal.isSuccess = true;
            retVal.destinations = rows;
            return res.status(200).json(retVal);
        } else {
            retVal.message = 'Nema dostupnih destinacija.';
            return res.status(404).json(retVal);
        }
    } catch (err) {
        console.log({ getDestinationsError: err.message });
        retVal.message = err.message;
        res.status(500).json(retVal);
    }
});

// Konfiguracija za slanje emaila pomoću nodemailer-a
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ognjenkecina@gmail.com',
        pass: 'jdvxzshvplbzlkql'
    }
});

router.route('/sendEmail').post(async function (req, res) {
    const { ime, email, telefon, detalji } = req.body;

    try{
        const mailOptions = {
            from: 'ognjenkecina@gmail.com',
            to: email, // Adresa na koju treba da stigne email
            subject: 'Rezervacija za putovanje',
            text: `Ime: ${ime}\nBroj telefona: ${telefon}\nDetalji putovanja: ${detalji}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.send('Email sent successfully');
            }
        });
    }catch (e){
        console.log(e)
    }
})

module.exports = router;
