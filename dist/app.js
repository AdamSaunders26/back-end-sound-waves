"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const waves_controller_1 = require("./db/controllers/waves.controller");
const boards_controller_1 = require("./db/controllers/boards.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/api/waves', waves_controller_1.getWaves);
app.get('/api/boards', boards_controller_1.getBoards);
module.exports = app;
