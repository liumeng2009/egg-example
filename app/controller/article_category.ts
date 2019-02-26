import {Controller} from 'egg';

export default class ChannelController extends Controller {
    public categoryIndexTransfer;
    public categoryCreateTransfer;
    public categoryUpdateTransfer;
    public categoryDeleteTransfer;
    public categoryShowTransfer;
    constructor(ctx) {
        super(ctx);
        this.categoryIndexTransfer = {
            channelId: {type: 'number', required: true, convertType: 'int'},
        };
        this.categoryShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.categoryCreateTransfer = {
            channelId: {type: 'number', required: true, convertType: 'int'},
            parentId: {type: 'number', required: true, convertType: 'int'},
            name: {type: 'string', required: true},
            code: {type: 'string', required: false},
            sort: {type: 'number', required: false, default: 100},
            status: {type: 'number', required: true, default: 1},
        };
        this.categoryUpdateTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
            channelId: {type: 'number', required: true, convertType: 'int'},
            parentId: {type: 'number', required: true, convertType: 'int'},
            status: {type: 'number', required: true, default: 1},
            name: {type: 'string', required: true},
            code: {type: 'string', required: false},
            sort: {type: 'number', required: false},
        };
        this.categoryDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
    }
    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                lang = 'zh';
                break;
            case 'en-US,en;q=0.5':
                lang = 'en';
                break;
            default:
                lang = 'zh';
        }
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.categoryIndexTransfer, {channelId: ctx.query.channelId});
        const res = await service.articleCategory.index(ctx.query.channelId, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                lang = 'zh';
                break;
            case 'en-US,en;q=0.5':
                lang = 'en';
                break;
            default:
                lang = 'zh';
        }
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.categoryShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.articleCategory.show(payload.id, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                lang = 'zh';
                break;
            case 'en-US,en;q=0.5':
                lang = 'en';
                break;
            default:
                lang = 'zh';
        }
        await service.authAuthInRole.check('category', 'add', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.categoryCreateTransfer, ctx.request.body);
        const res = await service.articleCategory.create(ctx.request.body, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async update() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                lang = 'zh';
                break;
            case 'en-US,en;q=0.5':
                lang = 'en';
                break;
            default:
                lang = 'zh';
        }
        await service.authAuthInRole.check('category', 'edit', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.categoryUpdateTransfer, ctx.request.body);
        const res = await service.articleCategory.update(ctx.request.body, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                lang = 'zh';
                break;
            case 'en-US,en;q=0.5':
                lang = 'en';
                break;
            default:
                lang = 'zh';
        }
        await service.authAuthInRole.check('category', 'delete', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.categoryDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.articleCategory.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }
}
