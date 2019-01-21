import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class AuthInRoleService extends Service {
    async index(roleId, lang) {
        const AuthOperateModel = this.ctx.model.AuthOperate;
        const AuthFunctionModel = this.ctx.model.AuthFunction;
        const OpInFuncModel = this.ctx.model.AuthOpInFunc;
        const AuthInRoleModel = this.ctx.model.AuthAuthInRole;
        const RoleModel = this.ctx.model.Role;
        OpInFuncModel.belongsTo(AuthOperateModel, {foreignKey: 'opId'});
        OpInFuncModel.belongsTo(AuthFunctionModel, {foreignKey: 'funcId'});
        RoleModel.hasMany(AuthInRoleModel, {foreignKey: 'roleId'});
        AuthInRoleModel.belongsTo(OpInFuncModel, {foreignKey: 'authId'});

        let functionAttrs;
        let operationAttrs;
        if (lang === 'en') {
            functionAttrs = [['name_en', 'name'], 'id', 'level'];
            operationAttrs = [['name_en', 'name'], 'id'];
        } else {
            functionAttrs = ['name', 'id', 'level'];
            operationAttrs = ['name', 'id'];
        }
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
                                    attributes: operationAttrs,
                                },
                                {
                                    model: AuthFunctionModel,
                                    attributes: functionAttrs,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    // 数据结构规整为webapp需要的格式
    async clientUse(roleId, lang) {
        const result: any[] = [];
        const roleRes = await this.service.authAuthInRole.index(roleId, lang);

        const allRes = await this.service.authOpInFunc.index(lang);
        const auths = roleRes ? roleRes.auth_authInRoles : [];
        // 规整allRes 第一层功能项
        for (const res of allRes) {
            const ops: any[] = [];
            for (const ro of res.auth_opInFuncs) {
                console.log(ro.auth_operate.name);
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
                level: res.level,
                ops: ops,
            };
            result.push(r);
        }
        return result;
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
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, ctx.__(ApiErrorNames.ROLE_ID_NOT_EXIST));
        }
        const opInfuncResult = await service.authOpInFunc.findById(payload.authId);
        if (!opInfuncResult) {
            throw new ApiError(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, ctx.__(ApiErrorNames.OP_IN_FUNC_NOT_EXIST));
        }
        const authResult = await this.show(payload.roleId, payload.authId);
        if (authResult) {
            throw new ApiError(ApiErrorNames.AUTH_EXIST, ctx.__(ApiErrorNames.AUTH_EXIST));
        }
        return ctx.model.AuthAuthInRole.create(payload);
    }
    async destroy(payload) {
        const {service, ctx} = this;
        if (payload.roleId === 1) {
            throw new ApiError(ApiErrorNames.ADMIN_AUTH_CAN_NOT_DELETE,
                ctx.__(ApiErrorNames.ADMIN_AUTH_CAN_NOT_DELETE));
        }
        const roleResult = await service.role.findById(payload.roleId);
        if (!roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, ctx.__(ApiErrorNames.ROLE_ID_NOT_EXIST));
        }
        const opInfuncResult = await service.authOpInFunc.findById(payload.authId);
        if (!opInfuncResult) {
            throw new ApiError(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, ctx.__(ApiErrorNames.OP_IN_FUNC_NOT_EXIST));
        }
        const authResult = await this.show(payload.roleId, payload.authId);
        if (!authResult) {
            throw new ApiError(ApiErrorNames.AUTH_NOT_EXIST, ctx.__(ApiErrorNames.OP_IN_FUNC_NOT_EXIST));
        }
        return authResult.destroy();
    }
    async check(func, op, token, device, lang) {
        const { ctx , service} = this;
        await service.userAccess.checkToken(token, device);
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
        const functionResult = await service.authFunction.findByCode(func, lang);
        if (!functionResult) {
            throw new ApiError(ApiErrorNames.AUTH_FUNCTION_NOT_EXIST, ctx.__(ApiErrorNames.AUTH_FUNCTION_NOT_EXIST));
        }
        const operateReulst = await service.authOperate.findByCode(op, lang);
        if (!operateReulst) {
            throw new ApiError(ApiErrorNames.AUTH_OPERATE_NOT_EXIST, ctx.__(ApiErrorNames.AUTH_OPERATE_NOT_EXIST));
        }
        // 验证权限
        const authResult = await AuthInRoleModel.findAll({
            include: [
                {
                    model: OpInFuncModel,
                    required: true,
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
            let noAuthStr = '';
            if (lang === 'en') {
                noAuthStr = functionResult.name + ' ' + operateReulst.name + 'privilege';
            } else {
                noAuthStr = functionResult.name + '的' + operateReulst.name + '权限';
            }
            throw new ApiError(ApiErrorNames.NO_AUTH, ctx.__(ApiErrorNames.NO_AUTH, noAuthStr));
        }
    }
}
