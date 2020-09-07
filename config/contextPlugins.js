const path = require('path')
const appDir = path.dirname(require.main.filename)

// const filters = require('../lib/filters')
// const recipeFilter = require('./filters/group.blackFarts.recipe')

const ContextBuilder = require(`${appDir}/lib/contextBuilder`)

module.exports = [
  {
    for: ContextBuilder((app) => app, 'any'),
    use: []
  }
]
