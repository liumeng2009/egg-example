import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

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
    async create(payload) {
        const {ctx, service} = this;
        const channelId = payload.channelId;
        const categoryId = payload.categoryId;
        const channelResult = await service.channel.findById(channelId);
        if (!channelResult) {
            throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, undefined);
        }
        const categoryResult = await service.articleCategory.findById(categoryId);
        if (!categoryResult) {
            throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, undefined);
        }
        return ctx.model.User.create(payload);
    }
}
