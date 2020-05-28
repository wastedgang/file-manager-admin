import actionTypes from '@/actions/actionTypes'

const initState = {
    uploadTaskList: [],
    uploadedCount: 0,
}

export default (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_UPLOAD_TASK:
            const { uploadDirectoryPath, file } = action.payload
            return {
                ...state,
                uploadTaskList: [{
                    id: file.uid,
                    uploadDirectoryPath: uploadDirectoryPath,
                    filename: file.name,
                    fileSize: file.size,
                    file: file,
                    status: 'STARTING',
                    uploadProgress: 0,
                    hashCalculateProgress: 0,
                    cancelSource: null,
                }, ...state.uploadTaskList]
            }
        case actionTypes.START_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    if (item.id !== action.payload.id) {
                        return item
                    }
                    return { ...item, status: 'UPLOADING', contentHash: action.payload.contentHash, cancelSource: action.payload.cancelSource }
                })
            }
        case actionTypes.RESTART_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    if (item.id !== action.payload.id) {
                        return item
                    }
                    return { ...item, status: 'UPLOADING', cancelSource: action.payload.cancelSource }
                })
            }
        case actionTypes.REMOVE_UPLOAD_TASK:
            const uploadTaskList = state.uploadTaskList.filter(item => item.id !== action.payload.id)
            return {
                ...state,
                uploadedCount: uploadTaskList.filter(item => item.status === 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        case actionTypes.UPDATE_UPLOAD_TASK_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, uploadProgress: parseInt(action.payload.progress.toFixed(0)) } : item
                })
            }
        case actionTypes.UPDATE_UPLOAD_TASK_CALCULATE_PROGRESS:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, hashCalculateProgress: parseInt(action.payload.progress.toFixed(0)) } : item
                })
            }
        case actionTypes.CANCEL_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, status: 'CANCELED', cancelSource: null } : item
                })
            }
        case actionTypes.FINISH_UPLOAD_TASK:
            return {
                ...state,
                uploadedCount: state.uploadedCount + 1,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, status: 'UPLOADED', uploadProgress: 100, cancelSource: null, file: null } : item
                })
            }
        default:
            return state
    }
}