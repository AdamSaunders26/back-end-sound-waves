const db = require('../connection');

const seed = () => {
   return db
    .query(`DROP TABLE IF EXISTS boards;`)
    .then(() => {
      return db.query(`CREATE TABLE boards (

      );`);
    })
};
