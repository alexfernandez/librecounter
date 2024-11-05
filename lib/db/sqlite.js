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
	const primaryKeys = [...Object.keys(query), 'field']
	const fields = [...primaryKeys.map(key => `'${key}' varchar`), 'count integer']
	const createTable = `CREATE TABLE IF NOT EXISTS ${name} (${fields.join(', ')}, PRIMARY KEY(${primaryKeys.join(', ')}))`
	console.log(createTable)
	db.exec(createTable)
}

export async function insertOne(name, value) {
	const keys = Object.keys(value)
	const insert = generateInsert(name, keys)
	await db.prepare(insert).run(value)
}

function generateInsert(name, keys) {
	const placeholders = keys.map(key => `@${key}`)
	return `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`
}

export async function incrementFields(name, query, fields) {
	const primaryKeys = [...Object.keys(query), 'field']
	const allKeys = [...primaryKeys, 'count']
	const insert = generateInsert(name, allKeys)
	for (const field in fields) {
		const count = fields[field]
		const value = {...query, field, count}
		const upsert = `${insert} ON CONFLICT(${primaryKeys.join(', ')}) DO UPDATE SET count=count+${count};`
		console.log(upsert)
		await db.prepare(upsert).run(value)
	}
}

export async function findAll(name, query, projection) {
	const projectionKeys = Object.keys(projection)
	const queryKeys = Object.keys(query)
	const conditions = queryKeys.map(key => `${key} = ?`)
	const values = queryKeys.map(key => query[key])
	const select = `SELECT ${projectionKeys.join(', ')} FROM ${name} WHERE ${conditions.join(' AND ')}`
	const result = await db.prepare(select).get(...values)
	console.log(result)
	return result
}

export async function findOne(name, query, projection) {
	const collection = db.collection(name)
	return await collection.findOne(query, {projection})
}

export async function dropTable(name) {
	const dropTable = `DROP TABLE IF EXISTS ${name}`
	db.exec(dropTable)
}

export async function close() {
	await db.close()
}

