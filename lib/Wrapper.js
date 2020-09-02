// eslint-disable-next-line no-unused-vars
const asyncSome = async (arr, predicate) => {
  for (const e of arr) {
    if (await predicate(e)) return true
  }
  return false
}
const asyncEvery = async (arr, predicate) => {
  for (const e of arr) {
    if (!await predicate(e)) return false
  }
  return true
}
class RuntimeError extends Error {}
class PluginWrapper {
  constructor (plugin, { filter, prependFilter, subPlugin, ...others }) {
    this.plugin = plugin
    // this.realApply = plugin.apply.bind(plugin)
    this.filter = filter || (() => true)
    this.prependFilter = prependFilter || (() => true)
    this.realMiddleware = []
    this.realPrependMiddleware = []
    this.storage = undefined
    this.subPlugin = subPlugin
  }

  /** Mixin apps with wrapper
     *  @var app Koish_JS context or app
     *  @returns Fakeapp
     */
  app (app) {
    return Object.assign({
      middleware: (fn) => { this.realMiddleware.push(fn) },
      prependMiddleware: (fn) => { this.realPrependMiddleware.push(fn) }
    }, app)
  }

  /** Mixin apps with wrapper
     *  @var app Koish_JS context or app
     *  @var options options for plugin
     *  @var storage shared-state for sb extended web views
     *  @returns undefined
     */
  wrap (app, options, storage) {
    // console.log('inside wrap func')
    let realApply
    if (this.subPlugin && this.plugin[this.subPlugin]) realApply = this.plugin[this.subPlugin].apply.bind(this.plugin[this.subPlugin])
    else realApply = this.plugin.apply.bind(this.plugin)
    // if (!this.realApply) return
    this.storage = storage
    realApply(this.app(app), options, storage)
  }

  isFunction (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  }

  doFilter (filter, meta) {
    if (this.isFunction(filter)) return filter(meta, this.storage)
    if (!Array.isArray(filter)) throw new RuntimeError('Unknown filter type. function or Array required')
    // Array of filters
    return asyncEvery(filter, f => f(meta, this.storage))
  }

  filtering (meta) {
    return this.doFilter(this.filter, meta)
  }

  prependFiltering (meta) {
    return this.doFilter(this.prependFilter, meta)
  }

  async wrapperMiddleware (meta, next) {
    console.log('wrapped middleware filter')
    if (!await this.filtering(meta)) return next()
    this.realMiddleware.map(middleware => middleware(meta, next))
  }

  async wrapperPrependMiddleware (meta, next) {
    if (!await this.prependFiltering(meta)) return next()
    this.realPrependMiddleware.map(middleware => middleware(meta, next))
  }

  createWrappedPlugin () {
    const reloadedApplyFunction = (app, options, storage) => {
      try {
        this.wrap(app, options, storage)
      } catch (error) {
        console.log(error)
      }
      console.log('wrapped', this.plugin.name, this.subPlugin)
      if (this.realPrependMiddleware.length) app.prependMiddleware(this.wrapperPrependMiddleware.bind(this))
      if (this.realMiddleware.length) app.middleware(this.wrapperMiddleware.bind(this))
    }
    if (this.subPlugin && this.plugin[this.subPlugin]) this.plugin[this.subPlugin].apply = reloadedApplyFunction
    else this.plugin.apply = reloadedApplyFunction
    return this.plugin
  }
}

module.exports = (plugin, options) => new PluginWrapper(plugin, options).createWrappedPlugin()
