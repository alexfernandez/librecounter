import * as mongo from './mongo.js'
import * as sqlite from './sqlite.js'

const mongoConfig = 'BACKEND_MONGODB_URL'
const sqliteConfig = 'BACKEND_SQLITE_DB'
const driver = getDriver()


function getDriver() {
	const mongoString = process.env[mongoConfig]
	if (mongoString) {
		mongo.initDb(mongoString)
		return mongo
	}
	const sqliteString = process.env[sqliteConfig]
	if (sqliteString) {
		sqlite.initDb(sqliteString)
		return sqlite
	}
	throw new Error('No backend driver configured, set either ${mongoConfig} or ${sqliteConfig}')
}

export async function createIndex(name, index) {
	return await driver.createIndex(name, index)
}

export async function insertOne(name, value) {
	return await driver.insertOne(name, value)
}

export async function incrementFields(name, query, fields) {
	return await driver.incrementFields(name, query, fields)
}

export async function findAll(name, query, projection) {
	return await driver.findAll(name, query, projection)
}

export async function findOne(name, query, projection) {
	return await driver.findOne(name, query, projection)
}

export async function close() {
	await driver.close()
}

