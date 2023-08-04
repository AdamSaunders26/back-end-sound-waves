import { User } from "../types/soundwaves-types";
const db = require("../connection");

export async function selectUsers(): Promise<User[]> {
    const usersQuery = "SELECT * FROM users ORDER BY username;"
    const { rows }: { rows: User[] } = await db.query(usersQuery);
    return rows;
}