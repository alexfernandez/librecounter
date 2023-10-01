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

export async function findByDay(name, query) {
	const collection = db.collection(name)
	const aggregate = await collection.aggregate([
		{$match: query},
		{$group: {
			_id: {$dateToString: {format: '%Y-%m-%d', date: '$timestamp'}},
			count: {$sum: 1},
		}},
	])
	return aggregate.toArray()
}

export async function findByPage(name, query) {
	const collection = db.collection(name)
	const aggregate = await collection.aggregate([
		{$match: query},
		{$group: {
			_id: '$page',
			count: {$sum: 1},
		}},
	])
	return aggregate.toArray()
}

