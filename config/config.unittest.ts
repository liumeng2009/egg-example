import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    config.sequelize = {
        database: 'database_egg_test',
    };

    return config;
};
