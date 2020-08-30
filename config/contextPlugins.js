const path = require('path')
const appDir = path.dirname(require.main.filename)

const filters = require('../lib/filters')

const ContextBuilder = require(`${appDir}/lib/contextBuilder`)
// const PluginLoader = require(`${appDir}/lib/Loader`)
// const Wrapper = require(`${appDir}/lib/Wrapper`)

module.exports = [
  {
    for: ContextBuilder((app) => app.users, 'all friends'),
    use: [] // new PluginLoader(user),
  },
  {
    for: ContextBuilder((app) => app, 'any'),
    use: [{
      type: 'local',
      path: 'Plugins/arily/BlackFarts',
      priority: 1,
      filter: [
        meta => filters.blockGroup(263668213)(meta).then(result => !(!result && ['吃啥', '吃什么', '吃什麼'].includes(meta.$parsed.message) && meta.$parsed.prefix !== null)).then(result => {
          if (!result) meta.$send('去别的群试试吧.')
          return result
        })
      ]
    }]
  }
]
