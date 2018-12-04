import {Subscription} from 'egg';
import * as elasticsearch from 'elasticsearch';

export default class UpdateElasticsearch extends Subscription {
    static get schedule() {
        return {
            interval: '1h', // 1 分钟间隔
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
                id: article.id,
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
