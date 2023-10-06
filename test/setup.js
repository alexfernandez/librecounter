import setup from '../lib/server/setup.js'
import Fastify from 'fastify'


export const app = Fastify({logger: {level: 'error'}, transport: {target: 'pino-pretty'}})
setup(app)

