import testApi from '../test/api.js'
import testPages from '../test/pages.js'
import testCounter from '../test/counter.js'
import testDomains from '../test/domain.js'
import testSqlite from '../test/sqlite.js'
import {close} from '../lib/db/sqlite.js'

await testApi()
await testPages()
await testCounter()
await testDomains()
await testSqlite()
await close()

