import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';
import {IWhereObj} from './article.d';

module.exports = (app) => {
    return class ArticleService extends app.Service {
        async index(payload) {
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
            const ArticleModel = this.ctx.model.Article;
            const CategoryModel = this.ctx.model.ArticleCategory;
            ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
            if (!page) {
                page = 1;
            }
            if (!pagesize) {
                pagesize = this.ctx.app.config.pageSize;
            }
            const attrs = ['id', 'title', 'sort', 'status', 'isComment',
                'isTop', 'isRed', 'isHot', 'isSlide', 'publishAt',
            ];
            const attrsCate = ['id', 'name'];
            if (!categoryId) {
                return this.ctx.model.Article.findAndCountAll ({
                    attributes: attrs,
                    where: whereobj,
                    include: [
                        {
                            model: CategoryModel,
                            attributes: attrsCate,
                            require: true,
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
            else {
                return this.ctx.model.Article.findAndCountAll ({
                    attributes: attrs,
                    where: whereobj,
                    include: [
                        {
                            model: CategoryModel,
                            attributes: attrsCate,
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
        async indexEn(payload) {
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
            const ArticleModel = this.ctx.model.Article;
            const CategoryModel = this.ctx.model.ArticleCategory;
            ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
            if (!page) {
                page = 1;
            }
            if (!pagesize) {
                pagesize = this.ctx.app.config.pageSize;
            }
            const attrs = ['id', ['title_en', 'title'], 'sort', 'status', 'isComment',
                'isTop', 'isRed', 'isHot', 'isSlide', 'publishAt',
            ];
            const attrsCate = ['id', ['name_en', 'name']];
            if (!categoryId) {
                return this.ctx.model.Article.findAndCountAll ({
                    attributes: attrs,
                    where: whereobj,
                    include: [
                        {
                            model: CategoryModel,
                            attributes: attrsCate,
                            require: true,
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
            else {
                return this.ctx.model.Article.findAndCountAll ({
                    attributes: attrs,
                    where: whereobj,
                    include: [
                        {
                            model: CategoryModel,
                            attributes: attrsCate,
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
            const attrs = ['id', 'categoryId', 'channelId', 'code', 'imgUrl', 'title', 'zhaiyao', 'content', 'sort',
                'status', 'isComment', 'imgUrl', 'click', 'auditing', 'author',
                'isTop', 'isRed', 'isHot', 'isSlide', 'publishAt',
            ];
            return this.ctx.model.Article.findOne({
                attributes: attrs,
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
        async findByIdExtendEn(id) {
            const {ctx} = this;
            const ArticleModel = ctx.model.Article;
            const ArticleAlbumModel = ctx.model.ArticleAlbum;
            ArticleModel.hasMany(ArticleAlbumModel, {foreignKey: 'articleId'});
            const attrs = ['id', 'categoryId', 'channelId', 'code', 'imgUrl', ['title_en', 'title'],
                ['zhaiyao_en', 'zhaiyao'],
                ['content_en', 'content'], 'sort',
                'status', 'isComment', 'imgUrl', 'click', 'auditing', 'author',
                'isTop', 'isRed', 'isHot', 'isSlide', 'publishAt',
            ];
            return this.ctx.model.Article.findOne({
                attributes: attrs,
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
        async findByCodeExtend(code) {
            const {ctx} = this;
            const ArticleModel = ctx.model.Article;
            const ArticleAlbumModel = ctx.model.ArticleAlbum;
            ArticleModel.hasMany(ArticleAlbumModel, {foreignKey: 'articleId'});
            return this.ctx.model.Article.findOne({
                where: {
                    status: 1,
                    code: {
                        $eq: code,
                        $ne: null,
                    },
                },
                include: [
                    {
                        model: ArticleAlbumModel,
                    },
                ],
            });
        }
        async findByCodeExtendEn(code) {
            const {ctx} = this;
            const ArticleModel = ctx.model.Article;
            const ArticleAlbumModel = ctx.model.ArticleAlbum;
            ArticleModel.hasMany(ArticleAlbumModel, {foreignKey: 'articleId'});
            const attrs = ['id', 'categoryId', 'channelId', ['title_en', 'title'], ['zhaiyao_en', 'zhaiyao'],
                ['content_en', 'content'], 'sort',
                'status', 'isComment', 'imgUrl', 'click', 'auditing', 'author',
                'isTop', 'isRed', 'isHot', 'isSlide', 'publishAt',
            ];
            return this.ctx.model.Article.findOne({
                attributes: attrs,
                where: {
                    status: 1,
                    code: {
                        $eq: code,
                        $ne: null,
                    },
                },
                include: [
                    {
                        model: ArticleAlbumModel,
                    },
                ],
            });
        }
        async create(payload) {
            const {ctx, service} = this;
            const channelId = payload.channelId;
            const categoryId = payload.categoryId;
            const albums = payload.article_albums;
            const channelResult = await service.channel.findById(channelId);
            if (!channelResult) {
                throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, ctx.__(ApiErrorNames.CHANNEL_NOT_EXIST));
            }
            const categoryResult = await service.articleCategory.findById(categoryId);
            if (!categoryResult) {
                throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
            }

            const t = await ctx.model.transaction();
            try {
                const codeExist = await service.article.findByCode(payload.code);
                if (codeExist) {
                    throw new ApiError(ApiErrorNames.ARTICLE_CODE_EXIST, ctx.__(ApiErrorNames.ARTICLE_CODE_EXIST));
                }
                const addResult = await ctx.model.Article.create(payload, {transaction: t});
                if (albums instanceof Array && albums.length > 0) {
                    for (const a of albums) {
                        a.articleId = addResult.id;
                    }
                    await ctx.model.ArticleAlbum.bulkCreate(albums, {transaction: t});
                }
                t.commit();
            } catch (err) {
                t.rollback();
                throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, ctx.__(ApiErrorNames.ARTICLE_SAVE_FAILED, err));
            }
        }
        async createEn(payload) {
            const {ctx, service} = this;
            const channelId = payload.channelId;
            const categoryId = payload.categoryId;
            const albums = payload.article_albums;
            const channelResult = await service.channel.findById(channelId);
            payload.title_en = payload.title;
            payload.zhaiyao_en = payload.zhaiyao;
            payload.content_en = payload.content;
            if (!channelResult) {
                throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, ctx.__(ApiErrorNames.CHANNEL_NOT_EXIST));
            }
            const categoryResult = await service.articleCategory.findById(categoryId);
            if (!categoryResult) {
                throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
            }

            const t = await ctx.model.transaction();
            try {
                const codeExist = await service.article.findByCode(payload.code);
                if (codeExist) {
                    throw new ApiError(ApiErrorNames.ARTICLE_CODE_EXIST, ctx.__(ApiErrorNames.ARTICLE_CODE_EXIST));
                }
                const addResult = await ctx.model.Article.create(payload, {transaction: t});
                if (albums instanceof Array && albums.length > 0) {
                    for (const a of albums) {
                        a.articleId = addResult.id;
                    }
                    await ctx.model.ArticleAlbum.bulkCreate(albums, {transaction: t});
                }
                t.commit();
            } catch (err) {
                t.rollback();
                throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, ctx.__(ApiErrorNames.ARTICLE_SAVE_FAILED, err));
            }
        }
        async update(payload) {
            const {ctx} = this;
            console.log(payload);
            const albums = payload.article_albums;
            let articleResult = await this.findById(payload.id);
            if (!articleResult) {
                throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, ctx.__(ApiErrorNames.ARTICLE_NOT_EXIST));
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
                throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, ctx.__(ApiErrorNames.ARTICLE_SAVE_FAILED, err));
            }
        }
        async updateEn(payload) {
            const {ctx} = this;
            console.log(payload);
            const albums = payload.article_albums;
            let articleResult = await this.findById(payload.id);
            if (!articleResult) {
                throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, ctx.__(ApiErrorNames.ARTICLE_NOT_EXIST));
            }
            payload.title_en = payload.title;
            payload.zhaiyao_en = payload.zhaiyao;
            payload.content_en = payload.content;
            payload.title = articleResult.title;
            payload.zhaiyao = articleResult.zhaiyao;
            payload.content = articleResult.content;
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
                throw new ApiError(ApiErrorNames.ARTICLE_SAVE_FAILED, ctx.__(ApiErrorNames.ARTICLE_SAVE_FAILED, err));
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
        async publicIndexByCategoryCode(payload, lang) {
            const {ctx, service} = this;
            let {page, pagesize} = payload;
            const {code} = payload;
            const category = await service.articleCategory.findByCode(code);
            if (!category) {
                throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST,
                    ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
            }
            const categoryId = category.id;
            if (!page) {
                page = 1;
            }
            if (!pagesize) {
                pagesize = this.ctx.app.config.pageSize;
            }

            const CategoryModel = ctx.model.ArticleCategory;
            const ArticleModel = ctx.model.Article;
            ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
            let attrs;
            if (lang === 'zh') {
                attrs = ['id', 'title', 'sort', 'status', 'publishAt'];
            } else if (lang === 'en') {
                attrs = ['id', ['title_en', 'title'], 'sort', 'status', 'publishAt'];
            } else {
                attrs = ['id', 'title', 'sort', 'status', 'publishAt'];
            }
            return ArticleModel.findAll ({
                attributes: attrs,
                where: {
                    status: 1,
                },
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
                    ['isTop', 'DESC'],
                    ['sort', 'ASC'],
                    ['publishAt', 'DESC'],
                ],
                offset: (page - 1) * pagesize,
                limit: pagesize,
            });
        }
        async publicShowArticle(payload, lang) {
            const {ctx} = this;
            if (lang === 'en') {
                const articleIdResult = await this.findByIdExtendEn(payload.id);
                if (articleIdResult) {
                    return articleIdResult;
                }
                const articleCodeResult = await this.findByCodeExtendEn(payload.id);
                if (articleCodeResult) {
                    return articleCodeResult;
                }
            } else {
                const articleIdResult = await this.findByIdExtend(payload.id);
                if (articleIdResult) {
                    return articleIdResult;
                }
                const articleCodeResult = await this.findByCodeExtend(payload.id);
                if (articleCodeResult) {
                    return articleCodeResult;
                }
            }
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, ctx.__(ApiErrorNames.ARTICLE_NOT_EXIST));
        }
    };
}
