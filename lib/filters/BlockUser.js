module.exports = (...users) => ({ postType, userId }, storage) => {
  if (!postType === 'message') return true
  return !users.includes(userId)
}
