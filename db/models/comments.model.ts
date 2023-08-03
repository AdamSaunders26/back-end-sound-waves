import { Comment } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectCommentsByWaveId(
  wave_id: string
): Promise<Comment[]> {
  const comments_query = `SELECT * FROM comments WHERE wave_id = $1
   ORDER BY comment_id DESC;`;

  const { rows }: { rows: Comment[] } = await db.query(comments_query, [
    wave_id,
  ]);
  return rows;
}
