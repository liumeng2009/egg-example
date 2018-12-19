import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class RoleService extends Service {
    async index(payload, lang) {
        let {page, pagesize} = payload;
        const {searchkey} = payload;
        let whereOBj = {};
        if (searchkey) {
            whereOBj = {status: 1, name: {$regexp: searchkey}};
        } else {
            whereOBj = {status: 1};
        }
        if (!page) {
           page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        let attrs;
        if (lang === 'en') {
            attrs = [['name_en', 'name'], 'id'];
        } else {
            attrs = ['name', 'id'];
        }
        return this.ctx.model.Role.findAndCountAll ({
            attributes: attrs,
            where: whereOBj,
            order: [['createdAt', 'ASC']],
            offset: (page - 1) * pagesize,
            limit: pagesize,
        });
    }

    async findByName(name, lang) {
        if (lang === 'en') {
            return this.ctx.model.Role.findOne({
                where: {
                    name_en: name,
                },
            });
        } else {
            return this.ctx.model.Role.findOne({
                where: {
                    name: name,
                },
            });
        }

    }

    async findById(id) {
        return this.ctx.model.Role.findOne({
            where: {
                id: id,
                status: 1,
            },
        });
    }

    async show(id, lang) {
        let attrs;
        if (lang === 'en') {
            attrs = [['name_en', 'name'], 'id', ['remark_en', 'remark']];
        } else {
            attrs = ['name', 'id', 'remark'];
        }
        return this.ctx.model.Role.findOne({
            attributes: attrs,
            where: {
                id: id,
                status: 1,
            },
        });
    }

    async create(payload, lang) {
        const {ctx} = this;
        if (!payload.role.name || payload.role.name === '') {
            throw new ApiError(ApiErrorNames.ROLE_NAME_CAN_NOT_NULL, ctx.__(ApiErrorNames.ROLE_NAME_CAN_NOT_NULL));
        }
        const roleResult = await this.findByName(payload.role.name, lang);
        if (roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, ctx.__(ApiErrorNames.ROLE_NAME_MUST_UNIQUE));
        }

        // 根据语言 改变payload数据
        if (lang === 'en') {
            payload.role.name_en = payload.role.name;
            payload.role.remark_en = payload.role.remark;
            payload.role.name = '';
            payload.role.remark = '';
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
            throw new ApiError(ApiErrorNames.ROLE_SAVE_FAILED, ctx.__(ApiErrorNames.ROLE_SAVE_FAILED, err));
        }
    }

    async update(payload, lang) {
        const {ctx} = this;
        const roleResultId = await this.findById(payload.id);
        if (!roleResultId) {
            throw new ApiError(ApiErrorNames.ROLE_ID_NOT_EXIST, ctx.__(ApiErrorNames.ROLE_ID_NOT_EXIST));
        }
        const roleResultName = await this.findByName(payload.name, lang);
        if (roleResultName && roleResultName.id !== payload.id) {
            throw new ApiError(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, ctx.__(ApiErrorNames.ROLE_NAME_MUST_UNIQUE));
        }
        // 根据语言改变数据
        if (lang === 'en') {
            payload.name_en = payload.name;
            payload.remark_en = payload.remark;
            payload.name = roleResultId.name;
            payload.remark = roleResultId.remark;
        }
        console.log(payload);
        return roleResultId.update(payload);
    }

    async destroy(payload) {
        const {ctx} = this;
        const RoleModel = ctx.model.Role;
        let whereStr = {};
        if (payload instanceof Array && payload.length > 0) {
            for (const idObj of payload ) {
                if (idObj === 1) {
                    throw new ApiError(ApiErrorNames.ROLE_CAN_NOT_DELETE, ctx.__(ApiErrorNames.ROLE_CAN_NOT_DELETE));
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
