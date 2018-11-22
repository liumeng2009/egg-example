import {Controller} from 'egg';

export default class ElastiCController extends Controller {
    public elasticCreateTransfer;
    constructor(ctx) {
        super(ctx);
        this.elasticCreateTransfer = {
            articleId: {type: 'number', required: false, convertType: 'int'},
        };
    }
    async initIndex() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        // ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        // const payload = ctx.request.body || {};
        const res = await service.elasticsearch.initIndex();
        console.log(res);
        await ctx.helper.success(ctx, res, '');
    }
    async initType() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        // ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        // const payload = ctx.request.body || {};
        const res = await service.elasticsearch.initType();
        console.log(res);
        await ctx.helper.success(ctx, res, '');
    }
    async create() {
        const {ctx, service} = this;
        // const device = ctx.query.device;
        // await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.elasticsearch.create(payload.articleId);
        console.log(res);
        await ctx.helper.success(ctx, res, '');
    }
    async search() {
        const {ctx, service} = this;
        const searchkey = ctx.query.searchkey;
        const res = await service.elasticsearch.search(searchkey);
        console.log(res);
        await ctx.helper.success(ctx, res, '');
    }
}
