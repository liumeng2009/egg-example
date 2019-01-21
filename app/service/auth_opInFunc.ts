import {Service} from 'egg';

export default class OpInFuncService extends Service {
    async index(lang) {
        const AuthOperateModel = this.ctx.model.AuthOperate;
        const AuthFunctionModel = this.ctx.model.AuthFunction;
        const OpInFuncModel = this.ctx.model.AuthOpInFunc;
        OpInFuncModel.belongsTo(AuthOperateModel, {foreignKey: 'opId'});
        // OpInFuncModel.belongsTo(AuthFunctionModel, {foreignKey: 'funcId'});
        AuthFunctionModel.hasMany(OpInFuncModel, {foreignKey: 'funcId'});
        let functionAttrs;
        let operationAttrs;
        if (lang === 'en') {
            functionAttrs = [['name_en', 'name'], 'id', 'level'];
            operationAttrs = [['name_en', 'name'], 'id'];
        } else {
            functionAttrs = ['name', 'id', 'level'];
            operationAttrs = ['name', 'id'];
        }
        return AuthFunctionModel.findAll ({
            attributes: functionAttrs,
            include: [
                {
                    model: OpInFuncModel,
                    include: [
                        {
                            model: AuthOperateModel,
                            attributes: operationAttrs,
                        },
                    ],
                },
            ],
            order: [
                ['sort', 'ASC'],
                [OpInFuncModel, AuthOperateModel, 'id', 'ASC'],
            ],
        });
    }
    async findById(id) {
        return this.ctx.model.AuthOpInFunc.findOne({
            where: {
                id: id,
            },
        });
    }
}
