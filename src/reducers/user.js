import actionTypes from '@/actions/actionTypes'

const isLogin = Boolean(window.localStorage.getItem('userInfo') && window.localStorage.getItem('accessToken'))
let userInfo = null
if (window.localStorage.getItem('userInfo') && window.localStorage.getItem('accessToken')) {
    userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
}

const initState = {
    userInfo: userInfo,
    isLogin: isLogin,
}

export default (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                userInfo: action.payload.userInfo,
                isLogin: true,
            }
        case actionTypes.SET_CURRENT_USERINFO:
            return {
                ...state,
                userInfo: action.payload.userInfo,
            }
        case actionTypes.LOGIN_FAILED:
            return {
                userInfo: null,
                isLogin: false,
            }
        default:
            return state
    }
}