const express = require('express');
const app = express();

const authRoutes = require('./api/routes/auth/auth');

app.use('/auth', authRoutes);

module.exports = app;

