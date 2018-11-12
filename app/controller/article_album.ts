import {Controller} from 'egg';

export class ArticleAlbumController extends Controller {
    public articleAlbumDeleteTransfer;
    constructor(ctx) {
        super(ctx);
        this.articleAlbumDeleteTransfer = {
            id: {type: 'number', required: true, convertType: 'int'},
        };
    }
    async destroy() {
        const {ctx, service} = this;
        ctx.validate(this.articleAlbumDeleteTransfer, ctx.params);
        const payload = ctx.params;
        const res = await service.articleAlbum.destroy(payload.id);
        await ctx.helper.success(ctx, res, '');
    }
}