import express from "express";
import { query } from "./query.js";

const app = express();

app.use((req, res, next) => {
  console.log(req.originalUrl);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.get('/rsos', async (req, res) => {
  const result = await query('SELECT * FROM rso LIMIT 20');
  res.json(result.rows);
});

app.get('/rsos/search', async (req, res, next) => {
  const search = req.query.query;
  const qs = {
    name: 'search',
    text: `SELECT r.id, sum(rank) AS sum, r.name, r.description, r.category, r.logo FROM (
      SELECT *, ts_rank_cd(searchable, plainto_tsquery($1)) AS rank
      FROM rso WHERE searchable @@ plainto_tsquery($1)
      UNION ALL
      SELECT *, 1.0 as rank FROM rso WHERE lower(name) LIKE lower($2)
    ) AS result JOIN rso r ON result.id = r.id GROUP BY r.id, r.name, r.description, r.category, r.logo ORDER BY sum DESC LIMIT 20;`,
    values: [search, '%' + search + '%']
  };
  const result = await query(qs);
  res.json(result.rows);
});

app.listen(3081);
