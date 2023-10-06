import test from '../test/api.js'
import {close} from '../lib/db/mongo.js'

await test()
await close()

