export const ApiErrorNames = {
    UNKNOW_ERROR : 'unknowError',
    USERNAME_NOT_EXIST : 'userNameNotExist',
    PASSWORD_ERROR : 'passwordError',
    OLD_PASSWORD_ERROR: 'oldPasswordError',
    PASSWORD_COMPARE_ERROR: 'passwordCompareError',
    TOKEN_NOT_EXIST: 'tokenNotExist',
    ROLE_NAME_MUST_UNIQUE: 'roleNameMustUnique',
    ROLE_NAME_CAN_NOT_NULL: 'roleNameCanNotNull',
    ROLE_ID_NOT_EXIST: 'roleIdNotExist',
    ROLE_CAN_NOT_DELETE: 'roleCanNotDelete',
    ROLE_SAVE_FAILED: 'roleSaveFailed',
    USER_MOBILE_MUST_UNIQUE: 'userMobileMustUnique',
    USER_ID_NOT_EXIST: 'userIdNotExist',
    ADMIN_CAN_NOT_DELETE: 'adminCanNotDelete',
    AUTH_EXIST: 'authExist',
    OP_IN_FUNC_NOT_EXIST: 'opInFuncNotExist',
    ADMIN_AUTH_CAN_NOT_DELETE: 'adminAuthCanNOtDelete',
    NO_AUTH: 'noAuth',
    AUTH_NOT_EXIST: 'authNotExist',
    AUTH_FUNCTION_NOT_EXIST: 'authFunctionNotExist',
    AUTH_OPERATE_NOT_EXIST: 'authOperateNotExist',
    USER_CAN_NOT_LOGIN_ADMIN: 'userCanNotLoginAdmin',
    CHANNEL_NOT_EXIST: 'channelNotExist',
    CATEGORY_NOT_EXIST: 'categoryNotExist',
    CATEGORY_SAVE_FAILED: 'categorySaveFailed',
    ARTICLE_NOT_EXIST: 'articleNotExist',
    ARTICLE_CODE_EXIST: 'articleCodeExist',
    ARTICLE_SAVE_FAILED: 'articleSaveFailed',
    AT_LEAST_ONE_RECORD_REQUIRED: 'atLeastOneRecordRequired',
    CATEGORY_CODE_NOT_EXIST: 'categoryCodeNotExist',
    CATEGORY_CODE_IS_EXIST: 'categoryCodeIsExist',
};
export const ApiErrorMap = new Map();
ApiErrorMap.set(ApiErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
ApiErrorMap.set(ApiErrorNames.USERNAME_NOT_EXIST, { code: 53300, message: '用户名不存在！' });
ApiErrorMap.set(ApiErrorNames.PASSWORD_ERROR, {code: 53301, message: '密码错误！'});
ApiErrorMap.set(ApiErrorNames.OLD_PASSWORD_ERROR, {code: 53326, message: '原密码错误！'});
ApiErrorMap.set(ApiErrorNames.PASSWORD_COMPARE_ERROR, {code: 53327, message: '新录入的两个密码不一致！'});
ApiErrorMap.set(ApiErrorNames.TOKEN_NOT_EXIST, {code: 53302, message: 'token不存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_NAME_MUST_UNIQUE, {code: 53303, message: '角色的名称已经存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_NAME_CAN_NOT_NULL, {code: 53304, message: '角色的名称不能为空！'});
ApiErrorMap.set(ApiErrorNames.ROLE_ID_NOT_EXIST, {code: 53305, message: '角色信息不存在！'});
ApiErrorMap.set(ApiErrorNames.ROLE_CAN_NOT_DELETE, {code: 53306, message: '系统管理员角色不可以删除！'});
ApiErrorMap.set(ApiErrorNames.ROLE_SAVE_FAILED, {code: 53307, message: '新增角色出错！原因：{1}！'});
ApiErrorMap.set(ApiErrorNames.USER_MOBILE_MUST_UNIQUE, {code: 53308, message: '用户手机号已经存在！'});
ApiErrorMap.set(ApiErrorNames.USER_ID_NOT_EXIST, {code: 53309, message: '用户信息不存在！'});
ApiErrorMap.set(ApiErrorNames.ADMIN_CAN_NOT_DELETE, {code: 53310, message: '系统管理员账户不可以删除！'});
ApiErrorMap.set(ApiErrorNames.AUTH_EXIST, {code: 53311, message: '此权限已拥有，不需要重复添加了！'});
ApiErrorMap.set(ApiErrorNames.OP_IN_FUNC_NOT_EXIST, {code: 53312, message: '功能项不存在！'});
ApiErrorMap.set(ApiErrorNames.ADMIN_AUTH_CAN_NOT_DELETE, {code: 53313, message: '系统管理员角色的权限不可以被删除！'});
ApiErrorMap.set(ApiErrorNames.NO_AUTH, {code: 53314, message: '当前登录账户没有{1}！'});
ApiErrorMap.set(ApiErrorNames.AUTH_NOT_EXIST, {code: 53315, message: '要删除的权限不存在！'});
ApiErrorMap.set(ApiErrorNames.AUTH_FUNCTION_NOT_EXIST, {code: 53316, message: '权限的功能项参数不存在！'});
ApiErrorMap.set(ApiErrorNames.AUTH_OPERATE_NOT_EXIST, {code: 53317, message: '权限的操作参数不存在！'});
ApiErrorMap.set(ApiErrorNames.USER_CAN_NOT_LOGIN_ADMIN, {code: 53318, message: '您的账户不能登录管理后台！'});
ApiErrorMap.set(ApiErrorNames.CHANNEL_NOT_EXIST, {code: 53319, message: '频道不存在！'});
ApiErrorMap.set(ApiErrorNames.CATEGORY_NOT_EXIST, {code: 53320, message: '分类不存在！'});
ApiErrorMap.set(ApiErrorNames.CATEGORY_SAVE_FAILED, {code: 53321, message: '分类保存失败！原因是：{1}'});
ApiErrorMap.set(ApiErrorNames.ARTICLE_NOT_EXIST, {code: 53322, message: '文章信息不存在！'});
ApiErrorMap.set(ApiErrorNames.ARTICLE_CODE_EXIST, {code: 53323, message: '文章的调用别名已经存在！'});
ApiErrorMap.set(ApiErrorNames.ARTICLE_SAVE_FAILED, {code: 53324, message: '文章保存失败！原因是：{1}'});
ApiErrorMap.set(ApiErrorNames.AT_LEAST_ONE_RECORD_REQUIRED, {code: 53325, message: '请至少选取一条记录进行操作！'});
ApiErrorMap.set(ApiErrorNames.CATEGORY_CODE_NOT_EXIST, {code: 53326});
ApiErrorMap.set(ApiErrorNames.CATEGORY_CODE_IS_EXIST, {code: 53327});

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
