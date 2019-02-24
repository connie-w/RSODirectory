// Create text search indices on name and description of RSOs
db.rsos.createIndex( { name: "text", description: "text" } );