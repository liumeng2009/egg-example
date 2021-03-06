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
            message: ctx.__('requestSuccess'),
        };
    }else {
        ctx.body = {
            code: 0,
            data: res,
        };
    }
    ctx.status = 200;
}

exports.uploadSuccess = (ctx, res) => {
    ctx.body = res;
    ctx.status = 200;
}
