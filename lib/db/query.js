
const defaultStartDay = -31

export class DayQuery {
	constructor(site) {
		this.site = site
		this.startDay = getDay(defaultStartDay)
		this.endDay = getDay(1)
	}

	setLastDays(offset) {
		this.startDay = getDay(-offset)
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

