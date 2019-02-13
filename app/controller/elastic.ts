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
        const device = ctx.query.device;

        ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        let lang = 'zh';
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
        await service.authAuthInRole.check('elastic', 'add', ctx.request.headers.authorization, device, lang);
        const res = await service.elasticsearch.create(payload.ids, lang);
        await ctx.helper.success(ctx, res, '');
    }
    async createAll() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang = 'zh';
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
        await service.authAuthInRole.check('article', 'add', ctx.request.headers.authorization, device, lang);
        const res = await service.elasticsearch.createAll(true);
        await ctx.helper.success(ctx, res, '');
    }
    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang = 'zh';
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
        await service.authAuthInRole.check('elastic', 'delete', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.elasticCreateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.elasticsearch.destroy(payload.ids, lang);
        await ctx.helper.success(ctx, res, '');
    }
    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang = 'zh';
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
        await service.authAuthInRole.check('elastic', 'list', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.elasticShowTransfer, ctx.params);
        const payload = ctx.params || {};

        const res = await service.elasticsearch.show(payload, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async search() {
        const {ctx, service} = this;
        const searchkey = ctx.query.searchkey;
        let lang = 'zh';
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
        const res = await service.elasticsearch.search(searchkey, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
}
