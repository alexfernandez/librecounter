import {MongoClient} from 'mongodb'
import {getCached, setCached} from '../core/cache.js'
import {} from '../core/env.js'

let client
let db


export function initDb(connectionString) {
	client = new MongoClient(connectionString, {maxPoolSize: 4})
	db = client.db('librecounter')
}

export async function createIndex(name, index) {
	await db.collection(name).createIndex(index)
}

export async function insertOne(name, value) {
	const collection = db.collection(name)
	return await collection.insertOne(value)
}

export async function incrementFields(name, query, fields) {
	const collection = db.collection(name)
	return await collection.updateOne(query, {$inc: fields}, {upsert: true})
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

