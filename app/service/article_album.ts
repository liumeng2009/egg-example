import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class ArticleAlbumService extends Service {
    async findById(id) {
        return this.ctx.model.ArticleAlbum.findOne({
            where: {
                id: id,
                status: 1,
            },
        });
    }
    async index(articleId) {
        const {service} = this;
        const articleResult = await service.article.findById(articleId);
        if (!articleResult) {
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        }
        return this.ctx.model.ArticleAlbum.findAll({
            where: {
                articleId: articleId,
                status: 1,
            },
        });
    }
    async create(payload) {
        const {ctx} = this;
        return ctx.model.ArticleAlbum.create(payload);
    }

    async destroy(albumId) {
        const {ctx} = this;
        const ArticleAlbumModel = ctx.model.ArticleAlbum;
        return ArticleAlbumModel.update({status: 0}, {
            where: {
                id: albumId,
                status: 1,
            },
        });
    }
}
