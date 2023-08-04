import { Request, Response, NextFunction } from "express";
import { User } from "../types/soundwaves-types";
import { selectUsers } from "../models/users.model";

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    selectUsers()
    .then((users: User[]) => {
        res.status(200);
        res.send({ users });
    })
    .catch((err) => {
        console.log(err, "<<< getUsers err");
    });
}
