import {Controller} from 'egg';

export default class ChannelController extends Controller {
    public categoryIndexTransfer;
    public categoryCreateTransfer;
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
    }
    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.categoryIndexTransfer, {channelId: ctx.query.channelId});
        const res = await service.articleCategory.index(ctx.query.channelId);
        await ctx.helper.success(ctx, res, undefined);
    }
    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.categoryCreateTransfer, ctx.request.body);
        const res = await service.articleCategory.create(ctx.request.body);
        await ctx.helper.success(ctx, res, undefined);
    }
}
