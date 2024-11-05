import {app} from './setup.js'
import {getDay} from '../lib/db/stats.js'
import {site, userAgent} from './setup.js'

const path = '/mypage.fi'


async function testCounter() {
	await testCountPage(path)
	await testCountPage('/')
}

async function testCountPage(page) {
	const response = await app.inject({
		url: `/count?url=http://${site}${page}&userAgent=${userAgent}`,
		method: 'GET',
	})
	console.assert(response.statusCode == 200, 'could not count')
	const result = response.json()
	console.assert(result.ok, 'did not count')
}

async function testSiteStats() {
	const stats = await testFetchSiteStats(`/${site}/siteStats`)
	const day = getDay()
	const found = stats.byDay.filter(dayStats => dayStats.day == day)
	console.assert(found.length == 1, 'no data today')
	console.assert(found[0].value > 0, 'no value today')
	console.assert(stats.byPage[path], 'by page has no path')
}

async function testFetchSiteStats(url) {
	const response = await app.inject({
		url,
		method: 'GET',
		headers: {'user-agent': 'testbot/1.0'},
	})
	console.assert(response.statusCode == 200, 'could not stats')
	const stats = response.json()
	console.assert(stats.byDay, 'has no days')
	console.assert(Array.isArray(stats.byDay), 'byDay is not an array')
	console.assert(stats.byPage, 'has no pages')
	return stats
}

async function testLastDays() {
	const stats = await testFetchSiteStats(`/${site}/siteStats?days=1`)
	console.assert(stats.byDay.length == 1, 'should only have one day')
	const dayStats = stats.byDay[0]
	const day = getDay()
	console.assert(dayStats.day == day, 'should only have today')
	console.assert(dayStats.value > 0, 'no value today')
}

/**
 * With MongoDB values were cached.
 * With SQLite values are no longer cached, always fresh.
 */
async function testCache() {
	const cachedPath = '/cached'
	const day = getDay()
	const firstStats = await testFetchSiteStats(`/${site}/siteStats`)
	const firstFound = firstStats.byDay.filter(dayStats => dayStats.day == day)
	console.assert(firstFound.length == 1, 'no data today')
	console.assert(firstFound[0].value > 0, 'no value today')
	const firstPage = firstStats.byPage[cachedPath]
	console.assert(firstPage, 'cached first has no path')
	await testCountPage(cachedPath)
	const secondStats = await testFetchSiteStats(`/${site}/siteStats`)
	const secondFound = secondStats.byDay.filter(dayStats => dayStats.day == day)
	console.assert(secondFound.length == 1, 'no data today')
	console.assert(secondFound[0].value > 0, 'no value today')
	console.assert(secondStats.byPage[cachedPath], 'second by page has no path')
	console.assert(secondFound[0].value > firstFound[0].value, 'second day stats should increase')
	const secondPage = secondStats.byPage[cachedPath]
	console.assert(secondPage > firstPage, 'second page stats should increase')
	await sleep(1001)
	const thirdStats = await testFetchSiteStats(`/${site}/siteStats`)
	const thirdFound = thirdStats.byDay.filter(dayStats => dayStats.day == day)
	console.assert(thirdFound.length == 1, 'no data today')
	console.assert(thirdFound[0].value > 0, 'no value today')
	console.assert(thirdFound[0].value == firstFound[0].value + 1, 'expired day stats should increase')
	const thirdPage = thirdStats.byPage[cachedPath]
	console.assert(thirdPage == firstPage + 1, 'expired page stats should increase')
}

/**
 * Adapted from https://dev.to/codingwithadam/how-to-make-a-sleep-function-in-javascript-with-async-await-499b
 */
async function sleep(ms) {
	return new Promise((resolve) =>setTimeout(resolve, ms))
}

export default async function test() {
	await testCounter()
	await testSiteStats()
	await testLastDays()
	await testCache()
}

