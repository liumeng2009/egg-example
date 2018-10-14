'use strict'

/*import {Service} from 'egg';

export class ActionTokenService extends Service {
    async apply(str) {
        const {ctx} = this;
        return ctx.app.jwt.sign({
            data: {
                id: str,
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
        }, ctx.app.config.jwt.secret);
    }
}*/

module.exports = (app) => {
    return class ActionTokenService extends app.Service {
        async apply(id, mobile, realname) {
            return app.jwt.sign({
                data: {
                    id: id,
                    mobile: mobile,
                    realname: realname,
                },
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
            }, app.config.jwt.secret);
        }
    };
}
