import { message } from 'antd'
import axios from 'axios'

import actionTypes from './actionTypes'

const removeUploadTaskAction = (id) => {
    return { type: actionTypes.REMOVE_UPLOAD_TASK, payload: { id } }
}

const removeUploadedTasksAction = () => {
    return { type: actionTypes.REMOVE_UPLOADED_TASKS }
}

const finishUploadTaskAction = (id) => {
    return { type: actionTypes.FINISH_UPLOAD_TASK, payload: { id } }
}

const cancelUploadTaskAction = (id) => {
    return { type: actionTypes.CANCEL_UPLOAD_TASK, payload: { id } }
}

const startUploadTaskAction = (directoryPath, file, cancelSource) => {
    return { type: actionTypes.START_UPLOAD_TASK, payload: { directoryPath, file, cancelSource } }
}

const restartUploadTaskAction = (id, cancelSource) => {
    return { type: actionTypes.RESTART_UPLOAD_TASK, payload: { id, cancelSource } }
}

const updateUploadProgressAction = (id, progress) => {
    return { type: actionTypes.UPDATE_UPLOAD_TASK_UPLOAD_PROGRESS, payload: { id, progress } }
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

export const removeUploadedTasks = () => {
    return dispatch => {
        dispatch(removeUploadedTasksAction())
    }
}

export const startUploadTask = (directoryPath, file, isRestart) => {
    return async (dispatch) => {
        // 计算上传URL和file参数
        const uploadUrl = '/api/v1/my_space/file/upload' + directoryPath
        const formData = new FormData()
        formData.append('file', file)
        const cancelSource = axios.CancelToken.source()
        const config = { cancelToken: cancelSource.token }

        // 设置上传进度callback
        config.onUploadProgress = (progressEvent) => {
            const current = progressEvent.loaded
            const total = progressEvent.total
            dispatch(updateUploadProgress(file.uid, current / total * 100))
        }

        // 发送上传请求
        try {
            if (isRestart) {
                dispatch(restartUploadTaskAction(file.uid, cancelSource))
            } else {
                dispatch(startUploadTaskAction(directoryPath, file, cancelSource))
            }
            const response = await axios.post(uploadUrl, formData, config)
            if (response.status === 200 && response.data.code === '000000') {
                // 上传成功
                message.success(file.name + '上传成功')
                dispatch(finishUploadTaskAction(file.uid))
                return
            }
        } catch (err) {
            // 手动取消不报错
            if (axios.isCancel(err)) {
                return
            }
            // 上传失败
            message.error(file.name + '上传失败')
            dispatch(cancelUploadTaskAction(file.uid))
        }
        // 上传失败
        dispatch(cancelUploadTaskAction(file.uid))
    }
}