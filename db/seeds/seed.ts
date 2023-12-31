const db = require("../connection");
const format = require("pg-format");
import { Wave, Board, Comment, User } from "../types/soundwaves-types";

const seed = ({
  boardsData,
  usersData,
  wavesData,
  commentsData,
}: {
  boardsData: Board[];
  usersData: User[];
  wavesData: Wave[];
  commentsData: Comment[];
}) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS waves;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS boards;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR NOT NULL PRIMARY KEY,
        email VARCHAR NOT NULL,
        avatar_url VARCHAR,
        password VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE boards (
      board_slug VARCHAR NOT NULL PRIMARY KEY,
      board_name VARCHAR NOT NULL,
      description VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      username VARCHAR REFERENCES users(username) NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE waves (
      wave_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      wave_url VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      username VARCHAR REFERENCES users (username) NOT NULL,
      board_slug VARCHAR REFERENCES boards (board_slug) NOT NULL,
      transcript VARCHAR,
      censor BOOLEAN DEFAULT true,
      likes INT DEFAULT 0
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      comment VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      likes INT DEFAULT 0,
      username VARCHAR REFERENCES users (username) NOT NULL,
      wave_id INT REFERENCES waves (wave_id) NOT NULL
    );`);
    })
    .then(() => {
      const insertUsersData = format(
        "INSERT INTO users (username, email, avatar_url, password) VALUES %L RETURNING * ",
        usersData.map(
          ({
            username,
            email,
            avatar_url,
            password = "$2a$04$H.8.1IEF5nfICzTo8TNN9OrqSj9.9egqZSm01MKkzO3Sgph12hDOu",
          }) => [username, email, avatar_url, password]
        )
      );
      return db.query(insertUsersData);
    })
    .then(() => {
      const insertBoardsData = format(
        "INSERT INTO boards ( board_name, board_slug, username, description ) VALUES %L RETURNING * ",
        boardsData.map(({ board_name, board_slug, username, description }) => [
          board_name,
          board_slug,
          username,
          description,
        ])
      );
      return db.query(insertBoardsData);
    })
    .then(() => {
      const insertWavesData = format(
        "INSERT INTO waves ( title, wave_url,  username, board_slug, transcript) VALUES %L RETURNING * ",
        wavesData.map(
          ({ title, wave_url, username, board_slug, transcript }) => [
            title,
            wave_url,
            username,
            board_slug,
            transcript,
          ]
        )
      );
      return db.query(insertWavesData);
    })
    .then(() => {
      const insertCommentsData = format(
        "INSERT INTO comments ( comment, username, wave_id) VALUES %L RETURNING * ",
        commentsData.map(({ comment, username, wave_id }) => [
          comment,
          username,
          wave_id,
        ])
      );
      return db.query(insertCommentsData);
    });
};

module.exports = seed;
export {};
