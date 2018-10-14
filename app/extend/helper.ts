exports.success = (ctx, res) => {
    console.log('helper' + res);
    ctx.body = {
        code: 0,
        data: res,
        message: '请求成功',
    };
    ctx.status = 200;
}
