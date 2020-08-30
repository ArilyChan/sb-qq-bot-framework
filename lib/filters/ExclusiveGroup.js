module.exports = (...groups) => ({ postType, messageType, groupId }, storage) => {
  if (!postType === 'message') return true
  if (!messageType === 'group') return true
  return !groups.includes(groupId)
}
