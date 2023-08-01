const db = require("../connection");
const format = require("pg-format");

const seed = ({ boardsData, usersData, wavesData, commentsData }) => {
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
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        avatar_url VARCHAR,
        password VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE boards (
      board_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      slug VARCHAR NOT NULL,
      created_at VARCHAR NOT NULL,
      user_id INT REFERENCES users(user_id) NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE waves (
      wave_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      wave_url VARCHAR NOT NULL,
      created_at VARCHAR NOT NULL,
      user_id INT REFERENCES users (user_id) NOT NULL,
      board_id INT REFERENCES boards (board_id) NOT NULL,
      transcript VARCHAR,
      censor BOOLEAN,
      likes INT DEFAULT 0
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      comment VARCHAR NOT NULL,
      created_at VARCHAR NOT NULL,
      likes INT DEFAULT 0,
      user_id INT REFERENCES users (user_id) NOT NULL,
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
        "INSERT INTO boards ( title, slug, created_at, user_id) VALUES %L RETURNING * ",
        boardsData.map(({ title, slug, created_at, user_id }) => [
          title,
          slug,
          created_at,
          user_id,
        ])
      );
      return db.query(insertBoardsData);
    })
    .then(() => {
      const insertWavesData = format(
        "INSERT INTO waves ( title, wave_url, created_at, user_id, board_id, transcript) VALUES %L RETURNING * ",
        wavesData.map(
          ({ title, wave_url, created_at, user_id, board_id, transcript }) => [
            title,
            wave_url,
            created_at,
            user_id,
            board_id,
            transcript,
          ]
        )
      );
      return db.query(insertWavesData);
    })
    .then(() => {
      const insertCommentsData = format(
        "INSERT INTO comments ( comment, created_at,user_id, wave_id) VALUES %L RETURNING * ",
        commentsData.map(({ comment, created_at, user_id, wave_id }) => [
          comment,
          created_at,
          user_id,
          wave_id,
        ])
      );
      return db.query(insertCommentsData);
    });
};

module.exports = seed;
