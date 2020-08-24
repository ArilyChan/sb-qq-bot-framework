class PluginWrapper {
    constructor(plugin, { filter, prependFilter, ...others }) {
        this.plugin = plugin
        this.realApply = plugin.apply.bind(plugin)
        this.filter = filter || (() => true)
        this.prependFilter = prependFilter || (() => true)
        this.realMiddleware = undefined
        this.realPrependMiddleware = undefined
    }

    /** Mixin apps with wrapper
     *  @var app Koish_JS context or app
     *  @returns Fakeapp
     */
    app(app) {
        return Object.assign({
            middleware: (fn) => this.realMiddleware = fn,
            prependMiddleware: (fn) => this.realPrependMiddleware = fn,
        }, app)
    }

    /** Mixin apps with wrapper
     *  @var app Koish_JS context or app
     *  @var options options for plugin
     *  @var storage shared-state for sb extended web views
     *  @returns undefined
     */
    wrap(app, options, storage) {
        if (!this.realApply) return
        this.realApply(this.app(app), options, storage)
    }

    async wrapperMiddleware(meta, next) {
        if (!await this.filter(meta)) return next()
        this.realMiddleware(meta, next)
    }

    async wrapperPrependMiddleware(meta, next) {
        if (!await this.prependFilter(meta)) return next()
        this.realPrependMiddleware(meta, next)
    }

    createWrappedPlugin() {
        const reloadedApplyFunction = (app, options, storage) => {
            this.wrap(app, options, storage)
            if (this.realPrependMiddleware) app.prependMiddleware(this.wrapperPrependMiddleware.bind(this))
            if (this.realMiddleware) app.middleware(this.wrapperMiddleware.bind(this))
        }
        this.plugin.apply = reloadedApplyFunction
        return this.plugin
    }
}

module.exports = (plugin, options) => new PluginWrapper(plugin, options).createWrappedPlugin()