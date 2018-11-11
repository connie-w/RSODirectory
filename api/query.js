const { Pool } = require('pg');
const connectionString = 'postgres://localhost/Josh?sslmode=disable';

const pool = new Pool({
  connectionString: connectionString
});

const query = async (qs, client) => {
  let res;
  try {
    if (client) {
      res = await client.query(qs);
    } else {
      res = await pool.query(qs);
    }
  } catch (e) {
    e.name = 'Query error';
    throw e;
  }
  return res;
};

module.exports = { query };
