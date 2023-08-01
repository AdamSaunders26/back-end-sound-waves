"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaves = void 0;
const waves_model_1 = require("../models/waves.model");
const getWaves = (req, res, next) => {
    (0, waves_model_1.selectWaves)()
        .then((waves) => {
        res.status(200);
        res.send({ waves });
    })
        .catch((err) => {
        console.log(err, '<<< getWaves err');
    });
};
exports.getWaves = getWaves;
