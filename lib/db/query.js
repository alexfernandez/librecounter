

export class SiteQuery {
	constructor(site, days) {
		this.site = site
		this.days = days
	}

	setLastDays(offset) {
		this.startDay = getDay(-offset)
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

export class PageQuery extends SiteQuery {
	constructor(site, page, days) {
		super(site, days)
		this.page = page
	}

	getQuery() {
		const query = super.getQuery()
		query.page = this.page
		return query
	}
}

export function getDay(diff) {
	const date = new Date()
	if (diff) {
		date.setDate(date.getDate() + diff)
	}
	return date.toISOString().substring(0, 10)
}

