import {Controller} from 'egg';

export default class UserController extends Controller {
    public userIndexTransfer;
    public userShowTransfer;
    public userDeleteTransfer;
    public userTransfer;
    public userUpdateTransfer;
    constructor(ctx) {
        super(ctx);
        this.userIndexTransfer = {
            page: {type: 'number', required: false, convertType: 'int', default: 1},
            pagesize: {type: 'number', required: false, convertType: 'int',  default: ctx.app.config.pagesize},
            searchkey: {type: 'string', required: false},
            roles: {type: 'array', required: false, itemType: 'int'},
        };
        this.userShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
        this.userDeleteTransfer = {
            ids: {type: 'array', required: true, itemType: 'int'},
        };
        this.userTransfer = {
            mobile: {type: 'string', required: true},
            realname: {type: 'string', required: false},
            password: {type: 'string', required: true},
            age: {type: 'number', required: false, convertType: 'int'},
            roleId: {type: 'number', required: false, convertType: 'int'},
            avatar: {type: 'string', required: false},
            avatarUseSys: {type: 'enum', values: [1, 0], required: false, default: 1},
        };
        this.userUpdateTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
            mobile: {type: 'string', required: true},
            realname: {type: 'string', required: false},
            password: {type: 'string', required: true},
            age: {type: 'number', required: false, convertType: 'int'},
            roleId: {type: 'number', required: false, convertType: 'int'},
            avatar: {type: 'string', required: false},
            avatarUseSys: {type: 'enum', values: [1, 0], required: false, default: 1},
        };
    }
    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('user', 'list', ctx.request.headers.authorization, device);
        const payload = ctx.query;
        const roleArray = [];
        if (ctx.query.roles) {
            const array = ctx.query.roles.split(',');
            for (const arr of array) {
                try {
                    // @ts-ignore
                    roleArray.push(parseInt(arr.toString(), 10));
                }catch {
                    console.debug('type error in roleIdList');
                }
            }
        }
        payload.roles = roleArray;
        ctx.validate(this.userIndexTransfer, payload);
        const res = await service.user.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('user', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.userShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.user.findById(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }

    async showOwn() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        const token = ctx.request.headers.authorization;
        await service.userAccess.checkToken(token, device);
        // 获取自己的用户信息
        // await service.authAuthInRole.check('user', 'list', ctx.request.headers.authorization, device);
        // ctx.validate(this.userShowTransfer, ctx.params);
        // const payload = ctx.params;
        const res = await service.user.findByToken(token, device);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('user', 'add', ctx.request.headers.authorization, device);
        ctx.validate(this.userTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.user.create(payload);
        await ctx.helper.success(ctx, res, '');
    }
    async update() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('user', 'edit', ctx.request.headers.authorization, device);
        ctx.validate(this.userUpdateTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.user.update(payload);
        await ctx.helper.success(ctx, res, '');
    }
    async destroy() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('user', 'delete', ctx.request.headers.authorization, device);
        ctx.validate(this.userDeleteTransfer, ctx.request.body);
        const payload = ctx.request.body.ids;
        const res = await service.user.destroy(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async sysAvatar() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        // await service.authAuthInRole.check('user', 'list', ctx.request.headers.authorization, device);
        await service.userAccess.checkToken(ctx.request.headers.authorization, device);
        const res = await service.user.sysAvatars();
        await ctx.helper.success(ctx, res, undefined);
    }
};
