import {Controller} from 'egg';

export default class AuthController extends Controller {
    public authIndexTransfer;
    public authTransfer;
    public authShowTransfer;
    constructor(ctx) {
        super(ctx);

        this.authIndexTransfer = {
            roleId: {type: 'number', required: true, convertType: 'int'},
        };
        this.authTransfer = {
            roleId: {type: 'number', required: true, convertType: 'int'},
            authId: {type: 'number', required: true, convertType: 'int'},
        };
        this.authShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
    }

    async index() {
        const {ctx, service} = this;
        ctx.validate(this.authIndexTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.authAuthInRole.clientUse(payload.roleId);
        await ctx.helper.success(ctx, res, undefined);
    }
    async auth_func_index() {
        const {ctx, service} = this;
        const res = await service.authOpInFunc.index();
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        ctx.validate(this.authTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.role.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async destroy() {
        const {ctx, service} = this;
        ctx.validate(this.authShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.role.destroy(payload.id);
        await ctx.helper.success(ctx, res, '');
    }
}
