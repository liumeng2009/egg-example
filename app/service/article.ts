import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';
import {IWhereObj} from './article.d';
import * as algoliasearch from 'algoliasearch';

export default class ArticleService extends Service {
    async index(payload) {
        console.log(payload);
        let {page, pagesize} = payload;
        const {searchkey, channelId, categoryId, status, isComment, isTop,
            isRed, isHot, isSlide} = payload;
        const whereobj: IWhereObj = {
            status: {$ne : 0},
            channelId: channelId,
        } ;
        if (status !== 'undefined') {
            if (status === '3') {
                whereobj.status = {$or: [1, 2]};
            } else {
                whereobj.status = status;
            }

        }
        const propsList: any[] = [];
        if (isComment !== 'undefined') {
            // whereobj.isComment = true;
            propsList.push({isComment : true});
        }
        if (isTop !== 'undefined') {
            // whereobj.isTop = true;
            propsList.push({isTop : true});
        }
        if (isRed !== 'undefined') {
            // whereobj.isRed = true;
            propsList.push({isRed : true});
        }
        if (isHot !== 'undefined') {
            // whereobj.isHot = true;
            propsList.push({isHot : true});
        }
        if (isSlide !== 'undefined') {
            // whereobj.isSlide = true;
            propsList.push({isSlide : true});
        }

        if (searchkey) {
            whereobj.title = {$regexp: searchkey};
        }
/*        else {
            whereOBj = {status: statusObj, channelId: channelId};
        }*/
        if (propsList.length > 0) {
            whereobj.$or = propsList;
        }
        console.log(JSON.stringify(whereobj));
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
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
                where: whereobj,
                order: [
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
                offset: (page - 1) * pagesize,
                limit: pagesize,
            });
        }
        else {
            return this.ctx.model.Article.findAndCountAll ({
                where: whereobj,
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
    async findByIdFull(id) {
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        const ChannelModel = this.ctx.model.Channel;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
        ArticleModel.belongsTo(ChannelModel, {foreignKey: 'channelId'});
        return ArticleModel.findOne ({
            where: {
                status: 1,
                id: id,
            },
            include: [
                {
                    model: CategoryModel,
                    require: true,
                },
                {
                    model: ChannelModel,
                    require: true,
                },
            ],
            order: [
                ['sort', 'ASC'],
                ['publishAt', 'DESC'],
            ],
        });
    }
    async findByIdExtend(id) {
        const {ctx} = this;
        const ArticleModel = ctx.model.Article;
        const ArticleAlbumModel = ctx.model.ArticleAlbum;
        ArticleModel.hasMany(ArticleAlbumModel, {foreignKey: 'articleId'});
        return this.ctx.model.Article.findOne({
            where: {
                status: 1,
                id: id,
            },
            include: [
                {
                    model: ArticleAlbumModel,
                },
            ],
        });
    }
    async findByCode(code) {
        return this.ctx.model.Article.findOne({
            where: {
                status: 1,
                code: {
                    $eq: code,
                    $ne: null,
                },
            },
        });
    }
    async create(payload) {
        const {ctx, service} = this;
        const channelId = payload.channelId;
        const categoryId = payload.categoryId;
        const albums = payload.article_albums;
        console.log(payload);
        const channelResult = await service.channel.findById(channelId);
        if (!channelResult) {
            throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, undefined);
        }
        const categoryResult = await service.articleCategory.findById(categoryId);
        if (!categoryResult) {
            throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, undefined);
        }

        const t = await ctx.model.transaction();
        try {
            const codeExist = await service.article.findByCode(payload.code);
            if (codeExist) {
                throw new ApiError(ApiErrorNames.ARTICLE_CODE_EXIST, undefined);
            }
            const addResult = await ctx.model.Article.create(payload, {transaction: t});
            console.log(albums instanceof Array);
            console.log(albums.length);
            if (albums instanceof Array && albums.length > 0) {
                console.log('here');
                for (const a of albums) {
                    a.articleId = addResult.id;
                }
                console.log(albums);
                await ctx.model.ArticleAlbum.bulkCreate(albums, {transaction: t});
            }
            t.commit();
        } catch (err) {
            t.rollback();
            throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, [err]);
        }
    }
    async update(payload) {
        const {ctx} = this;
        console.log(payload);
        const albums = payload.article_albums;
        let articleResult = await this.findById(payload.id);
        if (!articleResult) {
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        }
        const t = await ctx.model.transaction();
        try {
            const albumAdd: any[] = [];
            const albumDelete: any[] = [];
            if (albums && albums instanceof Array && albums.length > 0) {
                for (const al of albums) {
                    if (al.action === 'add') {
                        albumAdd.push(al);
                    }
                    if (al.action === 'delete') {
                        albumDelete.push(al);
                    }
                }
            }
            if (albumAdd.length > 0) {
                await ctx.model.ArticleAlbum.bulkCreate(albumAdd, {transaction: t});
            }
            if (albumDelete.length > 0) {
                const deleteArray: number[] = [];
                for (const ad of albumDelete) {
                    deleteArray.push(ad.id);
                }
                await ctx.model.ArticleAlbum.destroy({
                    where: {
                        id: {$or: deleteArray},
                    },
                }, {transaction: t});
            }
            console.log(payload);
            await articleResult.update(payload, {transaction: t});
            t.commit();
        } catch (err) {
            t.rollback();
            console.log(err);
            throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, [err]);
        }
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
    async auditing(payload) {
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
        return ArticleModel.update({status: 1}, {
            where: whereStr,
        });
    }
    async findAllArticle() {
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
        const ChannelModel = this.ctx.model.Channel;
        ArticleModel.belongsTo(ChannelModel, {foreignKey: 'channelId'});
        return ArticleModel.findAll ({
            where: {
                status: 1,
            },
            include: [
                {
                    model: CategoryModel,
                    require: true,
                },
                {
                    model: ChannelModel,
                    require: true,
                },
            ],
            order: [
                ['sort', 'ASC'],
                ['publishAt', 'DESC'],
            ],
        });
    }
    async pushAlgoliaSearch() {
        const client = algoliasearch(
            'Y2MNOEONET',
            'a729eedd4490cfd5898cdc2f0bc672f9',
        );
        const index = client.initIndex('demo_egg');
        const articleJson = await this.findAllArticle();
        index.addObjects(articleJson);
    }
}
