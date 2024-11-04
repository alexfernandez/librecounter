import Database from 'better-sqlite3'


import {getCached, setCached} from '../core/cache.js'
import {} from '../core/env.js'

let client
let db


export function initDb(config) {
	db = new Database(config, {})
	db.pragma('journal_mode = WAL')
}

export async function createIndex(name, query) {
	const keys = ['count', 'value', ... Object.keys(query)]
	const fields = keys.map(key => `'${key}' varchar`)
	const createTable = `CREATE TABLE IF NOT EXISTS ${name} (${fields.join(', ')})`
	db.exec(createTable)
}

export async function insertOne(name, value) {
	const keys = Object.keys(value)
	const insert = createInsert(name, keys)
	await insert.run(value)
}

function createInsert(name, keys) {
	const placeholders = keys.map(key => `@${key}`)
	return db.prepare(`INSERT INTO ${name} (${keys.join(', ')}) VALUES (${placeholders.join(', ')});`)
}

export async function incrementFields(name, query, fields) {
	const keys = Object.keys(query)
	const placeholders = keys.map(key => `@${key}`)
	const insert = db.prepare(`INSERT INTO ${name} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT(${keys.join(', ')}) DO UPDATE SET ${fields}=${fields}+1;`)
	await insert.run(query, fields)
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

