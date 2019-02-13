import {Controller} from 'egg';

export default class AuthController extends Controller {
    public authIndexTransfer;
    public authTransfer;
    public authShowTransfer;
    public authCheckTransfer;
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
        this.authCheckTransfer = {
            token: {type: 'string', required: false},
            device: {type: 'string', required: false},
            func: {type: 'string', required: true},
            op: {type: 'string', required: true},
        };
    }

    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
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
        await service.authAuthInRole.check('authInRole', 'list', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.authIndexTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.authAuthInRole.clientUse(payload.roleId, lang);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
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
        await service.authAuthInRole.check('authInRole', 'add', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.authTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.authAuthInRole.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        let lang;
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
        await service.authAuthInRole.check('authInRole', 'delete', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.authTransfer, ctx.params);
        const payload = ctx.params || {};
        const res = await service.authAuthInRole.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async check() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        const token = ctx.request.headers.authorization;
        const func = ctx.request.body.func;
        const op = ctx.request.body.op;
        const payload = {
            token: token,
            device: device,
            func: func,
            op: op,
        }
        let lang;
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
        console.log(payload);
        ctx.validate(this.authCheckTransfer, payload);
        const res = await service.authAuthInRole.check(func, op, token, device, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
}
