import {Service} from 'egg';

export default class ArticleService extends Service {
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
            return this.ctx.model.Article.findAndCountAll ({
                where: whereOBj,
                order: [
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
            });
        }
        if (!page) {
            page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        return this.ctx.model.Article.findAndCountAll ({
            where: whereOBj,
            order: [
                ['sort', 'ASC'],
                ['publishAt', 'DESC'],
            ],
            offset: (page - 1) * pagesize,
            limit: pagesize,
        });
    }
    async findById(id) {
        return this.ctx.model.Article.findOne({
            where: {
                status: 1,
                id: id,
            },
        });
    }
}
