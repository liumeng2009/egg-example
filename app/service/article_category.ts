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
    async index(channelId) {
        return this.ctx.model.ArticleCategory.findAll({
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
    async create(payload) {
        const {ctx, service} = this;
        const channelId = payload.channelId;
        const parentId = payload.parentId;
        const code = payload.code;
        const channelResult = await service.channel.findById(channelId);
        if (!channelResult) {
           throw new ApiError(ApiErrorNames.CHANNEL_NOT_EXIST, undefined);
        }
        const checkCode = await this.findByCode(code)
        if (checkCode) {
            throw new ApiError(ApiErrorNames.CATEGORY_CODE_IS_EXIST, ctx.__(ApiErrorNames.CATEGORY_CODE_IS_EXIST));
        }
        if (parentId !== 0) {
            const parentResult = service.articleCategory.findById(parentId);
            if (!parentResult) {
                throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, undefined);
            }
        }
        const t = await ctx.model.transaction();
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
}
