import actionTypes from '@/actions/actionTypes'

const isLogin = Boolean(window.localStorage.getItem('userInfo'))
let userInfo = null
if (window.localStorage.getItem('userInfo')) {
    userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
}

const initState = {
    userInfo: userInfo,
    isLogin: isLogin,
    isLoading: false,
}

export default (state = initState, action) => {
    switch (action.type) {
        case actionTypes.START_LOGIN:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                userInfo: action.payload.userInfo,
                isLogin: true,
                isLoading: false,
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
                isLoading: false
            }
        default:
            return state
    }
}