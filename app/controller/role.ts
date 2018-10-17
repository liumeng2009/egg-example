import {Controller} from 'egg';

export default class RoleController extends Controller {
    public roleIndexTransfer;

    constructor(ctx) {
        super(ctx);

        this.roleIndexTransfer = {
            page: {type: 'number', required: false, default: 1},
            pagesize: {type: 'number', required: false, default: ctx.app.config.pagesize},
            searchkey: {type: 'string', required: false},
        };
    }

    async index() {
        const {ctx, service} = this;
        ctx.validate(this.roleIndexTransfer, ctx.query);
        const payload = ctx.query;
        const res = await service.role.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }
}
