import {Service} from 'egg';

export default class AuthFunctionService extends Service {
    async findByCode(code, lang) {
        let functionAttrs;
        if (lang === 'en') {
            functionAttrs = [['name_en', 'name'], 'id', 'level'];
        } else {
            functionAttrs = ['name', 'id', 'level'];
        }
        return this.ctx.model.AuthFunction.findOne({
            attributes: functionAttrs,
            where: {
                code: code,
            },
        });
    }
}
