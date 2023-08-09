import { Comment } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectCommentsByWaveId(
  wave_id: string
): Promise<Comment[]> {
  const comments_query = `SELECT comment_id(comments), comment(comments), created_at(comments), likes(comments), username(comments), wave_id(comments), avatar_url(users) FROM comments
    LEFT JOIN users ON username(comments) = username(users)
    WHERE wave_id = $1
    ORDER BY comment_id DESC;`;

  const { rows }: { rows: Comment[] } = await db.query(comments_query, [
    wave_id,
  ]);
  return rows;
}

export async function insertComment(
  wave_id: string,
  username: string,
  comment: string
): Promise<Comment> {
  const insert_query = `
    INSERT INTO comments (wave_id, username, comment)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows }: { rows: Comment[] } = await db.query(insert_query, [
    wave_id,
    username,
    comment,
  ]);


  return rows[0];
}
