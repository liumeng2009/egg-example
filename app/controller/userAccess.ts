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
        const message = ctx.__('loginSuccess,%s!', username);
        await ctx.helper.success(ctx, res, message);
    }

    async checkToken() {
        const {ctx, service} = this;
        const token = ctx.request.headers.authorization;
        const device = ctx.query.device;
        const jwtResult = await service.userAccess.checkToken(token, device);
        await ctx.helper.success(ctx, jwtResult, undefined);
    }
}
