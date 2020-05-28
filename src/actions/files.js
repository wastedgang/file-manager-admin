import { message } from 'antd'
import axios from 'axios'
import actionTypes from './actionTypes'

const startLoadingFileList = () => {
    return { type: actionTypes.START_LOADING_FILE_LIST }
}

const setFileList = (files) => {
    return { type: actionTypes.SET_FILE_LIST, payload: { files } }
}

const finishLoadingFileList = () => {
    return { type: actionTypes.FINISH_LOADING_FILE_LIST }
}

export const refreshFileList = ({ path, sort }) => {
    return async (dispatch) => {
        dispatch(startLoadingFileList())
        try {
            const requestParams = { directory_path: path }
            if (sort) {
                requestParams.sort = sort
            }
            const response = await axios.get('/api/v1/my_space/files', { params: requestParams })
            if (response.data.code === '000000') {
                dispatch(setFileList(response.data.data.files))
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
        } finally {
            dispatch(finishLoadingFileList())
        }
    }
}
