import geoip from 'geoip-lite'
import DeviceDetector from 'node-device-detector'

const detector = new DeviceDetector({
	clientIndexes: true,
	deviceIndexes: true,
	deviceAliasCode: false,
})


export class Counter {
	constructor(ip, headers) {
		this.day = this.getDay()
		const {country} = this.lookupGeoip(ip, headers)
		this.stats = {country}
		const referer = headers['referer']
		this.setReferer(referer)
		const userAgent = headers['user-agent']
		this.setUserAgent(userAgent)
	}

	getDay() {
		const timestamp = new Date()
		return timestamp.toISOString().substring(0, 10)
	}

	setReferer(referer) {
		if (!referer) {
			return
		}
		const url = new URL(referer)
		this.site = url.host
		this.page = url.pathname
	}

	setUserAgent(userAgent) {
		if (!userAgent) {
			return
		}
		const device = this.getDevice(userAgent)
		// transfer to stats
		for (const key in device) {
			this.stats[key] = device[key]
		}
	}

	getDevice(userAgent) {
		if (!device) {
			return null
		}
		const device = detector.detect(userAgent)
		return {
			type: device.device.type,
			os: device.os.name,
			platform: device.os.platform,
			browser: device.client.name,
		}
	}

	lookupGeoip(ip, headers) {
		if (ip != '127.0.0.1') {
			return geoip.lookup(ip)
		}
		const realIp = headers['x-real-ip']
		if (!realIp) {
			return {}
		}
		return geoip.lookup(realIp)
	}
}

