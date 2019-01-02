import {Subscription} from 'egg';

export default class UpdateElasticsearch extends Subscription {
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
            immediate: true,
            disable: false,
        };
    }
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const {service} = this;
        const forceCover = false;
        service.elasticsearch.createAll(forceCover);
    }
}
