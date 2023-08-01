"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoards = void 0;
const boards_model_1 = require("../models/boards.model");
const getBoards = (req, res, next) => {
    (0, boards_model_1.selectBoards)()
        .then((boards) => {
        res.status(200);
        res.send({ boards });
    })
        .catch((err) => {
        console.log(err, '<<< getBoards err');
    });
};
exports.getBoards = getBoards;
