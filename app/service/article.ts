import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class ArticleService extends Service {
    async index(payload) {
        console.log(payload);
        let {page, pagesize, channelId, categoryId} = payload;
        const {searchkey} = payload;
        let whereOBj = {};
        if (searchkey) {
            whereOBj = {status: {$ne: 0}, name: {$regexp: searchkey}, channelId: channelId};
        } else {
            whereOBj = {status: {$ne: 0}, channelId: channelId};
        }
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'})
/*        if (page === 0 && pagesize === 0) {
            return this.ctx.model.Article.findAndCountAll ({
                where: whereOBj,
                order: [
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
            });
        }*/
        if (!page) {
            page = 1;
        }
        if (!pagesize) {
            pagesize = this.ctx.app.config.pageSize;
        }
        if (!categoryId) {
            return this.ctx.model.Article.findAndCountAll ({
                where: whereOBj,
                order: [
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
                offset: (page - 1) * pagesize,
                limit: pagesize,
            });
        } else {
            return this.ctx.model.Article.findAndCountAll ({
                where: whereOBj,
                include: [
                    {
                        model: CategoryModel,
                        require: true,
                        where: {
                            parent_list: {
                                $or: [
                                    {$regexp: ',' + categoryId},
                                    {$regexp: ',' + categoryId + ','},
                                ],
                            },
                        },
                    },
                ],
                order: [
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
                offset: (page - 1) * pagesize,
                limit: pagesize,
            });
        }
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
        return ctx.model.Article.create(payload);
    }
    async update(payload) {
        const articleResult = await this.findById(payload.id);
        if (!articleResult) {
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        }
        return articleResult.update(payload);
    }
    async destroy(payload) {
        const {ctx} = this;
        const ArticleModel = ctx.model.Article;
        let whereStr = {};
        if (payload instanceof Array && payload.length > 0) {
            whereStr = {
                id: {$or : payload},
            };
        } else {
            whereStr = {
                id: 0,
            };
        }
        return ArticleModel.update({status: 0}, {
            where: whereStr,
        });
    }
}
