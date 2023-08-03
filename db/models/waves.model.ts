import { Wave } from "../types/soundwaves-types";
const db = require("../connection");
import fs from "fs/promises";
import axios from "axios";

export async function selectWaves({
  board
}: {
  board: string;

}): Promise<Wave[]> {

  let waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript (waves), censor(waves), likes(waves), board_slug(boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_slug(boards) = board_slug(waves) `;

const queryValues = []
const whereQuery = `WHERE board_slug(waves) = $1 `;
const remainingQuery = `GROUP BY wave_id(waves), wave_id(comments), board_slug(boards)
ORDER BY wave_id(waves) DESC;`

if(board) {
  waves_query += whereQuery 
  queryValues.push(board)
}
waves_query += remainingQuery

  const { rows }: { rows: Wave[] } = await db.query(waves_query, queryValues);

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
  wave_url: string,
  transcript: string
): Promise<Wave> => {
  return db.query(
    `
    INSERT INTO waves
      (title, username, board_slug, wave_url, transcript)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;`,
    [title, username, board_slug, wave_url, transcript]
  );
};

export async function audioTranscriber(path: string) {
  console.log(`Uploading file: ${path}`);
  const data = await fs.readFile(path);
  const headers = {
    authorization: process.env.ASSEMBLYAI_API_TOKEN,
  };
  const uploadResponse = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    data,
    { headers }
  );

  const { upload_url } = uploadResponse.data;
  const transcriptIdResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: upload_url,
    },
    { headers }
  );
  const { id } = transcriptIdResponse.data;
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${id}`;

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, { headers });
    const transcriptionResult = pollingResponse.data;

    if (transcriptionResult.status === "completed") {
      return transcriptionResult.text;
    } else if (transcriptionResult.status === "error") {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    }
  }
}

export async function selectWaveById(wave_id: string): Promise<Wave> {
  const wave_query = `
    SELECT w.wave_id, w.title, w.created_at, w.username, b.board_slug, w.likes, w.transcript, w.censor, w.wave_url, b.board_name, COUNT(c.comment_id) AS comment_count 
    FROM waves AS w
    LEFT JOIN comments AS c ON w.wave_id = c.wave_id
    LEFT JOIN boards AS b ON b.board_slug = b.board_slug
    WHERE w.wave_id = $1
    GROUP BY w.wave_id, c.wave_id, b.board_slug;
  `;
  // Delete this comment
  const { rows }: { rows: Wave[] } = await db.query(wave_query, [wave_id]);

  return rows[0];
}
