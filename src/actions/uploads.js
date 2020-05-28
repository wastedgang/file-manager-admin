import { message } from 'antd'
import axios from 'axios'
import getFileContentHash from '@/md5'

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

const startUploadTaskAction = (id, contentHash, cancelSource) => {
    return { type: actionTypes.START_UPLOAD_TASK, payload: { id, contentHash, cancelSource } }
}

const restartUploadTaskAction = (id, cancelSource) => {
    return { type: actionTypes.RESTART_UPLOAD_TASK, payload: { id, cancelSource } }
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
    return (dispatch, getState) => {
        // 获取id相应的上传任务信息
        const uploadTaskList = getState().uploads.uploadTaskList.filter(item => item.id === id)
        // 找不到，退出
        if (uploadTaskList.length === 0) {
            return
        }
        const uploadTaskInfo = uploadTaskList[0]
        if (uploadTaskInfo.cancelSource) {
            uploadTaskInfo.cancelSource.cancel()
        }
        dispatch(cancelUploadTaskAction(id))
    }
}

const uploadTaskRequest = async ({ dispatch, getState, uploadTaskInfo, contentHash, cancelSource }) => {
    // 获取上传开始位置
    const requestParams = { content_hash: contentHash, file_size: uploadTaskInfo.fileSize }
    let response
    try {
        response = await axios.get('/api/v1/my_space/file/upload/start_point', { params: requestParams, cancelToken: cancelSource.token })
        if (response.status !== 200 || response.data.code !== '000000') {
            // 获取上传开始位置失败
            message.error(uploadTaskInfo.filename + '上传失败')
            dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
            return
        }
    } catch (err) {
        // 手动取消不报错
        if (axios.isCancel(err)) {
            return
        }
        // 获取上传开始位置失败
        message.error(uploadTaskInfo.filename + '上传失败')
        dispatch(cancelUploadTaskAction(uploadTaskInfo.id))
    }

    // 计算上传headers、上传URL，以及file参数
    const uploadStartPoint = response.data.data.uploadStartPoint
    const headers = { 'Content-Hash': contentHash, 'Content-Start-At': uploadStartPoint }
    const uploadUrl = '/api/v1/my_space/file/upload' + uploadTaskInfo.uploadDirectoryPath
    const formData = new FormData()
    const fileBlob = uploadTaskInfo.file.slice(uploadStartPoint, uploadTaskInfo.file.size, uploadTaskInfo.file.type)
    formData.append('file', fileBlob, uploadTaskInfo.file.name)
    const config = {
        headers: headers,
        cancelToken: cancelSource.token
    }

    // 设置上传进度callback
    config.onUploadProgress = (progressEvent) => {
        const current = progressEvent.loaded + uploadStartPoint
        const total = progressEvent.total + uploadStartPoint
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
        // 手动取消不报错
        if (axios.isCancel(err)) {
            return
        }
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

export const restartUploadTask = (id) => {
    return async (dispatch, getState) => {
        // 获取id相应的上传任务信息
        const uploadTaskList = getState().uploads.uploadTaskList.filter(item => item.id === id)
        // 找不到，退出
        if (uploadTaskList.length === 0) {
            return
        }
        const uploadTaskInfo = uploadTaskList[0]
        const cancelSource = axios.CancelToken.source()
        dispatch(restartUploadTaskAction(id, cancelSource))

        const contentHash = uploadTaskInfo.contentHash
        uploadTaskRequest({ dispatch, getState, uploadTaskInfo, contentHash, cancelSource })
    }
}

export const startUploadTask = (id, contentHash) => {
    return async (dispatch, getState) => {
        // 获取id相应的上传任务信息
        const uploadTaskList = getState().uploads.uploadTaskList.filter(item => item.id === id)
        // 找不到，退出
        if (uploadTaskList.length === 0) {
            return
        }
        const uploadTaskInfo = uploadTaskList[0]

        const cancelSource = axios.CancelToken.source()
        dispatch(startUploadTaskAction(id, contentHash, cancelSource))
        uploadTaskRequest({ dispatch, getState, uploadTaskInfo, contentHash, cancelSource })
    }
}

export const addUploadTask = (uploadDirectoryPath, file) => {
    return async (dispatch) => {
        dispatch(addUploadTaskAction(uploadDirectoryPath, file))
        // 处理文件内容哈希值计算进程的变化
        const onCalculateHashProgress = ({ total, current }) => {
            updateCalculateProgress(file.uid, current / total * 100)
        }

        try {
            const contentHash = await getFileContentHash({ file: file, onProgress: onCalculateHashProgress })
            startUploadTask(file.uid, contentHash)
        } catch (err) {
            message.error(file.name + ' 上传失败')
        }
    }
}