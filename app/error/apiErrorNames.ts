export const ApiErrorNames = {
    UNKNOW_ERROR : 'unknowError',
    USERNAME_NOT_EXIST : 'userNameNotExist',
    PASSWORD_ERROR : 'passwordError',
};
export const ApiErrorMap = new Map();
ApiErrorMap.set(ApiErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
ApiErrorMap.set(ApiErrorNames.USERNAME_NOT_EXIST, { code: 53300, message: '用户不存在！' });
ApiErrorMap.set(ApiErrorNames.PASSWORD_ERROR, {code: 53301, message: '密码错误'});

export class ErrorTools {
    static getErrorInfo= (error_name) => {
        let errorinfo;

        const UNKNOW_ERROR = 'unknowError'
        if (error_name) {
            errorinfo = ApiErrorMap.get(error_name);
        }

        // 如果没有对应的错误信息，默认'未知错误'
        if (!errorinfo) {
            error_name = UNKNOW_ERROR;
            errorinfo = ApiErrorMap.get(error_name);
        }

        return errorinfo;
    }
};
