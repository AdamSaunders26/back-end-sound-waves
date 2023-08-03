import { Wave } from "../types/soundwaves-types";
const db = require("../connection");
import fs from "fs/promises";

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

export async function initiateTranscription(path: string) {
  console.log(`Uploading file: ${path}`);
  const data = await fs.readFile(path);
  const url = "https://api.assemblyai.com/v2/upload";
  const api_token = process.env.ASSEMBLYAI_API_TOKEN;
  const headers = {
    authorization: api_token,
    "content-type": "application/json",
  };

  return fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: api_token,
    },
    language_detection: true,
    filter_profanity: true,
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return Promise.reject({ msg: "error", status: response.status });
      }
    })
    .then(({ upload_url }) => {
      // console.log(upload_url);
      const webhook_url = process.env.APP_URL + "/waves-transcript";
      console.log(webhook_url);
      return fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        body: JSON.stringify({
          audio_url: upload_url,
        }),
        headers,
      }).then((response) => {
        return response.json();
      });
    })
    .then(async ({ id }) => {
      const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${id}`;

      while (true) {
        const pollingResponse = await fetch(pollingEndpoint, { headers });
        const transcriptionResult = await pollingResponse.json();

        if (transcriptionResult.status === "completed") {
          // console.log(transcriptionResult.text, ":while");
          return transcriptionResult.text;
        } else if (transcriptionResult.status === "error") {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const waves_query = `SELECT wave_id(waves), title(waves), wave_url(waves), created_at(waves), username(waves), board_name(boards), transcript  (waves), censor(waves), likes(waves), board_slug (boards), COUNT(comment_id(comments)) AS comment_count
 FROM waves 
 LEFT JOIN comments ON wave_id(waves)= wave_id(comments)
 LEFT JOIN boards ON board_name(boards) = board_name(waves)
 GROUP BY wave_id(waves), wave_id(comments), board_name(boards) 
 ORDER BY wave_id(waves) DESC;`;
