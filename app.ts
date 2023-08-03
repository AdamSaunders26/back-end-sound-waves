import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getWaveById, getWaves } from "./db/controllers/waves.controller";
import { getBoards } from "./db/controllers/boards.controller";
import { getCommentsByWaveId } from "./db/controllers/comments.controller";

dotenv.config();

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/waves", getWaves);

app.get("/api/boards", getBoards);

app.get("/api/waves/:wave_id/comments", getCommentsByWaveId);

app.get("/api/waves/:wave_id", getWaveById);

module.exports = app;
