package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const connStr = "mongodb://localhost:27017"
const csvFile = "../datascrape/rso-data-utf8.csv"

type rso struct {
	Name string
	Description string
	Category string
	Logo string
}

func main() {
	opts := options.Client().ApplyURI(connStr)
	client, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to database")

	file, err := os.Open(csvFile)
	if err != nil {
		log.Fatal(err)
	}
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	var rsos []interface{}
	for i := 1; i < len(records); i++ {
		record := records[i]
		rsos = append(rsos, rso{
			Name: record[1],
			Description: record[4],
			Category: record[6],
			Logo: record[7],
		})
	}

	collection := client.Database("rsodirectory").Collection("rsos")
	_, err = collection.InsertMany(context.TODO(), rsos)
	if err != nil {
		log.Fatal(err)
	}
}
