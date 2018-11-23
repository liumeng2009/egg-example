import {Controller} from 'egg';

export default class ElastiCController extends Controller {
    public elasticCreateTransfer;
    public elasticShowTransfer;
    constructor(ctx) {
        super(ctx);
        this.elasticCreateTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
        this.elasticShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
    }
    async create() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.elasticsearch.create(payload.ids);
        await ctx.helper.success(ctx, res, '');
    }
    async destroy() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.elasticsearch.destroy(payload.ids);
        await ctx.helper.success(ctx, res, '');
    }
    async show() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.elasticShowTransfer, ctx.params);
        const payload = ctx.params || {};
        const res = await service.elasticsearch.show(payload);
        await ctx.helper.success(ctx, res, undefined);
    }
    async search() {
        const {ctx, service} = this;
        const searchkey = ctx.query.searchkey;
        const res = await service.elasticsearch.search(searchkey);
        await ctx.helper.success(ctx, res, '');
    }
}
