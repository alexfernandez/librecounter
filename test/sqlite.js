import {initDb, createIndex, incrementFields, findAll, dropTable, close} from '../lib/db/sqlite.js'

const configDb = 'test/test.db'


async function testSimpleUpsert() {
	await createIndex('test', {name: 1})
	const query = {name: 'hi'}
	await incrementFields('test', query, {count: 1})
	await incrementFields('test', query, {count: 1})
	await incrementFields('test', query, {count: 1})
	const result = await findAll('test', query, {count: 1})
	console.assert(result, 'no result')
	console.assert(result.count, 'no result count')
	console.assert(result.count == 3, 'result count should be 3')
}

async function testDropTable() {
	await dropTable('test')
}

export default async function test() {
	await initDb(configDb)
	await testDropTable()
	await testSimpleUpsert()
	await close()
}

