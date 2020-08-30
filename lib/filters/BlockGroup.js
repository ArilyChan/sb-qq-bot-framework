const isGroupMessage = require('./IsGroupMessage')
module.exports = (...groups) => (meta, storage) => isGroupMessage(meta).then(result => result && !groups.includes(meta.groupId))
