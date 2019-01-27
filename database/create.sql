CREATE TABLE rso (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  category TEXT,
  logo TEXT,
  searchable tsvector
);

-- Create searchable column and search index
ALTER TABLE rso ADD COLUMN searchable tsvector;
UPDATE rso SET searchable = setweight(to_tsvector(coalesce(name,'')), 'A') || setweight(to_tsvector(coalesce(description,'')), 'C') || setweight(to_tsvector(coalesce(category,'')), 'D');
CREATE INDEX search_index ON rso USING GIN (searchable);
-- Create trigram index on RSO names
CREATE INDEX trigram_index ON rso USING gin (name gin_trgm_ops);
-- Perform a search
SELECT r.id, sum(rank) AS sum, r.name, r.description, r.category, r.logo FROM (
  SELECT *, ts_rank_cd(searchable, plainto_tsquery('tech')) AS rank FROM rso WHERE searchable @@ plainto_tsquery('tech')
  UNION ALL
  SELECT *, 1.0 as rank FROM rso WHERE lower(name) LIKE '%tech%'
) AS result JOIN rso r ON result.id = r.id GROUP BY r.id, r.name, r.description, r.category, r.logo ORDER BY sum DESC LIMIT 20;
