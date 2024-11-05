

export class SiteQuery {
	constructor(site, days) {
		this.site = site
		this.days = days
	}

	getQuery() {
		const startDay = getDay(-this.days)
		const endDay = getDay(1)
		return {
			site: this.site,
			day: {
				$gt: startDay,
				$lt: endDay,
			}
			
		}
	}
}

export function getDay(diff) {
	const date = new Date()
	if (diff) {
		date.setDate(date.getDate() + diff)
	}
	return date.toISOString().substring(0, 10)
}

