const app = require('./lib/app');
const commands = require('./lib/commandLoader.js');
const plugins = require('./lib/pluginLoader.js');

commands(app);
plugins(app);
let count = 0;
let maxTries = 3;
try {
    while (count++ <= maxTries) {
        try {
            app.start()
        } catch (e) {
            console.log('⚠️Uncatched Exception!!');
            console.log(e.stack);
            if (count >= maxTries) throw e;
        }
    }
} catch(e){
	console.log('Max retries exceed. Quit now.');
	console.log(e)
}


// app.receiver.on('logger', (scope, message) => {
//     console.log({ scope, message });
// })