import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class RoleService extends Service {
    async index(payload) {
        let {page, pagesize} = payload;
        const {searchkey} = payload;
        let whereOBj = {};
        if (searchkey) {
            whereOBj = {status: 1, name: {$regexp: searchkey}};
        } else {
            whereOBj = {status: 1};
        }
        if (page === 0 && pagesize === 0) {
            return this.ctx.model.Role.findAndCountAll ({
                where: whereOBj,
                order: [['createdAt', 'ASC']],
            });
        }
        if (!page) {
           page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        return this.ctx.model.Role.findAndCountAll ({
           where: whereOBj,
           order: [['createdAt', 'ASC']],
           offset: (page - 1) * pagesize,
           limit: pagesize,
        });
    }

    async findByName(name) {
        return this.ctx.model.Role.findOne({
            where: {
                name: name,
            },
        });
    }

    async findById(id) {
        return this.ctx.model.Role.findOne({
            where: {
                id: id,
                status: 1,
            },
        });
    }

    async create(payload) {
        const {ctx} = this;
        if (!payload.role.name || payload.role.name === '') {
            throw new ApiError(ApiErrorNames.ROLE_NAME_CAN_NOT_NULL, undefined);
        }
        const roleResult = await this.findByName(payload.role.name);
        if (roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, undefined);
        }

        const t = await ctx.model.transaction();
        // return ctx.model.Role.create(payload.role);
        try {
            const roleResult = await ctx.model.Role.create(payload.role, {transaction: t});
            const authArray: any[] = [];
            for (const auth of payload.auths) {
                const authPer = {authId: auth, roleId: roleResult.id};
                authArray.push(authPer);
            }
            console.log(authArray);
            await ctx.model.AuthAuthInRole.bulkCreate(authArray, {transaction: t});
            return await t.commit();
        } catch (err) {
            t.rollback();
            throw new ApiError(ApiErrorNames.ROLE_SAVE_FAILED, [err.message]);
        }
    }

    async update(payload) {
        const roleResultId = await this.findById(payload.id);
        if (!roleResultId) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, undefined);
        }
        const roleResultName = await this.findByName(payload.name);
        if (roleResultName && roleResultName.id !== payload.id) {
            throw new ApiError(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, undefined);
        }
        return roleResultId.update(payload);
    }

    async destroy(payload) {
        const {ctx} = this;
        const RoleModel = ctx.model.Role;
        let whereStr = {};
        if (payload instanceof Array && payload.length > 0) {
            for (const idObj of payload ) {
                if (idObj === 1) {
                    throw new ApiError(ApiErrorNames.ROLE_CAN_NOT_DELETE, undefined);
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
        return RoleModel.update({status: 0}, {
            where: whereStr,
        });
    }
}
