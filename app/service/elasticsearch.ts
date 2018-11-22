import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class ElasticsearchService extends Service {
    // 建立index:egg
    async initIndex() {
        await this.app.curl(this.app.config.elasticsearchPath + 'egg', {
            method: 'PUT',
            dataType: 'json',
        });
    }

    async initType() {
        const typeAddJson = {
            mappings: {
                articles: {
                    properties: {
                        title: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_max_word',
                        },
                        zhaiyao: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_max_word',
                        },
                        content: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_max_word',
                        },
                        channel: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_max_word',
                        },
                        category: {
                            type: 'text',
                            analyzer: 'ik_max_word',
                            search_analyzer: 'ik_max_word',
                        },
                        publishAt: {
                            type: 'text',
                        },
                    },
                },
            },
        };
        await this.app.curl(this.app.config.elasticsearchPath + 'egg', {
            method: 'PUT',
            data: typeAddJson,
            dataType: 'json',
        });
    }

    async create(articleId) {
        const {app, service} = this;
        const article = await service.article.findByIdFull(articleId);
        if (!article) {
            throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        }
        const articleToElasticJson = {
            title: article.title,
            zhaiyao: article.zhaiyao,
            content: article.content,
            channel: article.channel.name,
            category: article.article_category.name,
        }
        console.log(articleToElasticJson);
        return app.curl(app.config.elasticsearchPath + 'egg/articles/' + article.id, {
            method: 'PUT',
            dataType: 'json',
            headers: {'Content-Type' : 'application/json'},
            data: articleToElasticJson,
        });
    }

    async createAll() {
        const {app, service} = this;
        const articles = await service.article.findAllArticle();
        for (const article of articles) {
            const articleToElasticJson = {
                title: article.title,
                zhaiyao: article.zhaiyao,
                content: article.content,
                channel: article.channel.name,
                category: article.article_category.name,
            };
            await app.curl(app.config.elasticsearchPath + 'egg/article/' + article.id, {
                method: 'PUT',
                dataType: 'json',
                headers: {'Content-Type' : 'application/json'},
                data: articleToElasticJson,
            });
        }
    }
}
