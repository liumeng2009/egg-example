export const ApiErrorNames = {
    UNKNOW_ERROR : 'unknowError',
    USERNAME_NOT_EXIST : 'userNameNotExist',
    PASSWORD_ERROR : 'passwordError',
    TOKEN_NOT_EXIST: 'tokenNotExist',
    ROLE_NAME_MUST_UNIQUE: 'roleNameMustUnique',
    ROLE_ID_NOT_EXIST: 'roleIdNotExist',
    ROLE_CAN_NOT_DELETE: 'roleCanNotDelete',
    USER_MOBILE_MUST_UNIQUE: 'userMobileMustUnique',
};
export const ApiErrorMap = new Map();
ApiErrorMap.set(ApiErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
ApiErrorMap.set(ApiErrorNames.USERNAME_NOT_EXIST, { code: 53300, message: '用户不存在！' });
ApiErrorMap.set(ApiErrorNames.PASSWORD_ERROR, {code: 53301, message: '密码错误！'});
ApiErrorMap.set(ApiErrorNames.TOKEN_NOT_EXIST, {code: 53302, message: 'token不存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, {code: 53303, message: '角色的名称已经存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_ID_NOT_EXIST, {code: 53304, message: '角色信息不存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_CAN_NOT_DELETE, {code: 53305, message: '系统管理员角色不可以删除！'});
ApiErrorMap.set(ApiErrorNames.USER_MOBILE_MUST_UNIQUE, {code: 53306, message: '用户手机号已经存在！'});

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
