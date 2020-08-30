const isMessage = require('./isMessage')

module.exports = (meta) => isMessage(meta).then(res => res && meta.messageType === 'private')
