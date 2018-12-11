import {Service} from 'egg';
import {ApiError} from '../error/apiError';
import {ApiErrorNames} from '../error/apiErrorNames';

export default class ArticleCategoryService extends Service {
    async findById(id) {
        return this.ctx.model.ArticleCategory.findOne({
            where: {
                status: 1,
                id: id,
            },
        });
    }
    async findByName(name) {
        return this.ctx.model.ArticleCategory.findOne({
            where: {
                status: 1,
                name: name,
            },
        });
    }
    async findByCode(code) {
        return this.ctx.model.ArticleCategory.findOne({
            where: {
                status: 1,
                code: {
                    $eq: code,
                    $ne: null,
                },
            },
        });
    }
    async index(channelId, lang) {
        let attrs;
        if (lang === 'en') {
            attrs = ['id' , ['name_en', 'name'], 'code', 'channelId', 'sort'];
        } else {
            attrs = ['id' , 'name', 'code', 'channelId', 'sort'];
        }
        return this.ctx.model.ArticleCategory.findAll({
            attributes: attrs,
            where: {
                channelId: channelId,
                status: 1,
            },
            order: [
                ['parent_list', 'ASC'],
                ['sort', 'ASC'],
            ],
        });
    }
    async create(payload, lang) {
        const {ctx, service} = this;
        const channelId = payload.channelId;
        const parentId = payload.parentId;
        const code = payload.code;
        const channelResult = await service.channel.findById(channelId);
        if (!channelResult) {
           throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, ctx.__(ApiErrorNames.CHANNEL_NOT_EXIST));
        }
        const checkCode = await this.findByCode(code)
        if (checkCode) {
            throw new ApiError(ApiErrorNames.CATEGORY_CODE_IS_EXIST, ctx.__(ApiErrorNames.CATEGORY_CODE_IS_EXIST));
        }
        if (parentId !== 0) {
            const parentResult = service.articleCategory.findById(parentId);
            if (!parentResult) {
                throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
            }
        }
        if (lang === 'en') {
            payload.name_en = payload.name;
            payload.name = '';
        }
        const t = await ctx.model.transaction();
        console.log(payload);
        try {
            const addResult = await ctx.model.ArticleCategory.create(payload, {transaction: t});
            const parentArray = [];
            await this.findParentCategory(addResult.id, parentArray);
            let parentList = ',' + addResult.id;
            for (const parent of parentArray) {

                parentList = parentList + ',' + parent;
            }
            payload.id = addResult.id;
            payload.parent_list = parentList;
            await addResult.update(payload, {transaction: t});
            t.commit();
        } catch (err) {
            t.rollback();
            throw new ApiError(ApiErrorNames.CATEGORY_SAVE_FAILED, ctx.__(ApiErrorNames.CATEGORY_SAVE_FAILED, err));
        }
    }
    async findParentCategory(id, resultArray) {
        const {service} = this;
        const result = await service.articleCategory.findById(id);
        if (result) {
            resultArray.unshift(result.id);
            if (result.parentId === 0) {
                // 说明这个已经是树的最高节点
                return resultArray;
            } else {
                await this.findParentCategory(result.parentId, resultArray);
            }
        }
    }
    async destroy(payload) {
        const {ctx} = this;
        const ArticleCategoryModel = ctx.model.ArticleCategory;
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
        return ArticleCategoryModel.update({status: 0}, {
            where: whereStr,
        });
    }
}
