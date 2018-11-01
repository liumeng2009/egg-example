import {Service} from 'egg';

export default class AuthOperateService extends Service {
    async findByCode(code) {
        return this.ctx.model.AuthOperate.findOne({
            where: {
                code: code,
            },
        });
    }
}
