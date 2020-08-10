const path = require('path');
const appDir = path.dirname(require.main.filename);

const ContextBuilder = require(`${appDir}/lib/contextBuilder`);
const PluginLoader = require(`${appDir}/lib/Loader`);

const any = ContextBuilder((app) => app, 'any');
const allRelatives = ContextBuilder((app) => {
    const groupsCtx = app.groups.exclusive(922534281);
    const discussesCtx = app.discusses;
    const PMCtx = app.users;
    const baseCtx = groupsCtx.plus(discussesCtx);
    const anyRelatives = baseCtx.plus(PMCtx);
    return anyRelatives;
}, 'all relatives');
const friends = ContextBuilder((app) => app.users, 'all friends');
const mygroup = ContextBuilder((app) => app.group(792778662))
// const recorder = require(`${appDir}/Plugins/arily/recorder`);
// const storage = new recorder.Storage();
// const webView = recorder.webView(storage);

const test = [
    // {
    //     type: 'node_module',
    //     require: 'SillyResponseBot',
    //     path: 'Plugins/Exsper/SillyResponseBort',
    //     repo: 'Exsper/SillyResponseBot',
    //     priority: -10000,
    // },
    {
        type: 'local',
        path: 'Plugins/arily/BlackFarts',
        priority: 1,
    },
    // {
    //     type: 'local',
    //     path: 'Plugins/arily/recorder',
    //     subPlugin: 'slipper',
    //     priority: -1,
    // },
    // {
    //     type: 'local',
    //     path: 'Plugins/arily/recorder',
    //     subPlugin: 'recorder',
    //     priority: 9999,
    // },
];
const user = [
    // {
    //     type: 'local',
    //     path: 'Plugins/arily/test',
    //     options: {
    //         after: true,
    //     },
    //     priority: -1,
    // },
    // {
    //     type: 'local',
    //     path: 'Plugins/arily/test',
    //     options: {
    //         exclusive: 'after',
    //         after: false,
    //     },
    //     priority: 1,
    // }
    // {
    //     type: 'local',
    //     path: 'Plugins/arily/sbot-otsu',
    //     options: {},
    //     priority: 1,
    // }
]
module.exports = [
    {
        for: friends,
        use: new PluginLoader(user),
    },
    {
        for: any,
        use: test,
    },
]