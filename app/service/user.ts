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

    async findByToken(token, device) {
        const userModel = this.ctx.model.User;
        let userSelect;
        if (device && device === 'webapp') {
            userSelect = {
                status: 1,
                webapptoken: token,
            };
        } else {
            userSelect = {
                status: 1,
                token: token,
            };
        }
        return userModel.findOne({
            where: userSelect,
        });
    }

    async findByTokenFull(token, device) {
        const userModel = this.ctx.model.User;
        const roleModel = this.ctx.model.Role;
        const AuthInRoleModel = this.ctx.model.AuthAuthInRole;
        const OpInFuncModel = this.ctx.model.AuthOpInFunc;
        const FunctionModel = this.ctx.model.AuthFunction;
        const OperateModel = this.ctx.model.AuthOperate;
        userModel.belongsTo(roleModel, {foreignKey : 'roleId'});
        roleModel.hasMany(AuthInRoleModel, {foreignKey: 'roleId'});
        AuthInRoleModel.belongsTo(OpInFuncModel, {foreignKey: 'authId'});
        OpInFuncModel.belongsTo(FunctionModel, {foreignKey: 'funcId'});
        OpInFuncModel.belongsTo(OperateModel, {foreignKey: 'opId'});
        let userSelect;
        if (device && device === 'webapp') {
            userSelect = {
                status: 1,
                webapptoken: token,
            };
        } else {
            userSelect = {
                status: 1,
                token: token,
            };
        }
        return userModel.findOne({
            where: userSelect,
            include : [
                {
                    model : roleModel,
                    include: [
                        {
                            model: AuthInRoleModel,
                            include: [
                                {
                                    model: OpInFuncModel,
                                    include: [
                                        {
                                            model: FunctionModel,
                                        },
                                        {
                                            model: OperateModel,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
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
    async changePassword(payload, token, device) {
        const {ctx, service} = this;
        if (!payload.new_password === payload.new_password_compare) {
            throw new ApiError(ApiErrorNames.PASSWORD_COMPARE_ERROR, undefined);
        }
        const userResult = await service.user.findByToken(token, device);
        if (!userResult) {
            throw new ApiError(ApiErrorNames.USER_ID_NOT_EXIST, undefined);
        }
        const verifyPsw = await ctx.compare(payload.old_password, userResult.password);
        if (!verifyPsw) {
            throw new ApiError(ApiErrorNames.OLD_PASSWORD_ERROR, undefined);
        }
        const hash = await ctx.genHash(payload.new_password, ctx.app.config.bcrypt.saltRounds)
        return userResult.update({password: hash});
    }
    async destroy(payload) {
        const {ctx} = this;
        const UserModel = ctx.model.User;
        let whereStr = {};
        if (payload instanceof Array && payload.length > 0) {
            for (const idObj of payload ) {
                if (idObj === 1) {
                    throw new ApiError(ApiErrorNames.ADMIN_CAN_NOT_DELETE, undefined);
                }
            }
            whereStr = {
                id: {$or : payload},
                status: 1,
            };
        } else {
            whereStr = {
                id: 0,
                status: 1,
            };
        }
        return UserModel.update({status: 0}, {
            where: whereStr,
        });
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
