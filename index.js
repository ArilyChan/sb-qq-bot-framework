const path = require('path')
const appDir = path.dirname(require.main.filename)
const webServer = require('./lib/WebServer')

const config = require(`${appDir}/config`)
console.log(config)

const app = require('./lib/Bot')(config.koishi)

const pluginLoader = require('./lib/ContextPluginApply')
const Loaded = pluginLoader(app, config.contextPlugins)
// console.log(Loaded.webViews)
Loaded.webViews.map(v => {
  console.log(v.name, 'installed on', v.path)
  webServer.use(v.path, v.expressApp)
})
webServer.listen(3005, () => console.log('Example app listening on port 3005!'))

let count = 0
const maxTries = 3
try {
  while (count++ <= maxTries) {
    try {
      app.start()
    } catch (e) {
      console.log('⚠️Uncatched Exception!!')
      console.log(e.stack)
      if (count >= maxTries) throw e
    }
  }
} catch (e) {
  console.log('Max retries exceed. Quit now.')
  console.log(e)
}

// app.receiver.on('logger', (scope, message) => {
//     console.log({ scope, message });
// })
