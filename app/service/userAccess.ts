import {Service} from 'egg';
import {User} from '../bean/user';
import {ErrorNames} from '../error/apiErrorNames';

export default class UserAccessService extends Service {
    async login (user: User) {
        const {ctx, service} = this;
        const userResult = await service.user.findByMobile(user.mobile);
        if (!userResult) {
            ctx.throw(533, ErrorNames.getErrorInfo(ErrorNames.USERNAME_NOT_EXIST, undefined));
        }
    }
}
