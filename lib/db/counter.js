import {incrementFields} from './sqlite.js'
import {isDomainHidden} from '../core/domain.js'
import {encodePage} from '../core/format.js'


export async function storeCounter(counter) {
	if (!counter.site || !counter.page) {
		console.log('Missing site or page')
		return
	}
	if (isDomainHidden(counter.site)) {
		console.log(`Domain ${counter.site} is hidden`)
		return
	}
	const update = {total: 1}
	for (const field in counter.stats) {
		const value = counter.stats[field]
		if (value) {
			const key = `${field}:${value}`
			update[key] = 1
		}
	}
	const page = encodePage(counter.page)
	const pageKey = `page:${page}`
	const updateWithPage = {...update, [pageKey]: 1}
	await incrementFields('sites', {site: counter.site, day: counter.day}, updateWithPage)
	await incrementFields('pages', {site: counter.site, day: counter.day, page: counter.page}, update)
}

