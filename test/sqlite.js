import {initDb, upsertOne, findAll, close} from '../lib/db/sqlite.js'

const configDb = 'test/test.db'


async function testSimpleUpsert() {
	const query = {name: 'hi'}
	await upsertOne('test', query, 'count')
	const result = await findAll(query)
	console.assert(result)
	console.log(result)
}

export default async function test() {
	await initDb(configDb)
	await testSimpleUpsert()
	await close()
}

