

export class Stats {
	constructor() {
		this.total = 0
		this.byDay = []
	}

	addDay(day, value) {
		this.byDay.push({day, value})
		this.total += value
	}

	addBySection(section, key, value) {
		if (!key) {
			return
		}
		if (typeof value == 'object') {
			// at one point the value was stored as an object due to a bug
			return
		}
		const name = 'by' + section.substring(0, 1).toUpperCase() + section.substring(1)
		if (!this[name]) {
			this[name] = {}
		}
		const bySection = this[name]
		if (typeof bySection != 'object') {
			// at one point it was stored as a number due to a bug
			return
		}
		bySection[key] = (bySection[key] || 0) + value
	}
}

