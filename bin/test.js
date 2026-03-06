import testApi from '../test/api.js'
import testPages from '../test/pages.js'
import testCounter from '../test/counter.js'
import testHidden from '../test/hidden.js'
import testSqlite from '../test/sqlite.js'
import testDevices from '../test/device.js'
import {close} from '../db/sqlite.js'

await testApi()
await testPages()
await testCounter()
await testHidden()
await testSqlite()
await testDevices()
close()

