

export class DayQuery {
	constructor(site) {
		this.site = site
		this.setStartDay(-31)
		this.setEndDay(1)
	}

	setStartDay(diff) {
		this.startDay = getDay(diff)
	}

	setEndDay(diff) {
		this.endDay = getDay(diff)
	}

	getQuery() {
		return {
			site: this.site,
			day: {
				$gt: this.startDay,
				$lt: this.endDay,
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

