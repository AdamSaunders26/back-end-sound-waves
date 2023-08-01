"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seed = require('./seed');
const data = require('../test-data/index');
const db = require('../connection');
seed(data).then(() => {
    return db.end();
});
