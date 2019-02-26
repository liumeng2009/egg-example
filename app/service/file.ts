import { Service } from 'egg';
import * as fs from 'fs';

export default class FileService extends Service {
    async index() {
        return fs.readdirSync(__dirname + '../../../files', {
            withFileTypes: true,
        });
    }
}
