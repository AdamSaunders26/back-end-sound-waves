import { Request, Response, NextFunction } from "express";
import { Comment } from "../types/soundwaves-types";
import { selectCommentsByWaveId } from "../models/comments.model";

export const getCommentsByWaveId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { wave_id } = req.params;
  selectCommentsByWaveId(wave_id)
    .then((comments: Comment[]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err, "<<< getCommentsByWaveId err");
    });
};
