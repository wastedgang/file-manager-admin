import axios from 'axios'

import actionTypes from './actionTypes'

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

export const login = (token, userInfo) => {
    return async (dispatch) => {
        window.localStorage.setItem('accessToken', token)
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
        dispatch(loginSuccess(userInfo))
    }
}

export const logout = () => {
    return async (dispatch) => {
        dispatch(loginFailed())
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('userInfo')
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