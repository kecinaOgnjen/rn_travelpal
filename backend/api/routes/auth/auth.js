const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling get "
    })
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling post "
    })
});

module.exports = router;