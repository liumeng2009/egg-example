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

    async findByTokenFull(token) {
        const userModel = this.ctx.model.User;
        const roleModel = this.ctx.model.Role;
        userModel.belongsTo(roleModel, {foreignKey : 'roleId'});
        return this.ctx.model.User.findOne({
            where: {
                token: token,
                status: 1,
            },
            include : [
                {
                    model : roleModel,
                },
            ],
        });
    }

    async updateToken(id, token) {
        const user = await this.findById(id);
        user.token = token;
        return user.save();
    }
};
