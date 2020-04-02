const { App } = require('koishi')

const app = new App({
    type: 'ws',
    port: 7070,
    server: 'http://10.80.0.2:6700',
    name: '小阿日',
    commandPrefix: ["!", "！"],
    logFilter: {
    	CabbageReaction: 3,
    }
    // selfId: 1840567854
    // 在这里加上其他配置信息
})
module.exports = app;
