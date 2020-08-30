const Loader = require('./Loader')

class ContextPluginApply {
  constructor (config, options) {
    this.config = config
    this.options = options
    this.webViews = []
  }

  apply (app) {
    this.config.map(ctx => {
      let loader
      if (ctx.use instanceof Loader) {
        loader = ctx.use
      } else {
        loader = new Loader(ctx.use)
      }
      console.info('install plugins for:', ctx.for.description)
      loader.installToContext(ctx.for.getContextFromCtx(app))
      this.webViews.push(...loader.webViews)
    })
  }
}

module.exports = (app, config) => {
  const Applier = new ContextPluginApply(config)
  Applier.apply(app)
  return Applier
}
