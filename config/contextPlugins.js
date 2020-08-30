const path = require('path')
const appDir = path.dirname(require.main.filename)

// const filters = require('../lib/filters')

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
      filter: [(meta) => {
        if (!meta.messageType === 'group') return true
        const block = (meta.$parsed.prefix !== null) && meta.$parsed.message === '吃啥' && meta.groupId === 263668213
        if (block) meta.$send('去别的群试试吧.')
        return !block
      }]
    }]
  }
]
