import {Controller} from 'egg';

export default class ArticleController extends Controller {
    public articleIndexTransfer;
    public articleTransfer;
    public articleShowTransfer;
    public articleShowByCodeTransfer;
    public articleDeleteTransfer;
    public articleUpdateTransfer;
    constructor(ctx) {
        super(ctx);
        this.articleIndexTransfer = {
            page: {type: 'number', required: false, convertType: 'int', default: 1},
            pagesize: {type: 'number', required: false, convertType: 'int',  default: ctx.app.config.pagesize},
            searchkey: {type: 'string', required: false},
            categoryId: {type: 'number', required: false, convertType: 'int'},
            channelId: {type: 'number', required: true, convertType: 'int'},
        };
        this.articleTransfer = {
            channelId: {type: 'number', required: true, convertType: 'int'},
            categoryId: {type: 'number', required: true, convertType: 'int'},
            title: {type: 'string', required: true},
            imgUrl: {type: 'string', required: false},
            zhaiyao: {type: 'string', required: false},
            content: {type: 'string', required: false},
            sort: {type: 'number', required: true, default: 100},
            click: {type: 'number', required: false, default: 0},
            status: {type: 'number', required: true, default: 1},
            isComment: {type: 'boolean', required: false, default: false},
            isTop: {type: 'boolean', required: false, default: false},
            isRed: {type: 'boolean', required: false, default: false},
            isHot: {type: 'boolean', required: false, default: false},
            isSlide: {type: 'boolean', required: false, default: false},
            author: {type: 'number', required: true},
            auditing: {type: 'number', required: false},
            publishAt: {type: 'dateTime', convertType: 'string', required: false},
            album: {type: 'array', required: false},
        };
        this.articleShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.articleShowByCodeTransfer = {
            code: {type: 'string', required: true},
        };
        this.articleDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
        this.articleUpdateTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
            channelId: {type: 'number', required: false, convertType: 'int'},
            categoryId: {type: 'number', required: false, convertType: 'int'},
            title: {type: 'string', required: false},
            imgUrl: {type: 'string', required: false},
            zhaiyao: {type: 'string', required: false},
            content: {type: 'string', required: false},
            sort: {type: 'number', required: false},
            click: {type: 'number', required: false},
            status: {type: 'number', required: false},
            isComment: {type: 'boolean', required: false, default: false},
            isTop: {type: 'boolean', required: false, default: false},
            isRed: {type: 'boolean', required: false, default: false},
            isHot: {type: 'boolean', required: false, default: false},
            isSlide: {type: 'boolean', required: false, default: false},
            author: {type: 'number', required: false},
            auditing: {type: 'number', required: false},
            publishAt: {type: 'dateTime', convertType: 'string', required: false},
        };
    }

    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.articleIndexTransfer, ctx.query);
        const payload = ctx.query;
        const res = await service.article.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.articleShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.article.findByIdExtend(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }
    async showByCode() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.articleShowByCodeTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.article.findById(payload.code);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.articleTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.article.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async update() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'edit', ctx.request.headers.authorization, device);
        ctx.validate(this.articleUpdateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.article.update(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'delete', ctx.request.headers.authorization, device);
        ctx.validate(this.articleDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.article.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }
    async auditing() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('article', 'auditing', ctx.request.headers.authorization, device);
        ctx.validate(this.articleDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.article.auditing(payload);
        await ctx.helper.success(ctx, res, '');
    }
}
