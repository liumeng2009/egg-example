import {Service} from 'egg';

export default class ChannelService extends Service {
    async index() {
        return this.ctx.model.Channel.findAll({
            where: {
                status: 1,
            },
        });
    }
    async findById(id) {
        return this.ctx.model.Channel.findOne({
            where: {
                status: 1,
                id: id,
            },
        });
    }
}
