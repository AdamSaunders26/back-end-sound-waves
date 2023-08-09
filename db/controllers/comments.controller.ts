import { Request, Response, NextFunction } from "express";
import { Comment } from "../types/soundwaves-types";
import {
  insertComment,
  selectCommentsByWaveId,
} from "../models/comments.model";

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

export const addComment = (req: Request, res: Response, next: NextFunction) => {
  const { wave_id } = req.params;
  const { username, comment } = req.body;
  insertComment(wave_id, username, comment)
    .then((comment: Comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err, "<<< addComment err");
    });
};
