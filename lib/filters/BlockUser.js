const isMessage = require('./IsMessage')
module.exports = (...users) => (meta, storage) => isMessage(meta).then(result => result && !users.includes(meta.userId))
