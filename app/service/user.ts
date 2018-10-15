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

    async findById(id) {
        return this.ctx.model.User.findOne({
            where: {
                id: id,
                status: 1,
            },
            createdAt: false,
            updatedAt: false,
        });
    }

    async findByToken(token) {
        return this.ctx.model.User.findOne({
            where: {
                token: token,
                status: 1,
            },
            createdAt: false,
            updatedAt: false,
        });
    }

    async updateToken(id, token) {
        const user = await this.findById(id);
        user.token = token;
        return user.save();
    }
};
