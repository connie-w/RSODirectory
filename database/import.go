package main

import (
	"database/sql"
	"encoding/csv"
	"log"
	"os"

	"github.com/lib/pq"
)

func main() {
	connStr := os.Args[1]
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	txn, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := txn.Prepare(pq.CopyIn("rso", "name", "description", "category", "logo"))
	if err != nil {
		log.Fatal(err)
	}

	file, err := os.Open("../datascrape/rso-data-utf8.csv")
	if err != nil {
		log.Fatal(err)
	}
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	// i = 0 is the column names
	for i := 1; i < len(records); i++ {
		record := records[i]
		name := record[1]
		description := record[4]
		category := record[6]
		logo := record[7]

		_, err = stmt.Exec(name, description, category, logo)
		if err != nil {
			log.Fatal(err)
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		log.Fatal(err)
	}

	err = stmt.Close()
	if err != nil {
		log.Fatal(err)
	}

	err = txn.Commit()
	if err != nil {
		log.Fatal(err)
	}
}
