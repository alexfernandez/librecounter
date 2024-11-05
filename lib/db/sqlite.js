import Database from 'better-sqlite3'


import {} from '../core/env.js'

const db = initDb()


function initDb() {
	const config = process.env['BACKEND_SQLITE_DB'] || 'local.db'
	const db = new Database(config, {})
	db.pragma('journal_mode = WAL')
	return db
}

export async function createIndex(name, query) {
	const primaryKeys = [...Object.keys(query), 'field']
	const fields = [...primaryKeys.map(key => `'${key}' varchar`), 'count integer']
	const createTable = `CREATE TABLE IF NOT EXISTS ${name} (${fields.join(', ')}, PRIMARY KEY(${primaryKeys.join(', ')}))`
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
		await db.prepare(upsert).run(value)
	}
}

export async function findAll(name, conditions, values) {
	const select = getSelect(name, conditions)
	const results = await db.prepare(select).all(...values)
	return consolidateResults(results)
}

function consolidateResults(results) {
	const byKey = {}
	for (const result of results) {
		const key = `${result.day} - ${result.site}`
		let consolidated = byKey[key]
		if (!consolidated) {
			consolidated = {day: result.day, site: result.site}
			byKey[key] = consolidated
		}
		consolidated[result.field] = result.count
	}
	return Object.values(byKey)
}

function getSelect(name, conditions) {
	return `SELECT * FROM ${name} WHERE ${conditions.join(' AND ')}`
}

export async function findOne(name, conditions, values) {
	const select = getSelect(name, conditions)
	const result = await db.prepare(select).get(...values)
	return result
}

export async function dropTable(name) {
	const dropTable = `DROP TABLE IF EXISTS ${name}`
	db.exec(dropTable)
}

export async function close() {
	await db.close()
}

