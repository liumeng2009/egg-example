export class ErrorNames {
    static UNKNOW_ERROR = 'unknowError';
    static USERNAME_NOT_EXIST = 'userNameNotExist';
    static errorMap = new Map();
    constructor(
    ) {
        ErrorNames.errorMap.set(ErrorNames.UNKNOW_ERROR, { code: 500, message: '未知错误！' });
        ErrorNames.errorMap.set(ErrorNames.USERNAME_NOT_EXIST, { code: 53300, message: '用户不存在！' });
    }

    static getErrorInfo= (error_name, custom_info_array) => {
        let errorinfo;

        const UNKNOW_ERROR = 'unknowError'

        if (error_name) {
            const errorvalue = ErrorNames.errorMap.get(error_name);

            if (custom_info_array) {
                let errorMessage = errorvalue.message;
                let i = 1;
                for (const info of custom_info_array){

                    errorMessage = errorMessage.replace('{' + i + '}', info);
                    i++;
                }
                errorinfo = errorMessage;
            } else {
                errorinfo = errorvalue.message;
            }
        }

        // 如果没有对应的错误信息，默认'未知错误'
        if (!errorinfo) {
            error_name = UNKNOW_ERROR;
            errorinfo = ErrorNames.errorMap.get(error_name).message;
        }

        return errorinfo;
    }
};
