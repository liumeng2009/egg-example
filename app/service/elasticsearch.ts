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

    async create(payload, lang) {
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
                    _id: lang==='en'?('1000' + article.id):('2000' + article.id),
                },
            };
            let articleJson;
            if (lang === 'en') {
                articleJson = {
                    id: '1000' + article.id,
                    title: article.title_en,
                    zhaiyao: article.zhaiyao_en,
                    content: article.content_en,
                    publishAt: article.publishAt,
                    category: article.article_category.name_en,
                    channel: article.channel.name_en,
                };
            } else {
                articleJson = {
                    id: '2000' + article.id,
                    title: article.title,
                    zhaiyao: article.zhaiyao,
                    content: article.content,
                    publishAt: article.publishAt,
                    category: article.article_category.name,
                    channel: article.channel.name,
                };
            }

            articleToElasticJson.push(actionJson);
            articleToElasticJson.push(articleJson);
        }
        if (articleToElasticJson.length === 0) {
            throw new ApiError(ApiErrorNames.AT_LEAST_ONE_RECORD_REQUIRED, undefined);
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

    async destroy(payload, lang) {
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
                        _id: lang === 'en' ? ('1000' + id) : ('2000' + id),
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
    async show(payload, lang) {
        return this.client.get({
            index: 'egg',
            type: 'articles',
            id: lang === 'en' ? ('1000' + payload.id) : ('2000' + payload.id),
        });
    }
    async search(searchkey, lang) {
        return this.client.search({
            index: 'egg',
            size: 10,
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
                            {
                                match: {lang: lang},
                            },
                        ],
                    },
                },
                highlight: {
                    fields: {
                        title : {},
                        zhaiyao: {},
                    },
                    pre_tags : ['<div>'],
                    post_tags : ['</div>'],
                    tags_schema : 'styled',
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
