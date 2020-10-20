const { App } = require('koishi')
require('koishi-adapter-cqhttp')
// const path = require('path');
// const appDir = path.dirname(require.main.filename);
// const config = require(`${appDir}/config`).koishi;

// const app = new App(config);
module.exports = (config) => new App(config)
