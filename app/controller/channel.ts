import {Controller} from 'egg';

export default class ChannelController extends Controller {
    public channelShowTransfer;
    constructor(ctx) {
        super(ctx);
        this.channelShowTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
    }
    async index() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device);
        let res;
        switch (ctx.request.headers['accept-language']) {
            case 'zh-CN,zh;q=0.5':
                res = await service.channel.index('zh');
                break;
            case 'en-US,en;q=0.5':
                res = await service.channel.index('en');
                break;
            default:
                res = await service.channel.index('zh');
        }
        await ctx.helper.success(ctx, res, undefined);
    }
    async show() {
        const {ctx, service} = this;
        const device = ctx.query.device;
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device);
        ctx.validate(this.channelShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.channel.findById(payload.id);
        await ctx.helper.success(ctx, res, undefined);
    }
}
