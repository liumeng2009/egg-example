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
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device, lang);
        const res = await service.channel.index(lang);
        await ctx.helper.success(ctx, res, undefined);
    }
    async show() {
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
        await service.authAuthInRole.check('category', 'list', ctx.request.headers.authorization, device, lang);
        ctx.validate(this.channelShowTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.channel.findById(payload.id, lang);
        await ctx.helper.success(ctx, res, undefined);
    }
}
