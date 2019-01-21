import {Service} from 'egg';

export default class AuthOperateService extends Service {
    async findByCode(code, lang) {
        let operationAttrs;
        if (lang === 'en') {
            operationAttrs = [['name_en', 'name'], 'id'];
        } else {
            operationAttrs = ['name', 'id'];
        }
        return this.ctx.model.AuthOperate.findOne({
            attributes: operationAttrs,
            where: {
                code: code,
            },
        });
    }
}
