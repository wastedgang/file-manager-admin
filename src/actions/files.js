import { message } from 'antd'
import axios from 'axios'
import actionTypes from './actionTypes'

const startLoadingFileList = () => {
    return { type: actionTypes.START_LOADING_FILE_LIST }
}

const setFileList = (files) => {
    return { type: actionTypes.SET_FILE_LIST, payload: { files } }
}

export const refreshFileList = ({ path, sort }) => {
    return async (dispatch) => {
        const now = new Date()
        dispatch(startLoadingFileList())
        console.log('dispatchStartLoadingFileList', new Date() - now)
        try {
            const requestParams = { directory_path: path }
            if (sort) {
                requestParams.sort = sort
            }
            const response = await axios.get('/api/v1/my_space/files', { params: requestParams })
            console.log('request', new Date() - now)
            if (response.data.code === '000000') {
                dispatch(setFileList(response.data.data.files))
                console.log('dispatchSetFileList', new Date() - now)
            }
        } catch (err) {
            message.error('获取存储空间列表失败')
        }
        console.log('total', new Date() - now)
    }
}
