import {Controller} from 'egg';

export default class RoleController extends Controller {
    public roleIndexTransfer;
    public roleTransfer;
    public roleShowTransfer;
    public roleUpdateTransfer;
    constructor(ctx) {
        super(ctx);

        this.roleIndexTransfer = {
            page: {type: 'number', required: false, convertType: 'int', default: 1},
            pagesize: {type: 'number', required: false, convertType: 'int',  default: ctx.app.config.pagesize},
            searchkey: {type: 'string', required: false},
        };
        this.roleTransfer = {
            name: {type: 'string', required: true},
            remark: {type: 'string', required: false},
        };
        this.roleShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.roleUpdateTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
            name: {type: 'string', required: true},
            remark: {type: 'string', required: false},
        };
    }

    async index() {
        const {ctx, service} = this;
        ctx.validate(this.roleIndexTransfer, ctx.query);
        const payload = ctx.query;
        const res = await service.role.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        ctx.validate(this.roleShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.role.findById(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        ctx.validate(this.roleTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.role.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async update() {
        const {ctx, service} = this;
        ctx.validate(this.roleUpdateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.role.update(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async destroy() {
        const {ctx, service} = this;
        ctx.validate(this.roleShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.role.destroy(payload.id);
        await ctx.helper.success(ctx, res, '');
    }
}
