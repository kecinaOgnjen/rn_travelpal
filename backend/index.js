const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

const auth = require('./routes/auth/auth');
app.use('/auth', auth);

const userSettings = require('./routes/UserSettings/userSettings');
app.use('/userSettings', userSettings);

const port = 5000;
app.listen(port, () => console.log("running 5000"));




