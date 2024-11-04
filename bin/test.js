import testApi from '../test/api.js'
import testPages from '../test/pages.js'
import testCounter from '../test/counter.js'
import testDomains from '../test/domain.js'
import {close} from '../lib/db/driver.js'

await testApi()
await testPages()
await testCounter()
await testDomains()
await close()

