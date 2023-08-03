import { Request, Response, NextFunction } from "express";
import { selectWaveById, selectWaves, insertWave } from "../models/waves.model";
import { Wave } from "../types/soundwaves-types";
import { createClient } from "@supabase/supabase-js"
import fs from 'fs/promises';

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

export const getWaves = (req: Request, res: Response, next: NextFunction) => {
  selectWaves()
  .then((waves: Wave[]) => {
    res.status(200)
    res.send({ waves })
  })
  .catch((err) => {
    console.log(err, '<<< getWaves err')
  })
}

export const storeWave = (req: Request, res: Response, next: NextFunction) => {
  const supabase = createClient(
    <string>process.env.SUPABASE_PROJECT_URL,
    <string>process.env.SUPABASE_API_KEY
  );

  fs.readFile(`${__dirname}/../../../${req.file?.path}`).then((file) => {
    return supabase.storage.from('waves').upload(`${req.file?.filename}.webm`, file);
  }).then(() => {
    insertWave(req.body, `${req.file?.filename}.webm`).then(() => {
      console.log(req.body, req.file);
      res.status(200).send({ success: true });
    }).catch((err) => {
      console.log(err);
    });
  });
}

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
