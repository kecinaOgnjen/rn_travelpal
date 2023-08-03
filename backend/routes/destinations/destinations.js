const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../../database");
const {query} = require("express");
const path = require('path');

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

module.exports = router;
