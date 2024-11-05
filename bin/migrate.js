import {migrateFrom} from '../lib/db/migrate.js'
import {close} from '../lib/db/sqlite.js'

async function runMigration() {
	console.log(process.argv)
	if (process.argv.length != 3) {
		console.log('Migrate LibreCounter stats from MongoDB to SQLite')
		console.log('Usage: migrate [path], where [path] is where the backup files are.')
	}
	const path = process.argv[2]
	await migrateFrom(path)
	await close()
}

await runMigration()

