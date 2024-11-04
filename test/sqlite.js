import {initDb, createIndex, incrementFields, findAll, close} from '../lib/db/sqlite.js'

const configDb = 'test/test.db'


async function testSimpleUpsert() {
	await createIndex('test', {name: 1})
	const query = {name: 'hi'}
	await incrementFields('test', query, {count: 1})
	const result = await findAll(query)
	console.assert(result)
	console.log(result)
}

export default async function test() {
	await initDb(configDb)
	await testSimpleUpsert()
	await close()
}

