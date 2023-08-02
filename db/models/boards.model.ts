import { Board } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectBoards(): Promise<Board[]> {
  const { rows }: { rows: Board[] } = await db.query(
    "SELECT * FROM boards ORDER BY created_at DESC;"
  );
  return rows;
}
