import {ErrorTools} from './ApiErrorNames';

export class ApiError extends Error {
    public status: any = 0;
    constructor(error_name, custom_info_array) {
        super();

        const error_info = ErrorTools.getErrorInfo(error_name);

        this.name = error_name;
        this.status = error_info.code;

        // 实现用户自定义错误提示
        if (custom_info_array) {
            let errorMessage = error_info.message;
            let i = 1;
            for (const info of custom_info_array){
                errorMessage = errorMessage.replace('{' + i + '}', info);
                i++;
                console.log(errorMessage);
            }
            this.message = errorMessage;
        } else {
            this.message = error_info.message;
        }
    }
}
