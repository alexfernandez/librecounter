import {incrementFields} from './sqlite.js'
import {createReadStream} from 'fs'
import {createInterface} from 'readline'

let incrementCount = 0
let upsertCount = 0
let start = Date.now()


export async function migrateFrom(path) {
	await processLineByLine(`${path}/sites.json`, processSite)
	await processLineByLine(`${path}/pages.json`, processPage)
	const elapsed = (Date.now() - start) / 1000
	const incrementRate = incrementCount / elapsed
	const upsertRate = upsertCount / elapsed
	console.log(`${incrementCount} increments in ${elapsed.toFixed(0)} seconds, ${incrementRate.toFixed(0)} incs/second`)
	console.log(`${upsertCount} upserts in ${elapsed.toFixed(0)} seconds, ${upsertRate.toFixed(0)} ups/second`)
}

async function processLineByLine(file, processor) {
	const fileStream = createReadStream(file)

	const reader = createInterface({input: fileStream})

	for await (const line of reader) {
		processor(line)
	}
}

function processSite(line) {
	const {site, day, ...fields} = JSON.parse(line)
	const {fixedFields, fieldCount} = fixFields(fields)
	// console.log(site, day, fixedFields)
	incrementFields('sites', {site, day}, fixedFields)
	incrementCount += 1
	upsertCount += fieldCount
}

function processPage(line) {
	const {site, day, page, ...fields} = JSON.parse(line)
	const {fixedFields, fieldCount} = fixFields(fields)
	incrementFields('pages', {site, day, page}, fixedFields)
	incrementCount += 1
	upsertCount += fieldCount
}

function fixFields(fields) {
	const fixedFields = {}
	let fieldCount = 0
	for (const [key, value] of Object.entries(fields)) {
		if (key == '_id') {
			continue
		}
		if (typeof value == 'object') {
			const entries = Object.entries(value)
			if (entries.length > 1) {
				throw new Error(`Bad value for key ${key}: ${JSON.stringify(value)}`)
			}
			const entry = entries[0]
			const realKey = `${key}.${entry[0]}`
			fixedFields[realKey] = entry[1]
			console.log(`Fixed ${realKey}: ${entry[1]}`)
		} else {
			if (typeof value != 'number') {
				throw new Error(`Bad type ${typeof value} for key ${key}: ${value}`)
			}
			fixedFields[key] = value
		}
		fieldCount += 1
	}
	return {fixedFields, fieldCount}
}

