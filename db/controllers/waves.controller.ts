import { Request, Response, NextFunction } from "express";
import { selectWaveById, selectWaves } from "../models/waves.model";
import { Wave } from "../types/soundwaves-types";

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
