import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';
import * as fs from 'fs';

export default class UserService extends Service {
    async findByMobile(mobile) {
        return this.ctx.model.User.findOne({
            where: {
                mobile: mobile,
                status: 1,
            },
        });
    }

    async findById(id) {
        return this.ctx.model.User.findOne({
            where: {
                id: id,
                status: 1,
            },
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

    async index(payload) {
        let {page, pagesize} = payload;
        const {searchkey, roles} = payload;
        const userModel = this.ctx.model.User;
        const roleModel = this.ctx.model.Role;
        userModel.belongsTo(roleModel, {foreignKey: 'roleId'})
        if (!page) {
            page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        let roleWhere = {};
        if (roles instanceof Array && roles.length > 0) {
            roleWhere = {
                id: {$or : roles},
                status: 1,
            };
        } else {
            roleWhere = {status: 1};
        }
        let userWhere = {};
        if (searchkey) {
            userWhere = {status: 1, realname: {$regexp: searchkey}};
        } else {
            userWhere = {status: 1};
        }
        return userModel.findAndCountAll ({
            where: userWhere,
            include: [
                {
                    model: roleModel,
                    where: roleWhere,
                },
            ],
            order: [['createdAt', 'ASC']],
            offset: (page - 1) * pagesize,
            limit: pagesize,
        });
    }

    async create(payload) {
        const {ctx} = this;
        const userResult = await this.findByMobile(payload.mobile);
        if (userResult) {
            throw new ApiError(ApiErrorNames.USER_MOBILE_MUST_UNIQUE, undefined);
        }
        const hash = await ctx.genHash(payload.password, ctx.app.config.bcrypt.saltRounds)
        payload.password = hash;
        return ctx.model.User.create(payload);
    }

    async update(payload) {
        const {ctx} = this;
        const userResultId = await this.findById(payload.id);
        if (!userResultId) {
            throw new ApiError(ApiErrorNames.USER_ID_NOT_EXIST, undefined);
        }
        const userResultMobile = await this.findByMobile(payload.mobile);
        if (userResultMobile && userResultMobile.id !== payload.id) {
            throw new ApiError(ApiErrorNames.USER_MOBILE_MUST_UNIQUE, undefined);
        }
        if (userResultId.password === payload.password) {
            // 说明没有改密码 保持不变
        } else {
            // 需要重置密码
            const hash = await ctx.genHash(payload.password, ctx.app.config.bcrypt.saltRounds)
            payload.password = hash;
        }
        return userResultId.update(payload);
    }
    async destroy(id) {
        const userResult = await this.findById(id);
        if (!userResult) {
            throw new ApiError(ApiErrorNames.USER_ID_NOT_EXIST, undefined);
        }
        if (id === 1) {
            throw new ApiError(ApiErrorNames.ADMIN_CAN_NOT_DELETE, undefined);
        }
        return userResult.update({status: 0});
    }

    async sysAvatars() {
        const baseDir = this.ctx.app.baseDir;
        const sysAvatarFolder = baseDir + '/app/public/uploads/avatar';
        const avatarArray: any[] = [];
        const folders = fs.readdirSync(sysAvatarFolder);
        for (const f of folders){
            const perFolder = sysAvatarFolder + '/' + f;
            const files = fs.readdirSync(perFolder);

            for (let i = 0; i < files.length; i++) {
                files[i] = '/public/uploads/avatar/' + f + '/' + files[i];
            }

            const fObj = {
                name: f,
                imgs: files,
            };
            avatarArray.push(fObj);
        }
        return avatarArray;
    }
};
