import actionTypes from '@/actions/actionTypes'

const initState = {
    isLoading: false,
    files: [],
}

export default (state = initState, action) => {
    switch (action.type) {
        case actionTypes.START_LOADING_FILE_LIST:
            return { ...state, isLoading: true, files: [] }
        case actionTypes.FINISH_LOADING_FILE_LIST:
            return { ...state, isLoading: false }
        case actionTypes.SET_FILE_LIST:
            return { ...state, files: action.payload.files }
        default:
            return state
    }
}