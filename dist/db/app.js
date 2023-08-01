"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
app.use('/api/users', (req, res) => {
    res.status(200);
    res.send({ msg: 'users' });
});
module.exports = app;
