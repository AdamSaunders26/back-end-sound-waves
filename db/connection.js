const { Pool } = require("pg")

// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient('your-supabase-url', 'your-supabase-key', {
//   localStorage: window.localStorage,
// });

// import { createClient } from '@supabase/supabase-js';
// import { parse, serialize } from 'cookie';

// Your setup code to parse and serialize cookies (using 'cookie' package for Node.js)

// const supabase = createClient('your-supabase-url', 'your-supabase-key', {
//   cookies: {
//     get: (name) => parse(document.cookie)[name],
//     set: (name, value) => {
//       // Replace the `serialize` function call with your actual cookie serialization logic
//       document.cookie = serialize(name, value, { sameSite: 'strict', path: '/' });
//     },
//   },
// });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set")
}

const config = { connectionString: process.env.DATABASE_URL }

module.exports = new Pool(config)
