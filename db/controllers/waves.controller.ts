import { Request, Response, NextFunction } from "express";
import {
  initiateTranscription,
  insertWave,
  selectWaves,
} from "../models/waves.model";
import { Wave } from "../types/soundwaves-types";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";

export const getWaves = (req: Request, res: Response, next: NextFunction) => {
  selectWaves()
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

  fs.readFile(`${__dirname}/../../../${req.file?.path}`)
    .then((file) => {
      return supabase.storage
        .from("waves")
        .upload(`${req.file?.filename}.webm`, file);
    })
    .then(() => {
      return initiateTranscription(`${__dirname}/../../../${req.file?.path}`);
    })
    .then((transcript) => {
      return insertWave(req.body, `${req.file?.filename}.webm`, transcript);
    })
    .then(() => {
      // console.log(req.body, req.file);
      console.log("sent");
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("deleting");
      return fs.rm(`${__dirname}/../../../${req.file?.path}`);
    });
};

// export function receiveTranscript(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.log(req.body, "body");
// }
