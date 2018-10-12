import {Service} from 'egg';

export default class UserService extends Service {
    async findByMobile(mobile) {
        return this.ctx.model.User.findOne({
            where: {
                mobile: mobile,
                status: 1,
            },
            createdAt: false,
            updatedAt: false,
        });
    }
};
