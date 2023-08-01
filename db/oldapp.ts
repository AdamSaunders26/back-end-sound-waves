const express = require('express')
import { Request, Response, NextFunction } from 'express';

const app = express()

app.use('/api/users', (req:Request, res:Response) => {
    res.status(200)
    res.send({ msg: 'users'})
})



module.exports = app