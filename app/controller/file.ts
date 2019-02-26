import {Controller} from 'egg';

export default class FileController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    async index() {
        const {ctx, service} = this;
        const res = await service.file.index();
        await ctx.helper.success(ctx, res, undefined);
    }
}
