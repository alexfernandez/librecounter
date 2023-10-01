import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()
const db = getDb()


function getDb() {
	const connectionString = process.env['BACKEND_MONGODB_URL']
	const client = new MongoClient(connectionString, {maxPoolSize: 4})
	return client.db('librecounter')
}

export async function insertOne(name, value) {
	const collection = db.collection(name)
	return await collection.insertOne(value)
}

export async function findOne(name, query) {
	const collection = db.collection(name)
	return await collection.findOne(query)
}

