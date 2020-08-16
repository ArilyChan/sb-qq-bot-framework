const path = require('path');
const appDir = path.dirname(require.main.filename);

const ContextBuilder = require(`${appDir}/lib/contextBuilder`);
const PluginLoader = require(`${appDir}/lib/Loader`);
// const Wrapper = require(`${appDir}/lib/Wrapper`)

module.exports = [
    {
        for: ContextBuilder((app) => app.users, 'all friends'),
        use: [] //new PluginLoader(user),
    },
    {
        for: ContextBuilder((app) => app, 'any'),
        use: [{
            type: 'local',
            path: 'Plugins/arily/BlackFarts',
            priority: 1,
            filter(meta){
                if (meta.userId == 1145141919) return false

                return true
            }
        }],
    },
]
