import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getWaves } from './db/controllers/waves.controller';
import { getBoards } from './db/controllers/boards.controller';

dotenv.config();

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/waves', getWaves)

app.get('/api/boards', getBoards)

module.exports = app
