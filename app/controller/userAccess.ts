import {Controller} from 'egg';

export default class UserAccessController extends Controller {
    public userLoginTransfer;
    constructor(ctx) {
        super(ctx);

        this.userLoginTransfer = {
            mobile: { type: 'string', required: true, allowEmpty: false },
            password: { type: 'string', required: true, allowEmpty: false },
        };
    }

    async login() {
        const {ctx, service} = this;
        ctx.validate(this.userLoginTransfer);
        const payload = ctx.request.body || {};
        const res = await service.userAccess.login(payload);
        let username;
        if (res.user.realname) {
            username = res.user.realname;
        } else {
            username = res.user.mobile;
        }
        const message = ctx.__('loginSuccess', username);
        await ctx.helper.success(ctx, res, message);
    }

    async checkToken() {
        const {ctx, service} = this;
        const token = ctx.request.headers.authorization;
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
        const jwtResult = await service.userAccess.checkToken(token, device, lang);
        await ctx.helper.success(ctx, jwtResult, undefined);
    }
}
