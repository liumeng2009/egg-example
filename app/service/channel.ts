import {Service} from 'egg';

export default class ChannelService extends Service {
    async index(lang) {
        let attrs ;
        if (lang === 'en') {
            attrs = ['id', ['name_en', 'name']];
        } else {
            attrs = ['id', 'name'];
        }
        return this.ctx.model.Channel.findAll({
            attributes: attrs,
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
