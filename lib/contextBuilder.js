class context {
    constructor(fn, description) {
        this.fn = fn;
        this.description = description;
    }
    getContextFromCtx(ctx) {
        return this.fn(ctx);
    }
}

function contextBuilder(fn, description = null) {
    return new context(fn, description);
}

module.exports = contextBuilder;