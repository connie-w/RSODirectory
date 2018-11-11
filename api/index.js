const express = require('express');
const { query } = require('./query.js');

const app = express();

app.use((req, res, next) => {
  console.log(req.originalUrl);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.get('/rsos', async (req, res, next) => {
  const result = await query('SELECT * FROM rso LIMIT 20');
  res.json(result.rows);
});

// !!!VULNERABLE TO SQL INJECTION: DO NOT USE IN PRODUCTION!!!
app.get('/rsos/search', async (req, res, next) => {
  const search = req.query.query;
  const result = await query('SELECT *, ts_rank_cd(searchable, to_tsquery(\'' + search + ':*\')) AS rank FROM rso WHERE searchable @@ to_tsquery(\'' + search + ':*\') ORDER BY rank DESC LIMIT 20;');
  res.json(result.rows);
});

app.listen(3081);
