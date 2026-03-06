

const cache = new Map()
const timeoutMs = 1000

class CacheEntry {
	constructor(value) {
		this.value = value
		this.expiration = Date.now() + timeoutMs
	}

	isExpired() {
		const now = Date.now()
		return (now > this.expiration)
	}
}

export function getCached(name, params) {
	const key = buildKey(name, params)
	const entry = cache.get(key)
	if (!entry || entry.isExpired()) {
		return null
	}
	return entry.value
}

export function setCached(name, params, value) {
	const key = buildKey(name, params)
	const entry = new CacheEntry(value)
	cache.set(key, entry)
}

function buildKey(name, params) {
	return `${name}-${JSON.stringify(params)}`
}

