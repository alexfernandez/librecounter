import {createCounter} from '../core/counter.js'
import DeviceDetector from 'node-device-detector'

const detector = new DeviceDetector({
	clientIndexes: true,
	deviceIndexes: true,
	deviceAliasCode: false,
})
const realUserAgents = {
	chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
	firefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
	iPhone: 'Mozilla/5.0 (iPhone; CPU OS 16_3_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) 1Password/7.9.6 (like Version/16.3.1 Mobile/20D67 Safari/600.1.4)',
}
const botUserAgents = {
	googleBot: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Vers  ion/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html',
	yandexBot: 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
	bingBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36',
	baiduSpider: 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
}
const libraryUserAgents = {
	curlBot: 'curl/7.54.1',
	jakartaCommons: 'Jakarta Commons-HttpClient/3.0.1',
}


async function testDeviceDetector() {
	for (const key in realUserAgents) {
		const userAgent = realUserAgents[key]
		const {bot} = detect(userAgent)
		console.assert(!bot.name, `should not detect ${key} as bot`)
	}
	for (const key in botUserAgents) {
		const userAgent = botUserAgents[key]
		const {bot} = detect(userAgent)
		console.assert(bot.name, `should detect ${key} as bot`)
	}
	for (const key in libraryUserAgents) {
		const userAgent = libraryUserAgents[key]
		const {device, bot} = detect(userAgent)
		console.assert(!bot.name, `should not detect ${key} as bot`)
		console.assert(device.client.type == 'library', `should detect ${key} as library`)
	}
}

function detect(userAgent) {
	const device = detector.detect(userAgent)
	const bot = detector.parseBot(userAgent)
	return {device, bot}
}

async function testCounters() {
	for (const key in realUserAgents) {
		const counter = getCounter(realUserAgents[key])
		console.assert(counter.stats.os != 'bot', `should not detect ${key} as bot`)
		console.assert(counter.stats.os != 'library', `should not detect ${key} as library`)
	}
	for (const key in botUserAgents) {
		const counter = getCounter(botUserAgents[key])
		console.assert(counter.stats.os == 'bot', `should detect ${key} as bot`)
	}
	for (const key in libraryUserAgents) {
		const counter = getCounter(libraryUserAgents[key])
		console.assert(counter.stats.os == 'library', `should detect ${key} as library`)
	}
}

function getCounter(userAgent) {
	const headers = {
		'user-agent': userAgent,
	}
	return createCounter('127.0.0.1', headers)
}

export default async function test() {
	await testDeviceDetector()
	await testCounters()
}

