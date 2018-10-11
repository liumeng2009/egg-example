const ErrorNames = {
    UNKNOW_ERROR: 'unknowError',
    USERNAME_NOT_EXIST: 'userNameNotExist',
}


const errorMap = new Map();

errorMap.set(ErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
errorMap.set('userNameNotExist', { code: 53300, message: '用户不存在！' });
