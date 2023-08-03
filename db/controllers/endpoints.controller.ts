const fs = require("fs/promises") 
import { Request, Response, NextFunction } from 'express';

export const getEndpoints = ( req:Request, res: Response, next: NextFunction) => {
    return fs.readFile('endpoints.json','utf8')
    .then((endpoints: string) => {
        const result = JSON.parse(endpoints)
        res.status(200).send(result)
    })
}
