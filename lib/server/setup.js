import homePlugin from './home.js'
import pingPlugin from './ping.js'
import counterPlugin from './counter.js'
import statsPlugin from './stats.js'


export default function setup(app) {
	app.register(homePlugin)
	app.register(pingPlugin)
	app.register(counterPlugin)
	app.register(statsPlugin)
	app.log.info('plugins loaded')
	return app
}

