import {Controller} from 'egg';

export default class ChannelController extends Controller {
    public categoryIndexTransfer;
    public categoryCreateTransfer;
    public categoryDeleteTransfer;
    constructor(ctx) {
        super(ctx);
        this.categoryIndexTransfer = {
            channelId: {type: 'number', required: true, convertType: 'int'},
        };
        this.categoryCreateTransfer = {
            channelId: {type: 'number', required: true, convertType: 'int'},
            parentId: {type: 'number', required: true, convertType: 'int'},
            name: {type: 'string', required: true},
            code: {type: 'string', required: true},
            sort: {type: 'number', required: true, default: 100},
        };
        this.categoryDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
    }
    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.categoryIndexTransfer, {channelId: ctx.query.channelId});
        let res;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                res = await service.articleCategory.index(ctx.query.channelId, 'zh');
                break;
            case 'en-US,en;q=0.5':
                res = await service.articleCategory.index(ctx.query.channelId, 'en');
                break;
            default:
                res = await service.articleCategory.index(ctx.query.channelId, 'zh');
        }
        await ctx.helper.success(ctx, res, undefined);
    }
    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.categoryCreateTransfer, ctx.request.body);
        let res;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                res = await service.articleCategory.create(ctx.request.body, 'zh');
                break;
            case 'en-US,en;q=0.5':
                res = await service.articleCategory.create(ctx.request.body, 'en');
                break;
            default:
                res = await service.articleCategory.create(ctx.request.body, 'zh');
        }
        await ctx.helper.success(ctx, res, undefined);
    }
    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'delete', ctx.request.headers.authorization, device);
        ctx.validate(this.categoryDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.articleCategory.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }
}
