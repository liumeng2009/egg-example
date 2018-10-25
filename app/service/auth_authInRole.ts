import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class AuthInRoleService extends Service {
    async index(roleId) {
        const AuthOperateModel = this.ctx.model.AuthOperate;
        const AuthFunctionModel = this.ctx.model.AuthFunction;
        const OpInFuncModel = this.ctx.model.AuthOpInFunc;
        const AuthInRoleModel = this.ctx.model.AuthAuthInRole;
        const RoleModel = this.ctx.model.Role;
        OpInFuncModel.belongsTo(AuthOperateModel, {foreignKey: 'opId'});
        OpInFuncModel.belongsTo(AuthFunctionModel, {foreignKey: 'funcId'});
        RoleModel.hasMany(AuthInRoleModel, {foreignKey: 'roleId'});
        AuthInRoleModel.belongsTo(OpInFuncModel, {foreignKey: 'authId'});
        return RoleModel.findOne ({
            where: {
                id: roleId,
            },
            include: [
                {
                    model: AuthInRoleModel,
                    include: [
                        {
                            model: OpInFuncModel,
                            include: [
                                {
                                    model: AuthOperateModel,
                                },
                                {
                                    model: AuthFunctionModel,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    // 数据结构规整为webapp需要的格式
    async clientUse(roleId) {
        const result: any[] = [];
        const roleRes = await this.service.authAuthInRole.index(roleId);
        if (!roleRes) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, undefined);
        }
        const allRes = await this.service.authOpInFunc.index();
        const auths = roleRes.auth_authInRoles;
        // 规整allRes 第一层功能项
        for (const res of allRes) {
            if (res.class === 0) {
                const ops: any[] = [];
                for (const ro of res.auth_opInFuncs) {
                    const op = {
                        label: ro.auth_operate.name,
                        value: ro.id,
                        checked: this.findAuthInRole(ro.id, auths),
                    };
                    ops.push(op);
                }

                const r = {
                    id: res.id,
                    name: res.name,
                    ops: ops,
                    children: [],
                };
                result.push(r);
            }
        }
        // 第二层功能项
        for (const res of allRes) {
            if (res.class === 1) {
                const belong = res.belong;
                const parent = this.findFunctionParent(belong, result);
                if (parent) {
                    const opsChild: any[] = [];
                    for (const ro of res.auth_opInFuncs) {
                        const op = {
                            label: ro.auth_operate.name,
                            value: ro.id,
                            checked: this.findAuthInRole(ro.id, auths),
                        };
                        opsChild.push(op);
                    }
                    const rChild = {
                        id: res.id,
                        name: res.name,
                        ops: opsChild,
                    };
                    parent.children.push(rChild);
                }
            }
        }
        return result;
    }
    findFunctionParent(belong, res) {
        for (const r of res) {
            if (belong === r.id) {
                return r;
            }
        }
        return false;
    }
    findAuthInRole(id, auths) {
        for (const auth of auths) {
            if (auth.auth_opInFunc.id === id) {
                return true;
            }
        }
        return false;
    }
    async show(roleId, authId) {
        const {ctx} = this;
        return await ctx.model.AuthAuthInRole.findOne({
            where: {
                roleId: roleId,
                authId: authId,
            },
        });
    }
    async create(payload) {
        const {ctx, service} = this;
        const roleResult = await service.role.findById(payload.roleId);
        if (!roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, undefined);
        }
        const opInfuncResult = await service.authOpInFunc.findById(payload.authId);
        if (!opInfuncResult) {
            throw new ApiError(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, undefined);
        }
        const authResult = await this.show(payload.roleId, payload.authId);
        if (authResult) {
            throw new ApiError(ApiErrorNames.AUTH_EXIST, undefined);
        }
        return ctx.model.AuthAuthInRole.create(payload);
    }
    async destroy(payload) {
        const {service} = this;
        if (payload.roleId === 1) {
            throw new ApiError(ApiErrorNames.ADMIN_AUTH_CAN_NOT_DELETE, undefined);
        }
        const roleResult = await service.role.findById(payload.roleId);
        if (!roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, undefined);
        }
        const opInfuncResult = await service.authOpInFunc.findById(payload.authId);
        if (!opInfuncResult) {
            throw new ApiError(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, undefined);
        }
        const authResult = await this.show(payload.roleId, payload.authId);
        if (!authResult) {
            throw new ApiError(ApiErrorNames.AUTH_NOT_EXIST, undefined);
        }
        return authResult.destroy();
    }
    async check(func, op, token, device) {
        console.log('走这里');
        const { ctx } = this;
        const AuthInRoleModel = ctx.model.AuthAuthInRole;
        const OpInFuncModel = ctx.model.AuthOpInFunc;
        AuthInRoleModel.belongsTo(OpInFuncModel, {foreignKey: 'authId'});
        const FuncModel = ctx.model.AuthFunction;
        const OperateModel = ctx.model.AuthOperate;
        OpInFuncModel.belongsTo(FuncModel, {foreignKey: 'funcId'});
        OpInFuncModel.belongsTo(OperateModel, {foreignKey: 'opId'});
        const RoleModel = ctx.model.Role;
        AuthInRoleModel.belongsTo(RoleModel, {foreignKey: 'roleId'});
        const UserModel = ctx.model.User;
        // UserModel.belongsTo(RoleModel, {foreignKey: 'roleId'});
        RoleModel.hasMany(UserModel, {foreignKey: 'roleId'});
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
        // 验证权限
        const authResult = await AuthInRoleModel.findAll({
            include: [
                {
                    model: OpInFuncModel,
                    include: [
                        {
                            model: FuncModel,
                            where: {
                                code: func,
                            },
                        },
                        {
                            model: OperateModel,
                            where: {
                                code: op,
                            },
                        },
                    ],
                },
                {
                    model: RoleModel,
                    required: true,
                    include: [
                        {
                            model: UserModel,
                            where: userSelect,
                        },
                    ],
                },
            ],
        });
        if (authResult.length > 0) {
            return authResult;
        } else {
            throw new ApiError(ApiErrorNames.NO_AUTH, undefined);
        }
    }
}
