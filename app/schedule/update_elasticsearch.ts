import {Subscription} from 'egg';
import * as elasticsearch from 'elasticsearch';

export default class UpdateElasticsearch extends Subscription {
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
            disable: false,
        };
    }
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const ArticleModel = this.ctx.model.Article;
        const CategoryModel = this.ctx.model.ArticleCategory;
        const ChannelModel = this.ctx.model.Channel;
        ArticleModel.belongsTo(CategoryModel, {foreignKey: 'categoryId'});
        ArticleModel.belongsTo(ChannelModel, {foreignKey: 'channelId'});
        const articles = await ArticleModel.findAll ({
            where: {
                isElastic: {
                    $or: [false, null],
                },
                status: 1,
            },
            include: [
                {
                    model: CategoryModel,
                    required: true,
                },
                {
                    model: ChannelModel,
                    required: true,
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
                    _id: '2000'+article.id,
                },
            };
            const articleJson = {
                id: '2000'+article.id,
                title: article.title,
                zhaiyao: article.zhaiyao,
                content: article.content,
                publishAt: article.publishAt,
                category: article.article_category.name,
                channel: article.channel.name,
                lang: 'zh'
            };
            const actionJsonEn = {
                index: {
                    _index: 'egg',
                    _type: 'articles',
                    _id: '1000'+article.id,
                },
            };
            const articleJsonEn = {
                id: '1000'+article.id,
                title: article.title_en,
                zhaiyao: article.zhaiyao_en,
                content: article.content_en,
                publishAt: article.publishAt,
                category: article.article_category.name_en,
                channel: article.channel.name_en,
                lang: 'en'
            };
            articleToElasticJson.push(actionJson);
            articleToElasticJson.push(articleJson);
            articleToElasticJson.push(actionJsonEn);
            articleToElasticJson.push(articleJsonEn);
        }
        if (articleToElasticJson.length === 0) {
            // throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST, undefined);
        } else {
            const client = new elasticsearch.Client({
                host: 'localhost:9200',
                log: 'trace',
            });
            await client.bulk({
                index: 'egg',
                type: 'articles',
                body: articleToElasticJson,
            });
            await ArticleModel.update({isElastic: true}, {
                where: {
                    isElastic: {
                        $or: [false, null],
                    },
                    status: 1,
                },
            });
        }
    }
}
