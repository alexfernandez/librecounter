import Fastify from 'fastify'
import setup from '../server/setup.js'


async function start() {
	const app = Fastify({
		logger: {
			level: 'info',
		},
	})
	try {
		await setup(app)
		await app.listen({port: 11893, host: '0.0.0.0'})
	} catch (error) {
		app.log.error(error)
		process.exit(1)
	}
}

start()

