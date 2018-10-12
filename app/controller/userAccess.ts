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
        ctx.helper.success({ctx, res});
    }
}
