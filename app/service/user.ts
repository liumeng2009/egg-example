import {Service} from 'egg';

export default class UserService extends Service {
    async findByMobile(mobile) {
        return this.ctx.model.User.findOne({mobile: mobile, status: 1});
    }
};
