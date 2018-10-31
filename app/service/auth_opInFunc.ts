import {Service} from 'egg';

export default class OpInFuncService extends Service {
    async index() {
        const AuthOperateModel = this.ctx.model.AuthOperate;
        const AuthFunctionModel = this.ctx.model.AuthFunction;
        const OpInFuncModel = this.ctx.model.AuthOpInFunc;
        OpInFuncModel.belongsTo(AuthOperateModel, {foreignKey: 'opId'});
        // OpInFuncModel.belongsTo(AuthFunctionModel, {foreignKey: 'funcId'});
        AuthFunctionModel.hasMany(OpInFuncModel, {foreignKey: 'funcId'});
        return AuthFunctionModel.findAll ({
            include: [
                {
                    model: OpInFuncModel,
                    include: [
                        {
                            model: AuthOperateModel,
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
