import { Request, Response, NextFunction } from "express";
import {
  audioTranscriber,
  insertWave,
  selectWaves,
  selectWaveById,
} from "../models/waves.model";
import { Wave } from "../types/soundwaves-types";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import { badWords } from "../../Facebook Bad Words List - May 1, 2022";

export const getWaves = (req: Request, res: Response, next: NextFunction) => {
  const board = req.query.board as string;
  selectWaves({ board })
    .then((waves: Wave[]) => {
      res.status(200);
      res.send({ waves });
    })
    .catch((err) => {
      console.log(err, "<<< getWaves err");
    });
};

export const storeWave = (req: Request, res: Response, next: NextFunction) => {
  const supabase = createClient(
    <string>process.env.SUPABASE_PROJECT_URL,
    <string>process.env.SUPABASE_API_KEY
  );

  const audioFilePath = `${__dirname}/../../../${req.file?.path}`;
  fs.readFile(audioFilePath)
    .then((file) => {
      return supabase.storage
        .from("waves")
        .upload(`${req.file?.filename}.webm`, file);
    })
    .then(() => {
      return audioTranscriber(audioFilePath);
    })
    .then((transcript) => {
      return insertWave(
        req.body,
        `${req.file?.filename}.webm`,
        transcript,
        waveCensor(transcript)
      );
    })
    .then((wave) => {
      res.status(200).send({ success: true, wave });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      return fs.rm(audioFilePath);
    });
};

export const getWaveById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { wave_id } = req.params;
  selectWaveById(wave_id)
    .then((wave: Wave) => {
      res.status(200).send({ wave });
    })
    .catch((err) => {
      console.log(err, "<<< getWaveById err");
    });
};

function waveCensor(transcript: string) {
  const badWordsArr = badWords.split(",");

  for (let i = 0; i < badWordsArr.length; i++) {
    const regex = new RegExp(`\\b(${badWordsArr[i]})\\b`);
    if (transcript.match(regex)) {
      return false;
    }
  }
  return true;
}
