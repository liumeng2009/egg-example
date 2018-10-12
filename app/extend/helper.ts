exports.success = (ctx, res) => {
    ctx.body = {
        status: 0,
        data: res,
        message: '请求成功',
    };
    ctx.status = 200;
}
