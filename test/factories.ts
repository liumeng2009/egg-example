'use strict';

import {factory} from 'factory-girl';

module.exports = (app: any) => {
    app.factory = factory;

    factory.define('user', app.model.User, {
        name: factory.sequence('User.name', (n) => `namne_${n}`),
        age: 18,
    });
}