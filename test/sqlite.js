import {initDb, createIndex, incrementFields, findAll, dropTable, close} from '../lib/db/sqlite.js'

const configDb = 'test/test.db'


async function testSimpleUpsert() {
	await createIndex('test', {name: 1})
	const query = {name: 'hi'}
	await incrementFields('test', query, {count: 1})
	await incrementFields('test', query, {count: 1})
	await incrementFields('test', query, {count: 1})
	const results = await findAll('test', ['name = ?'], ['hi'])
	console.assert(results, 'no results')
	console.assert(results.length == 1, 'not one result')
	console.assert(results[0].count, 'no result count')
	console.assert(results[0].count == 3, 'result count should be 3')
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

