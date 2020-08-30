module.exports = ({ postType, messageType, sender: { role } }, storage) => {
  if (!postType === 'message') return true
  if (!messageType === 'group') return true
  return ['owner', 'admin'].includes(role)
}
