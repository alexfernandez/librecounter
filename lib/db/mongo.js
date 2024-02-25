import {MongoClient} from 'mongodb'
import {getCached, setCached} from '../core/cache.js'
import {} from '../core/env.js'

let client
const db = getDb()


function getDb() {
	const connectionString = process.env['BACKEND_MONGODB_URL'] || 'mongodb://localhost:27017/librecounter'
	client = new MongoClient(connectionString, {maxPoolSize: 4})
	return client.db('librecounter')
}

export async function createIndex(name, index) {
	await db.collection(name).createIndex(index)
}

export async function insertOne(name, value) {
	const collection = db.collection(name)
	return await collection.insertOne(value)
}

export async function upsertOne(name, query, value) {
	const collection = db.collection(name)
	return await collection.updateOne(query, value, {upsert: true})
}

export async function findAll(name, query, projection) {
	const cached = getCached(name, query)
	if (cached) {
		return cached
	}
	const collection = db.collection(name)
	const result = await collection.find(query, {projection}).toArray()
	setCached(name, query, result)
	return result
}

export async function findOne(name, query, projection) {
	const collection = db.collection(name)
	return await collection.findOne(query, {projection})
}

export async function close() {
	await client.close()
}

