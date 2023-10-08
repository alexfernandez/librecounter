import testApi from '../test/api.js'
import testPages from '../test/pages.js'
import testCounter from '../test/counter.js'
import {close} from '../lib/db/mongo.js'

await testApi()
await testPages()
await testCounter()
await close()

