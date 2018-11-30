// import {Service} from 'egg';
import {User} from '../bean/user';
import {ApiError} from '../error/apiError';
import {ApiErrorNames } from '../error/apiErrorNames';

module.exports = (app) => {
    return class UserAccessService extends app.Service {
        async login (user: User) {
            const {ctx, service} = this;

            const userResult = await service.user.findByMobile(user.mobile);
            if (!userResult) {
                throw new ApiError(ApiErrorNames.USERNAME_NOT_EXIST, ctx.__(ApiErrorNames.USERNAME_NOT_EXIST));
            }
            if (!userResult.isAdmin) {
                throw new ApiError(ApiErrorNames.USER_CAN_NOT_LOGIN_ADMIN,
                    ctx.__(ApiErrorNames.USER_CAN_NOT_LOGIN_ADMIN));
            }
            const verifyPsw = await ctx.compare(user.password, userResult.password);
            if (!verifyPsw) {
                // throw new ApiError(ApiErrorNames.PASSWORD_ERROR, undefined);
                throw new ApiError(ApiErrorNames.PASSWORD_ERROR, ctx.__(ApiErrorNames.PASSWORD_ERROR));
            }

            const token = await service.actionToken.apply(userResult.id, userResult.mobile, userResult.realname);

            const saveResult = await service.user.updateToken(userResult.id, token);
            return {
                user: saveResult,
            };
        }
        async checkToken(token: string, device) {
            const {ctx, service, config} = this;
            const userResult = await service.user.findByTokenFull(token, device);
            if (!userResult) {
                throw new ApiError(ApiErrorNames.TOKEN_NOT_EXIST, ctx.__(ApiErrorNames.USER_CAN_NOT_LOGIN_ADMIN));
            }
            await app.jwt.verify(token, config.jwt.secret);
            return userResult;
        }
    };
}
