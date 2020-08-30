module.exports = (groupUser) => ({ postType, messageType, groupId, userId }, storage) => {
  if (!postType === 'message') return true
  if (!messageType === 'group') return true
  if (!groupUser[groupId]) return true
  return !groupUser[groupId].includes(userId)
}
