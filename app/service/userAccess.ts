import {Service} from 'egg';
import {User} from '../bean/user';

export default class UserAccessService extends Service {
    async login (user: User) {
        const {ctx, service} = this;
        const userResult = await service.user.findByMobile(user.mobile);
        if (!userResult) {
            ctx.throw(404, 'user not found');
        }
    }
}