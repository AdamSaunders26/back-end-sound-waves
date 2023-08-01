import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getWaves } from './db/controllers/waves.controller';

dotenv.config();

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/waves', getWaves)

module.exports = app
