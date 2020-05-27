import actionTypes from './actionTypes'
import { login as loginRequest } from '@/requests'
import axios from 'axios'

const startLogin = () => {
    return { type: actionTypes.START_LOGIN }
}

const loginSuccess = (userInfo) => {
    return { type: actionTypes.LOGIN_SUCCESS, payload: { userInfo } }
}

const loginFailed = () => {
    window.localStorage.removeItem('userInfo')
    return { type: actionTypes.LOGIN_FAILED }
}

export const login = (loginInfo) => {
    return dispatch => {
        dispatch(startLogin())
        loginRequest(loginInfo)
            .then((res) => {
                if (res.data.code === '000000') {
                    window.localStorage.setItem('userInfo', JSON.stringify(res.data.data.user))
                    dispatch(loginSuccess(res.data.data.user))
                } else {
                    dispatch(loginFailed())
                }
            })
            .catch(() => {
                dispatch(loginFailed())
            })
    }
}

export const logout = () => {
    return async (dispatch) => {
        dispatch(loginFailed())
        try {
            await axios.post('/api/v1/auth/logout')
        } catch (err) { }
    }
}