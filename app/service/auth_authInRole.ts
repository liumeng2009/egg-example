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
        // AuthInRoleModel.belongsTo(RoleModel, {foreignKey: 'roleId'});
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
/*        return AuthInRoleModel.findAll({
            include: [
                {
                    model: RoleModel,
                    where: {
                        id: roleId,
                    },
                },
                {
                    model: OpInFuncModel,
                },
            ],
        });*/
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
            if (auth.id === id) {
                return true;
            }
        }
        return false;
    }
}
