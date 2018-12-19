import {Controller} from 'egg';

export default class RoleController extends Controller {
    public roleIndexTransfer;
    public roleTransfer;
    public roleAuthsTransfer;
    public roleShowTransfer;
    public roleDeleteTransfer;
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
        this.roleAuthsTransfer = {
            auths: {type: 'array', required: false, itemType: 'int' },
        };
        this.roleShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.roleDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
        this.roleUpdateTransfer = {
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
        const res = await service.role.index(payload, lang);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.roleShowTransfer, ctx.params);
        const payload = ctx.params;
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
        const res = await service.role.show(payload.id, lang);
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
        const res = await service.role.create(payload, lang);
        await ctx.helper.success(ctx, res, '');
    }

    async update() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('role', 'edit', ctx.request.headers.authorization, device);
        ctx.validate(this.roleUpdateTransfer, ctx.request.body);
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
        const res = await service.role.update(payload, lang);
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
