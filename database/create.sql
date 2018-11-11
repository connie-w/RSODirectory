CREATE TABLE rso (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  category TEXT,
  logo TEXT,
  searchable tsvector
);

ALTER TABLE rso ADD COLUMN searchable tsvector;
UPDATE rso SET searchable = setweight(to_tsvector(coalesce(name,'')), 'A') || setweight(to_tsvector(coalesce(description,'')), 'C') || setweight(to_tsvector(coalesce(category,'')), 'D');
CREATE INDEX search_index ON rso USING GIN (searchable);

SELECT name, ts_rank_cd(searchable, to_tsquery('tech:*')) AS rank FROM rso WHERE searchable @@ to_tsquery('tech:*') ORDER BY rank DESC LIMIT 20;

SELECT *, ts_rank_cd(searchable, plainto_tsquery($1)) AS rank FROM rso WHERE searchable @@ plainto_tsquery($1) ORDER BY rank DESC LIMIT 20;

SELECT r.id, sum(rank) AS sum, * FROM (
  SELECT *, ts_rank_cd(searchable, plainto_tsquery('tech')) AS rank FROM rso WHERE searchable @@ plainto_tsquery('tech')
  UNION ALL
  SELECT *, 1.0 as rank FROM rso WHERE name LIKE '%tech%'
) AS result JOIN rso r ON result.id = r.id GROUP BY r.id ORDER BY sum DESC LIMIT 20;

WITH total AS(
  SELECT *, ts_rank_cd(searchable, plainto_tsquery('tech')) AS rank FROM rso WHERE searchable @@ plainto_tsquery('tech')
  UNION ALL
  SELECT *, 1.0 as rank FROM rso WHERE name LIKE '%tech%'
)
SELECT id, sum(rank) AS sum, * FROM total GROUP BY id ORDER BY sum DESC LIMIT 20;
