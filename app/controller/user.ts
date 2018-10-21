import {Controller} from 'egg';

export default class UserController extends Controller {
    public userIndexTransfer;
    public userShowTransfer;
    public userTransfer;
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
        this.userTransfer = {
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
        const payload = ctx.query;
        const roleArray = [];
        if (ctx.query.roles) {
            const array = ctx.query.roles.split(',');
            for (const arr of array) {
                try {
                    // @ts-ignore
                    roleArray.push(parseInt(arr.toString(), 10));
                }catch {

                }
            }
        }
        payload.roles = roleArray;
        console.log(payload);
        ctx.validate(this.userIndexTransfer, payload);
        const res = await service.user.index(payload);
        await ctx.helper.success(ctx, res, undefined);
    }

    async show() {
        const {ctx, service} = this;
        ctx.validate(this.userShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.user.findById(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }

    async create() {
        const {ctx, service} = this;
        ctx.validate(this.userTransfer, ctx.request.body);
        const payload = ctx.request.body || {};
        const res = await service.user.create(payload);
        await ctx.helper.success(ctx, res, '');
    }

    async sysAvatar() {
        const {ctx, service} = this;
        const res = await service.user.sysAvatars();
        await ctx.helper.success(ctx, res, undefined);
    }
};
