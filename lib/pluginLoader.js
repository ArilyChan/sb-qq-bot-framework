var glob = require('glob'),
    path = require('path');
module.exports = (app) => {
    let plugins = glob.sync('./lib/plugins/*/index.js').map((file) => {
        try {
            return {
                file: path.resolve(file),
                module: require(path.resolve(file))
            }
        } catch(e) {
            console.log('unable to load plugin due to require error',path.resolve(file));
            return undefined
        }

    }).filter(module => module !== undefined);
    plugins.map(async ({ module: plugin, file }) => {

        try {
            plugin.apply(app, plugin.name)

        } catch (Error) {
            if (Error.name == 'TypeError') try {
                plugin(app, plugin.name)
            } catch (Error) {
                if (Error.name == 'TypeError') try {
                    plugin.default(app, plugin.name)
                } catch (Error) {
                    if (Error.name == 'TypeError') try {
                        plugin.default.apply(app, plugin.name)
                    } catch (Error) {
                        if (Error.name != 'TypeError') console.log(`unable to load plugin ${file}\n ${Error.stack}`);
                    }
                }
            }
            else console.log(`unable to load plugin ${file}\n ${Error.stack}`);
        } finally {
            console.log(`Load plugin: ${plugin.name || 'Unnamed'}`);
        }
    });
}