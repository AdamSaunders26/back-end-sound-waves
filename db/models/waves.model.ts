import { Wave } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectWaves(): Promise<Wave[]> {
  const waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript (waves), censor(waves), likes(waves), board_slug(boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves 
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_name(boards) = board_name(waves)
 GROUP BY wave_id(waves), wave_id(comments), board_name(boards) 
 ORDER BY wave_id(waves) DESC;`;

  const { rows }: { rows: Wave[] } = await db.query(waves_query);
  return rows;
}

export const insertWave = (
  {
    title,
    username,
    board_slug,
  }: {
    title: string;
    username: string;
    board_slug: string;
  },
  wave_url: string
): Promise<Wave> => {
  console.log({ title, username, board_slug });
  return db.query(
    `
    INSERT INTO waves
      (title, username, board_slug, wave_url)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `,
    [title, username, board_slug, wave_url]
  );
};

export async function selectWaveById(wave_id: string): Promise<Wave> {
  const wave_query = `SELECT * FROM waves WHERE wave_id = $1;`;

  const { rows }: { rows: Wave[] } = await db.query(wave_query, [wave_id]);

  return rows[0];
}
