import { Wave } from '../types/soundwaves-types'
const db = require('../connection')

export async function selectWaves(): Promise<Wave[]> {
  const { rows }: {rows: Wave[]} = await db.query('SELECT * FROM waves;')
  return rows
}

export const insertWave = ({
  title,
  username,
  board_slug
}: {
  title: string;
  username: string;
  board_slug: string;
}, wave_url: string): Promise<Wave> => {
  console.log({ title, username, board_slug });
  return db.query(`
    INSERT INTO waves
      (title, username, board_slug, wave_url)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `, [title, username, board_slug, wave_url]);
};
