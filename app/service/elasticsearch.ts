import {Service} from 'egg';
import * as elasticsearch from 'elasticsearch';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class ElasticsearchService extends Service {
    public client;
    constructor(ctx) {
        super(ctx)
        this.client = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'trace',
        });
    }

    async create(payload) {
        let whereStr = {};
        if (payload instanceof Array && payload.length > 0) {
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
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        const ChannelModel = this.ctx.model.Channel;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
        ArticleModel.belongsTo(ChannelModel, {foreignKey: 'channelId'});
        const articles = await ArticleModel.findAll ({
            where: whereStr,
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
        const articleToElasticJson: any[] = []
        for (const article of articles) {
            const actionJson = {
                index: {
                    _index: 'egg',
                    _type: 'articles',
                    _id: article.id,
                },
            };
            const articleJson = {
                title: article.title,
                zhaiyao: article.zhaiyao,
                content: article.content,
                publishAt: article.publishAt,
                category: article.article_category.name,
                channel: article.channel.name,
            };
            articleToElasticJson.push(actionJson);
            articleToElasticJson.push(articleJson);
        }
        if (articleToElasticJson.length === 0) {
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        }
        const elasticBulk = this.client.bulk({
            index: 'egg',
            type: 'articles',
            body: articleToElasticJson,
        });
        await ArticleModel.update({isElastic: true}, {
            where: whereStr,
        });
        return elasticBulk;
    }

    async createAll() {

    }

    async destroy(payload) {
        const ArticleModel = this.ctx.model.Article;
        let whereStr = {};
        const articleToElasticJson: any[] = []
        if (payload instanceof Array && payload.length > 0) {
            whereStr = {
                id: {$or : payload},
                status: 1,
            };
            for (const id of payload) {
                const actionJson = {
                    delete: {
                        _index: 'egg',
                        _type: 'articles',
                        _id: id,
                    },
                };
                articleToElasticJson.push(actionJson);
            }
        } else {
            whereStr = {
                id: 0,
                status: 1,
            };
            throw new ApiError(ApiErrorNames.AT_LEAST_ONE_RECORD_REQUIRED, undefined);
        }
        const elasticBulk = this.client.bulk({
            index: 'egg',
            type: 'articles',
            body: articleToElasticJson,
        });
        await ArticleModel.update({isElastic: false}, {
            where: whereStr,
        });
        return elasticBulk;
    }
    async show(payload) {
        return this.client.get({
            index: 'egg',
            type: 'articles',
            id: payload.id,
        });
    }
    async search(searchkey) {
        return this.client.search({
            index: 'egg',
            body: {
                query: {
                    bool: {
                        should: [
                            {
                                match: {title: searchkey},
                            },
                            {
                                match: {zhaiyao: searchkey},
                            },
                            {
                                match: {content: searchkey},
                            },
                        ],
                    },
                },
                highlight: {
                    fields: {
                        title : {},
                        zhaiyao: {},
                    },
                },
                aggs: {
                    group_by_channel: {
                        terms: {
                            field: 'channel.keyword',
                        },
                    },
                },
            },
        });
    }
}
