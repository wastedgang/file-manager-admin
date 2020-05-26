import axios from 'axios'
import { message } from 'antd'

export const service = axios.create()

service.interceptors.request.use((config) => {
    return config
})

service.interceptors.response.use((response) => {
    if (response.status === 200 && response.data.code && response.data.code !== '000000') {
        message.error(response.data.message)
    }
    return response
})

// 登录接口
export const login = (loginInfo) => {
    return service.post('/api/v1/auth/login', loginInfo)
}

// 退出登录接口
export const logout = () => {
    return service.post('/api/v1/auth/logout')
}