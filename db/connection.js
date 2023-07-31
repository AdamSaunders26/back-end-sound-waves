const { Pool } = require("pg")

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set")
}

const config = { connectionString: process.env.DATABASE_URL }

module.exports = new Pool(config)
