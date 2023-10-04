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
		const userAgent = headers['user-agent']
		const device = this.getDevice(userAgent)
		this.stats = {country, ...device}
		const referer = headers['referer']
		if (!referer) {
			return
		}
		this.setReferer(referer)
	}

	getDay() {
		const timestamp = new Date()
		return timestamp.toISOString().substring(0, 10)
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

	setReferer(referer) {
		const url = new URL(referer)
		this.site = url.host
		this.page = url.pathname
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

