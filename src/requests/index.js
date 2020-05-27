import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const requestInterceptor = (config) => {
    if(config.method === 'post' || config.method === 'put' || config.method === 'patch') {
        if(config.data instanceof FormData) {
            return config
        }
        config.data = config.data || {}
        config.data = qs.stringify(config.data)
        return config
    }
    return config
}
axios.interceptors.request.use(requestInterceptor)

const underlineToCamelCase = (object) => {
    if (typeof object === 'object') {
        if (object.map) {
            // 数组
            return object.map((item) => underlineToCamelCase(item))
        } else {
            // 对象
            const newObject = {}
            for (let key in object) {
                let newKey = key
                if (typeof key === 'string') {
                    const strings = key.split('_')
                    newKey = strings.map((item, index) => {
                        return index === 0 ? item : (item.length === 0 ? '' : item[0].toUpperCase() + item.substr(1))
                    }).join('')
                }
                newObject[newKey] = underlineToCamelCase(object[key])
            }
            return newObject
        }
    }
    return object
}
const responseInterceptor = (response) => {
    if (response.status === 200 && response.data.code) {
        if (response.data.code === '000000') {
            response.data = underlineToCamelCase(response.data)
        } else {
            message.error(response.data.message)
        }
    }
    return response
}
axios.interceptors.response.use(responseInterceptor)

// 登录接口
export const login = (loginInfo) => {
    return axios.post('/api/v1/auth/login', loginInfo)
}

// 退出登录接口
export const logout = () => {
    return axios.post('/api/v1/auth/logout')
}

// 获取上传开始位置接口
export const getUploadStartPoint = (contentHash, fileSize) => {
    const requestParams = {content_hash: contentHash, file_size: fileSize}
    return axios.get('/api/v1/my_space/file/upload/start_point', {params: requestParams})
}

// 上传接口
