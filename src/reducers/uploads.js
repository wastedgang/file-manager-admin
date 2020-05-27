import actionTypes from '@/actions/actionTypes'

const initState = {
    uploadTaskList: []
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
                }, ...state.uploadTaskList]
            }
        case actionTypes.START_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    if (item.id !== action.payload.id) {
                        return item

                    }
                    return { ...item, status: 'UPLOADING', contentHash: action.payload.contentHash }
                })
            }
        case actionTypes.REMOVE_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.filter(item => item.id !== action.payload.id)
            }
        case actionTypes.UPDATE_UPLOAD_TASK_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, uploadProgress: action.payload.progress.toFixed(0) } : item
                })
            }
        case actionTypes.UPDATE_UPLOAD_TASK_CALCULATE_PROGRESS:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, hashCalculateProgress: action.payload.progress.toFixed(0) } : item
                })
            }
        case actionTypes.CANCEL_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, status: 'CANCELED' } : item
                })
            }
        case actionTypes.FINISH_UPLOAD_TASK:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, status: 'UPLOADED', uploadProgress: 100 } : item
                })
            }
        default:
            return state
    }
}