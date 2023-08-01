import { Wave } from '../types/soundwaves-types'
const db = require('../connection')

export async function selectWaves(): Promise<Wave[]> {
    const { rows }: {rows: Wave[]} = await db.query('SELECT * FROM waves;')
    return rows
}
