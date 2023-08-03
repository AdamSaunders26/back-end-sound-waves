import { Wave } from "../types/soundwaves-types";
const db = require("../connection");
import fs from "fs/promises";
import axios from "axios";

export async function selectWaves(): Promise<Wave[]> {
  const { rows }: { rows: Wave[] } = await db.query("SELECT * FROM waves;");
  return rows;
}

export const insertWave = (
  {
    title,
    username,
    board_name,
    created_at,
  }: {
    title: string;
    username: string;
    board_name: string;
    created_at: string;
  },
  wave_url: string,
  transcript: string
): Promise<Wave> => {
  // console.log({ title, username, board_name, created_at });
  return db.query(
    `
    INSERT INTO waves
      (title, username, board_name, wave_url, created_at, transcript)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `,
    [title, username, board_name, wave_url, created_at, transcript]
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

const waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript  (waves), censor(waves), likes(waves), board_slug (boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves 
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_name(boards) = board_name(waves)
 GROUP BY wave_id(waves), wave_id(comments), board_name(boards) 
 ORDER BY wave_id(waves) DESC;`;
