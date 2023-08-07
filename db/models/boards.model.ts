import { Board } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectBoards(): Promise<Board[]> {
  const { rows }: { rows: Board[] } = await db.query(
    `
      SELECT board_slug(boards), board_name(boards), description(boards), created_at(boards), username(boards), avatar_url(users)
      FROM boards
      LEFT JOIN users ON username(boards) = username(users)
      ORDER BY created_at DESC;
    `
  );
  return rows;
}
