import setup from '../lib/server/setup.js'
import Fastify from 'fastify'

export const site = 'test.com'
export const userAgent = 'testbot/1.0'


export const app = Fastify({logger: {level: 'error'}, transport: {target: 'pino-pretty'}})
setup(app)

