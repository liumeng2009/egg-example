exports.success = (ctx, res, message) => {
    if (message && message !== '') {
        ctx.body = {
            code: 0,
            data: res,
            message: message,
        };
    }else if (message === '') {
        ctx.body = {
            code: 0,
            data: res,
            message: '请求成功！',
        };
    }else {
        ctx.body = {
            code: 0,
            data: res,
        };
    }
    ctx.status = 200;
}
