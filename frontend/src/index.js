import { create } from './server.js';

// DEFAULT port for App Service is 8080
const port = process.env.WEB_PORT || 8080;

create()
    .then(app => {
        app.listen(port, () => {
            console.log(`Server has started on port ${port}!`);
        });
    }).catch(err => console.log(err));