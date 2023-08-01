import { Request, Response, NextFunction } from "express"
import { Board } from "../types/soundwaves-types"
import { selectBoards } from "../models/boards.model"


export const getBoards = (req: Request, res: Response, next: NextFunction) => {
    selectBoards()
    .then((boards: Board[]) => {
        res.status(200)
        res.send({ boards })
    })
    .catch((err) => {
        console.log(err, '<<< getBoards err')
    })
}
