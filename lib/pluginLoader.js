var glob = require('glob')
var path = require('path')
const slugify = require('slugify')

function getPlugins (selector = './lib/plugins/*/index.js') {
  const plugins = glob
    .sync(selector)
    .map((file) => {
      try {
        return {
          config: { path: path.resolve(file) },
          module: require(path.resolve(file))
        }
      } catch (e) {
        console.log(
          'unable to load plugin due to require error',
          path.resolve(file)
        )
        return undefined
      }
    })
    .filter((module) => module !== undefined)
  return plugins
}
function usePlugins (app, plugins, logger = console) {
  const webViews = plugins
    .map(({ module: plugin, config } = {}) => {
      const file = config.file
      try {
        let expressApp
        let pluginData
        if (plugin.init) {
          pluginData = plugin.init(config.path, config.options)
        }
        if (plugin.webView) {
          expressApp = plugin.webView
          if (expressApp) logger.log('got web view for', plugin.name)
        }

        if (config.subPlugin && plugin[config.subPlugin]) { plugin[config.subPlugin].apply(app, config.options, pluginData) } else plugin.apply(app, config.options, pluginData)
        if (expressApp) {
          return {
            expressApp,
            options: config.options,
            pluginData,
            name: plugin.name,
            path: config.webPath ? config.webPath : `/${slugify(plugin.name)}`
          }
        }
      } catch (Error) {
        if (Error.name === 'TypeError') {
          try {
            plugin(app, config.options)
          } catch (Error) {
            if (Error.name === 'TypeError') {
              try {
                plugin.default(app, config.options)
              } catch (Error) {
                if (Error.name === 'TypeError') {
                  try {
                    let expressApp, pluginData
                    if (plugin.default.init) {
                      pluginData = plugin.default.init(
                        config.path,
                        config.options
                      )
                    }
                    if (plugin.default.webView) {
                      expressApp = plugin.default.webView(
                        config.options,
                        pluginData
                      )
                    }
                    if (config.subPlugin && plugin.default[config.subPlugin]) { plugin.default[config.subPlugin].apply(app, config.options, pluginData) } else plugin.default.apply(app, config.options, pluginData)
                    if (expressApp) return { expressApp, name: plugin.name }
                  } catch (Error) {
                    if (Error.name !== 'TypeError') {
                      logger.log(
                        `unable to load plugin ${file}\n ${Error.stack}`
                      )
                    }
                  }
                }
              }
            }
          }
        } else logger.log(`unable to load plugin ${file}\n ${Error.stack}`)
      } finally {
        logger.log(`Load plugin: ${plugin.name ? config.subPlugin === undefined ? plugin.name : `${plugin.name}(${plugin[config.subPlugin].name ? plugin[config.subPlugin].name : 'unnamed SubPlugin'})` : 'Unnamed'}`)
      }
    })
    .filter((V) => V)
  // console.log(webViews)
  return webViews
}
exports.default = (app) => {
  const plugins = getPlugins()
  usePlugins(plugins, app)
}
exports.getPlugins = getPlugins
exports.usePlugins = usePlugins
