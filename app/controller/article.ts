import {Controller} from 'egg';

export default class ArticleController extends Controller {
    public articleIndexTransfer;
    public articleTransfer;
    public articleShowTransfer;
    public articleDeleteTransfer;
    public articleUpdateTransfer;
    constructor(ctx) {
        super(ctx);

        this.articleIndexTransfer = {
            page: {type: 'number', required: false, convertType: 'int', default: 1},
            pagesize: {type: 'number', required: false, convertType: 'int',  default: ctx.app.config.pagesize},
            searchkey: {type: 'string', required: false},
        };
        this.articleTransfer = {
            name: {type: 'string', required: true},
            remark: {type: 'string', required: false},
        };
        this.articleShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.articleDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
        this.articleUpdateTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
            name: {type: 'string', required: true},
            remark: {type: 'string', required: false},
        };
    }

    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.roleIndexTransfer, ctx.query);
        const payload = ctx.query;
        const res = await service.role.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.roleShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.role.findById(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'add', ctx.request.headers.authorization, device);
        await service.authAuthInRole.check('authInRole', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.roleTransfer, ctx.request.body.role);
        ctx.validate(this.roleAuthsTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.role.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async update() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'edit', ctx.request.headers.authorization, device);
        ctx.validate(this.roleUpdateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.role.update(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'delete', ctx.request.headers.authorization, device);
        ctx.validate(this.roleDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.role.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }
}
