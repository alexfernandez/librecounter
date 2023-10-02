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
	const group = {
		$dateToString: {
			format: '%Y-%m-%d',
			date: '$timestamp',
		}
	}
	return findGrouped(name, query, group)
}

export async function findByField(name, query, field) {
	return findGrouped(name, query, `$${field}`)
}

export async function findGrouped(name, query, group) {
	const collection = db.collection(name)
	const aggregate = await collection.aggregate([
		{$match: query},
		{$group: {
			_id: group,
			count: {$sum: 1},
		}},
	])
	const array = await aggregate.toArray()
	return format(array)
}

function format(array) {
	const formatted = array.map(point => ({key: point._id, value: point.count}))
	const filtered = formatted.filter(point => point).filter(point => point.key)
	filtered.sort((a, b) => a.key.localeCompare(b.key))
	return filtered
}

