import { Wave } from "../types/soundwaves-types";
const db = require("../connection");
import fs from "fs/promises";
import axios from "axios";

export async function selectWaves(): Promise<Wave[]> {
  const waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript (waves), censor(waves), likes(waves), board_slug(boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_slug(boards) = board_slug(waves)
 GROUP BY wave_id(waves), wave_id(comments), board_slug(boards)
 ORDER BY wave_id(waves) DESC;`;

  const { rows }: { rows: Wave[] } = await db.query(waves_query);

  return rows;
}

export const insertWave = (
  {
    title,
    username,
    board_slug,
    created_at,
  }: {
    title: string;
    username: string;
    board_slug: string;
    created_at: string;
  },
  wave_url: string,
  transcript: string
): Promise<Wave> => {
  return db.query(`
    INSERT INTO waves
      (title, username, board_slug, wave_url, created_at, transcript)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;`,
    [title, username, board_slug, wave_url, created_at, transcript]
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
  const wave_query = `SELECT * FROM waves WHERE wave_id = $1;`;

  const { rows }: { rows: Wave[] } = await db.query(wave_query, [wave_id]);

  return rows[0];
}
