import {Service} from 'egg';

export default class AuthFunctionService extends Service {
    async findByCode(code) {
        return this.ctx.model.AuthFunction.findOne({
            where: {
                code: code,
            },
        });
    }
}
