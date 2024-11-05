import Database from 'better-sqlite3'


import {} from '../core/env.js'

let db


export function initDb(config) {
	db = new Database(config, {})
	db.pragma('journal_mode = WAL')
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
	console.log(select, query, values)
	const results = await db.prepare(select).all(...values)
	console.log(results)
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

function buildConditions(query, projection) {
	const conditions = []
	const values = []
	for (const key in query) {
		const value = query[key]
		if (typeof value != 'object') {
			conditions.push(`${key} = ?`)
			values.push(value)
		} else {
			for (const operator in value) {
				const subvalue = value[operator]
				if (operator == '$gt') {
					conditions.push(`${key} > ?`)
					values.push(subvalue)
				} else if (operator == '$lt') {
					conditions.push(`${key} < ?`)
					values.push(subvalue)
				} else {
					throw new Error(`Unknown operator ${operator} with value ${subvalue}`)
				}
			}
		}
	}
	return {conditions, values}
}

export async function findOne(name, query, projection) {
	const select = getSelect(name, conditions, projection)
	const {conditions, values} = buildConditions(query)
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

