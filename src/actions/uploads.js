import { message } from 'antd'
import axios from 'axios'

import actionTypes from './actionTypes'

const addUploadTaskAction = (uploadDirectoryPath, file) => {
    return { type: actionTypes.ADD_UPLOAD_TASK, payload: { uploadDirectoryPath, file } }
}

const removeUploadTaskAction = (id) => {
    return { type: actionTypes.REMOVE_UPLOAD_TASK, payload: { id } }
}

const finishUploadTaskAction = (id) => {
    return { type: actionTypes.FINISH_UPLOAD_TASK, payload: { id } }
}

const cancelUploadTaskAction = (id) => {
    return { type: actionTypes.CANCEL_UPLOAD_TASK, payload: { id } }
}

const startUploadTaskAction = (id, contentHash) => {
    return { type: actionTypes.START_UPLOAD_TASK, payload: { id, contentHash } }
}

const updateCalculateProgressAction = (id, progress) => {
    return { type: actionTypes.UPDATE_UPLOAD_TASK_CALCULATE_PROGRESS, payload: { id, progress } }
}

const updateUploadProgressAction = (id, progress) => {
    return { type: actionTypes.UPDATE_UPLOAD_TASK_UPLOAD_PROGRESS, payload: { id, progress } }
}

export const updateCalculateProgress = (id, progress) => {
    return dispatch => {
        dispatch(updateCalculateProgressAction(id, progress))
    }
}

export const updateUploadProgress = (id, progress) => {
    return dispatch => {
        dispatch(updateUploadProgressAction(id, progress))
    }
}

export const removeUploadTask = (id) => {
    return dispatch => {
        dispatch(removeUploadTaskAction(id))
    }
}

export const cancelUploadTask = (id) => {
    return dispatch => {
        dispatch(cancelUploadTaskAction(id))
    }
}

export const startUploadTask = (id, contentHash) => {
    return async (dispatch, getState) => {
        dispatch(startUploadTaskAction(id, contentHash))
        // 获取id相应的上传任务信息
        const { uploadTaskList } = getState().uploads
        let uploadTaskInfo = null
        for (let value of uploadTaskList) {
            if (id === value.id) {
                uploadTaskInfo = value
            }
        }
        // 找不到，退出
        if (uploadTaskInfo === null) {
            return
        }

        // 获取上传开始位置
        const requestParams = { content_hash: contentHash, file_size: uploadTaskInfo.fileSize }
        let response
        try {
            response = await axios.get('/api/v1/my_space/file/upload/start_point', { params: requestParams })
            if (response.status !== 200 || response.data.code !== '000000') {
                // 获取上传开始位置失败
                message.error(uploadTaskInfo.filename + '上传失败')
                dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
                return
            }
        } catch (err) {
            // 获取上传开始位置失败
            message.error(uploadTaskInfo.filename + '上传失败')
            dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
        }

        // 计算上传headers、上传URL，以及file参数
        const uploadStartPoint = response.data.data.uploadStartPoint
        const headers = { 'Content-Hash': uploadTaskInfo.contentHash, 'Content-Start-At': uploadStartPoint }
        const uploadUrl = '/api/v1/my_space/file/upload' + uploadTaskInfo.uploadDirectoryPath
        const formData = new FormData()
        const fileBlob = uploadTaskInfo.file.slice(uploadStartPoint, uploadTaskInfo.file.size, uploadTaskInfo.file.type)
        formData.append('file', fileBlob, uploadTaskInfo.file.name)
        const config = {
            headers: headers
        }

        // 设置上传进度callback
        config.onUploadProgress = (progressEvent) => {
            const current = progressEvent.loaded
            const total = progressEvent.total
            dispatch(updateUploadProgress(uploadTaskInfo.id, current / total * 100))
        }

        // 发送上传请求
        try {
            response = await axios.post(uploadUrl, formData, config)
            if (response.status === 200 && response.data.code === '000000') {
                // 上传成功
                message.success(uploadTaskInfo.filename + '上传成功')
                dispatch(finishUploadTaskAction(uploadTaskInfo.id))
                return
            }
        } catch (err) {
            // 处理特殊情况：服务器直接使用已上传文件。
            // 因为内容哈希值一致而不读完文件内容，axios会报网络错误，但实际上是上传成功的。
            if (uploadTaskInfo.fileSize === uploadStartPoint) {
                message.success(uploadTaskInfo.filename + '上传成功')
                dispatch(finishUploadTaskAction(uploadTaskInfo.id))
                return
            }
            // 上传失败
            message.error(uploadTaskInfo.filename + '上传失败')
            dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
        }
        // 上传失败
        dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
    }
}

export const addUploadTask = (uploadDirectoryPath, file) => {
    return dispatch => {
        // console.log(file)
        // console.log(file.slice(1000))
        dispatch(addUploadTaskAction(uploadDirectoryPath, file))
    }
}