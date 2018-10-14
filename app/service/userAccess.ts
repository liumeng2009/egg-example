import {Service} from 'egg';
import {User} from '../bean/user';
import {ApiError} from '../error/apiError';
import {ApiErrorNames } from '../error/apiErrorNames';

export default class UserAccessService extends Service {
    async login (user: User) {
        const {ctx, service} = this;

        const userResult = await service.user.findByMobile(user.mobile);
        if (!userResult) {
            throw new ApiError(ApiErrorNames.USERNAME_NOT_EXIST, undefined);
        }
        const verifyPsw = await ctx.compare(user.password, userResult.password);
        if (!verifyPsw) {
            throw new ApiError(ApiErrorNames.PASSWORD_ERROR, undefined);
        }

        const token = await service.actionToken.apply(userResult.id, userResult.mobile, userResult.realname);

        const saveResult = await service.user.updateToken(userResult.id, token);
        return {
            user: saveResult,
        };
    }
}
