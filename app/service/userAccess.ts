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
        const verifyPsw = await ctx.compare(user.password, userResult.password);
        if (!verifyPsw) {
            ctx.throw(533, ErrorNames.getErrorInfo(ErrorNames.PASSWORD_ERROR, undefined));
        }
        return {token: await service.actionToken.apply(user.id, user.mobile, user.realname)};
    }
}
