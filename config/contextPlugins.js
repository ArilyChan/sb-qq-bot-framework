const path = require('path')
const appDir = path.dirname(require.main.filename)

const filters = require('../lib/filters')
// const recipeFilter = require('./filters/group.blackFarts.recipe')

const ContextBuilder = require(`${appDir}/lib/contextBuilder`)

module.exports = [
  {
    for: ContextBuilder((app) => app, 'any'),
    use: [
      // {
      //   type: 'local',
      //   path: 'Plugins/arily/BlackFarts',
      //   priority: 1
      // },
      // {
      //   type: 'local',
      //   path: 'Plugins/arily/recorder',
      //   subPlugin: 'recorder',
      //   priority: 9999,
      //   filter: _ => {
      //     console.log('record', _.message)
      //     return true
      //   }
      // },
      {
        type: 'local',
        path: 'Plugins/arily/recorder',
        // subPlugin: 'slipper',
        priority: -1,
        filter: [_ => {
          console.log('slip', _.message)
          return false
        }]
      }]
  }
]
