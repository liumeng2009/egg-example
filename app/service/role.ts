import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class RoleService extends Service {
    async index(payload) {
        let {page, pagesize} = payload;
        const {searchkey} = payload;
        if (!page) {
           page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        if (searchkey) {
           return this.ctx.model.Role.findAndCountAll ({
               where: {
                   name: {$regexp: searchkey},
                   status: 1,
               },
               order: [['createdAt', 'ASC']],
               offset: (page - 1) * pagesize,
               limit: pagesize,
           });
        }else {
            return this.ctx.model.Role.findAndCountAll ({
                where: {
                    status: 1,
                },
                order: [['createdAt', 'ASC']],
                offset: (page - 1) * pagesize,
                limit: pagesize,
            });
        }
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
        const roleResult = await this.findByName(payload.name);
        if (roleResult) {
            throw new ApiError(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, undefined);
        }
        return ctx.model.Role.create(payload);
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
}
