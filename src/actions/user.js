import { message } from 'antd'
import axios from 'axios'

import actionTypes from './actionTypes'

const startLogin = () => {
    return { type: actionTypes.START_LOGIN }
}

const loginSuccess = (userInfo) => {
    return { type: actionTypes.LOGIN_SUCCESS, payload: { userInfo } }
}

const refreshCurrentUserinfoAction = (userInfo) => {
    return { type: actionTypes.SET_CURRENT_USERINFO, payload: { userInfo } }
}

const loginFailed = () => {
    window.localStorage.removeItem('userInfo')
    return { type: actionTypes.LOGIN_FAILED }
}

export const login = (loginInfo) => {
    return async (dispatch) => {
        dispatch(startLogin())
        try {
            const response = await axios.post('/api/v1/auth/login', loginInfo)
            if (response.data.code === '000000') {
                window.localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))
                dispatch(loginSuccess(response.data.data.user))
                return
            }
            dispatch(loginFailed())
        } catch (err) {
            dispatch(loginFailed())
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        dispatch(loginFailed())
        try {
            await axios.post('/api/v1/auth/logout')
        } catch (err) {
            message.error('网络错误')
        }
    }
}

export const refreshCurrentUserinfo = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/v1/current_user/info')
            if (response.data.code === '000000') {
                window.localStorage.setItem('userInfo', JSON.stringify(response.data.data.user))
                dispatch(refreshCurrentUserinfoAction(response.data.data.user))
                return
            }
        } catch(err) {}
    }
}