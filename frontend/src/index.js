import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


import { create } from './server.js';

// Listening port for App Service should be set to WEB_PORT for Linux container and PORT for Windows native
const port = process.env.WEB_PORT || process.env.PORT || 8080;

create()
    .then(app => {
        app.listen(port, () => {
            console.log(`frontend index.js Server has started on port ${port}!`);
        });
    }).catch(err => console.log(`frontend index.js: ${JSON.stringify(err)}`));