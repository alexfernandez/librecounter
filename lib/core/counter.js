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
		const {site, page} = this.getReferer(headers)
		this.site = site
		this.page = page
		const {country} = this.lookupGeoip(ip, headers)
		const userAgent = headers['user-agent']
		const device = this.getDevice(userAgent)
		this.stats = {country, ...device}
	}

	getDay() {
		const timestamp = new Date()
		return timestamp.toISOString().substring(0, 10)
	}

	getDevice(userAgent) {
		const device = detector.detect(userAgent)
		return {
			type: device.device.type,
			os: device.os.name,
			platform: device.os.platform,
			browser: device.client.name,
		}
	}

	getReferer(headers) {
		const referer = headers['referer']
		if (!referer) {
			return {}
		}
		const url = new URL(referer)
		return {
			site: url.host,
			page: url.pathname,
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

