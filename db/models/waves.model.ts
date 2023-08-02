import { Wave } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectWaves(): Promise<Wave[]> {
  const { rows }: { rows: Wave[] } = await db.query(waves_query);
  return rows;
}

const waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript  (waves), censor(waves), likes(waves), board_slug (boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves 
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_name(boards) = board_name(waves)
 GROUP BY wave_id(waves), wave_id(comments), board_name(boards) 
 ORDER BY wave_id(waves) DESC;`;
