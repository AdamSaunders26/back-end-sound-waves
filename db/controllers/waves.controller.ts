import { Request, Response, NextFunction } from "express"
import { selectWaves } from "../models/waves.model"
import { Wave } from "../types/soundwaves-types"

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
