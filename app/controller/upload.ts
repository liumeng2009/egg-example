import {Controller} from 'egg';
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole')
/*const download = require('image-downloader')*/

export default class UploadController extends Controller {
    constructor (ctx) {
        super(ctx);
    }

    // 上传单个文件
    async create() {
        const { ctx } = this
        // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
        // 只支持上传一个文件。
        // 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
        const stream = await ctx.getFileStream();
        // 所有表单字段都能通过 `stream.fields` 获取到
        const filename = path.basename(stream.filename); // 文件名称
        const date = new Date();
        const folderName = (date.getFullYear()).toString() +
            ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : ('0' + (date.getMonth() + 1)))
            + (date.getDate() > 9 ? date.getDate().toString() : ('0' + date.getDate()));
        const folder = path.join(this.config.baseDir, 'app/public/uploads', folderName);

        if (fs.existsSync(folder)) {
            // throw new ApiError(ApiErrorNames.NO_AUTH, undefined);
        } else {
            fs.mkdirSync(folder);
        }

        const timeStamp = date.getTime();
        const target = path.join(folder, timeStamp + '-' + filename )
        const writeStream = fs.createWriteStream(target)
        // 文件处理，上传到云存储等等
        try {
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            await sendToWormhole(stream)
            throw err;
        }

        // 设置响应内容和响应状态码
        ctx.helper.success(ctx, {path : '/public/uploads/' + folderName + '/' + timeStamp + '-' + filename}, '上传成功');
    }

    // 上传多个文件
/*    async multiple() {
        // 要获取同时上传的多个文件，不能通过 ctx.getFileStream() 来获取
        const { ctx, service } = this
        const parts = ctx.multipart()
        const res = {}
        const files = []

        let part // parts() return a promise
        while ((part = await parts()) != null) {
            if (part.length) {
                // 如果是数组的话是 filed
                // console.log('field: ' + part[0])
                // console.log('value: ' + part[1])
                // console.log('valueTruncated: ' + part[2])
                // console.log('fieldnameTruncated: ' + part[3])
            } else {
                if (!part.filename) {
                    // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
                    // 需要做出处理，例如给出错误提示消息
                    return
                }
                // part 是上传的文件流
                // console.log('field: ' + part.fieldname)
                // console.log('filename: ' + part.filename)
                // console.log('extname: ' + part.extname)
                // console.log('encoding: ' + part.encoding)
                // console.log('mime: ' + part.mime)
                const filename = part.filename.toLowerCase() // 文件名称
                const extname = path.extname(part.filename).toLowerCase() // 文件扩展名称

                // 组装参数
                const attachment = new ctx.model.Attachment
                attachment.extname = extname
                attachment.filename = filename
                attachment.url = `/uploads/${attachment._id.toString()}${extname}`
                // const target = path.join(this.config.baseDir, 'app/public/uploads', filename)
                const target = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id.toString()}${extname}`)
                const writeStream = fs.createWriteStream(target)
                // 文件处理，上传到云存储等等
                let res
                try {
                    // result = await ctx.oss.put('egg-multipart-test/' + part.filename, part)
                    await awaitWriteStream(part.pipe(writeStream))
                    // 调用Service
                    res = await service.upload.create(attachment)
                } catch (err) {
                    // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                    await sendToWormhole(part)
                    throw err
                }
                files.push(`${attachment._id}`) // console.log(result)
            }
        }
        ctx.helper.success({ctx, res: { _ids:files }})
    }

    // 删除单个文件
    async destroy() {
        const { ctx, service } = this
        // 校验参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        await service.upload.destroy(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx})
    }

    // 修改单个文件
    async update() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params // 传入要修改的文档ID
        // 调用Service 删除旧文件，如果存在
        const attachment = await service.upload.updatePre(id)
        // 获取用户上传的替换文件
        const stream = await ctx.getFileStream()
        const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
        const filename = path.basename(stream.filename) // 文件名称
        // 组装更新参数
        attachment.extname = extname
        attachment.filename = filename
        attachment.url = `/uploads/${attachment._id.toString()}${extname}`
        const target_U = path.join(this.config.baseDir, 'app/public/uploads', `${attachment._id}${extname}`)
        const writeStream = fs.createWriteStream(target_U)
        // 文件处理，上传到云存储等等
        try {
            await awaitWriteStream(stream.pipe(writeStream))
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            await sendToWormhole(stream)
            throw err
        }
        // 调用Service 保持原图片ID不变，更新其他属性
        await service.upload.update(id, attachment)
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx})
    }

    // 添加图片描述
    async extra() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params // 传入要修改的文档ID
        const payload = ctx.request.body || {}
        await service.upload.extra(id, payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx})
    }

    // 获取单个文件
    async show() {
        const { ctx, service } = this
        // 组装参数
        const { id } = ctx.params
        // 调用 Service 进行业务处理
        const res = await service.upload.show(id)
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx, res})
    }

    // 获取所有文件(分页/模糊)
    async index() {
        const { ctx, service } = this
        // 组装参数
        const payload = ctx.query
        // 调用 Service 进行业务处理
        const res = await service.upload.index(payload)
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx, res})
    }

    // 删除所选文件(条件id[])
    async removes() {
        const { ctx, service } = this
        // 组装参数
        // const values = ctx.queries.id
        const { id } = ctx.request.body
        const payload = id.split(',') || []
        // 设置响应内容和响应状态码
        for (let attachment of payload) {
            // 调用 Service 进行业务处理
            await service.upload.destroy(attachment)
        }
        // 设置响应内容和响应状态码
        ctx.helper.success({ctx})
    }*/
}
