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
            attrs = ['id' , ['name_en', 'name'], 'code', 'channelId', 'sort', 'level'];
        } else {
            attrs = ['id' , 'name', 'code', 'channelId', 'sort', 'level'];
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
    async show(id, lang) {
        const {ctx} = this;
        let attrs;
        let attrs_channel;
        if (lang === 'en') {
            attrs = ['id', ['name_en', 'name'], 'code', 'channelId',
                'parentId', 'parent_list', 'level', 'status', 'sort'];
            attrs_channel = ['id', ['name_en', 'name']];
        } else {
            attrs = ['id', 'name', 'code', 'channelId',
                'parentId', 'parent_list', 'level', 'status', 'sort'];
            attrs_channel = ['id', 'name'];
        }
        const ArticleCategoryModel = ctx.model.ArticleCategory;
        const ChannelModel = ctx.model.Channel;
        ArticleCategoryModel.belongsTo(ChannelModel, {foreignKey: 'channelId'});
        const cateResult = this.ctx.model.ArticleCategory.findOne({
            attributes: attrs,
            where: {
                status: 1,
                id: id,
            },
            include: [
                {
                    attributes: attrs_channel,
                    required: true,
                    model: ChannelModel,
                }
            ],
        });
        if (!cateResult) {
            throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
        }
        return cateResult;
    }
    async create(payload, lang) {
        const {ctx, service} = this;
        const channelId = payload.channelId;
        const parentId = payload.parentId;
        const code = payload.code;
        const channelResult = await service.channel.findById(channelId, lang);
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
            payload.name = null;
        }
        const t = await ctx.model.transaction();
        console.log(payload);
        try {
            const addResult = await ctx.model.ArticleCategory.create(payload, {transaction: t});
            const parentArray = [];
            await this.findParentCategory(addResult.parentId, parentArray);
            let parentList = '';
            console.log(parentArray);
            for (let i = 0; i < parentArray.length; i++) {
                parentList = parentList + ',' + parentArray[i];
            }
            parentList = parentList + ',' + addResult.id;
            payload.id = addResult.id;
            payload.parent_list = parentList;
            await addResult.update(payload, {transaction: t});
            t.commit();
        } catch (err) {
            console.log(err);
            t.rollback();
            throw new ApiError(ApiErrorNames.CATEGORY_SAVE_FAILED, ctx.__(ApiErrorNames.CATEGORY_SAVE_FAILED, err));
        }
    }
    async update(payload, lang) {
        const {ctx, service} = this;
        const ArticleCategoryModel = ctx.model.ArticleCategory;
        const categoryResult = await service.articleCategory.findById(payload.id);
        if (!categoryResult) {
            throw new ApiError(ApiErrorNames.CATEGORY_NOT_EXIST, ctx.__(ApiErrorNames.CATEGORY_NOT_EXIST));
        }
        // 检查code
        const checkCode = await ArticleCategoryModel.findOne({
            where: {
                id: {
                    $ne: categoryResult.id,
                },
                code: {
                    $eq: payload.code,
                },
                status: 1,
            },
        });
        if (checkCode) {
            throw new ApiError(ApiErrorNames.CATEGORY_CODE_IS_EXIST,
                ctx.__(ApiErrorNames.CATEGORY_CODE_IS_EXIST));
        }

        // code置空
        if (payload.code === undefined || payload.code === '') {
            payload.code = null;
        }

        // 如果parentId被改动了，则需要组合新的parent_list
        if (payload.parentId !== categoryResult.parentId) {
            const parentArray = [];
            await this.findParentCategory(payload.parentId, parentArray);
            let parentList = '';
            for (let i = 0; i < parentArray.length; i++) {
                parentList = parentList + ',' + parentArray[i];
            }
            parentList = parentList + ',' + payload.id;
            payload.parent_list = parentList;
        }
        // 根据lang来确定修改name 还是 name_en
        if (lang === 'en') {
            payload.name_en = payload.name;
            payload.name = categoryResult.name;
        }
        console.log(payload);
        await categoryResult.update(payload);
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
