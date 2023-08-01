const db = require("../connection");

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
        username VARCHAR,
        email VARCHAR,
        avatar_url VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE boards (
        board_id SERIAL PRIMARY KEY,
        title VARCHAR,
        slug VARCHAR,
        created_at INT,
        user_id INT REFERENCES users (user_id),
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE waves (
        wave_id SERIAL PRIMARY KEY,
        title VARCHAR,
        wave_url VARCHAR,
        created_at INT,
        user_id INT REFERENCES users (user_id),
        board_id INT REFERENCES boards (board_id),
        transcipt VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        comment VARCHAR,
        user_id INT REFERENCES users (user_id),
        wave_id INT REFERENCES waves (wave_id)
      );`);
    });
};
