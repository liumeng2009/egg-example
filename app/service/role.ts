import {Service} from 'egg';

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
}
