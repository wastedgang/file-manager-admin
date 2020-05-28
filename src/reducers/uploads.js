import actionTypes from '@/actions/actionTypes'

const initState = {
    uploadTaskList: [],
    uploadedCount: 0,
}

export default (state = initState, action) => {
    switch (action.type) {
        case actionTypes.START_UPLOAD_TASK:
            const { uploadDirectoryPath, file, cancelSource } = action.payload
            return {
                ...state,
                uploadTaskList: [{
                    id: file.uid,
                    uploadDirectoryPath: uploadDirectoryPath,
                    filename: file.name,
                    fileSize: file.size,
                    file: file,
                    status: 'UPLOADING',
                    progress: 0,
                    cancelSource: cancelSource,
                }, ...state.uploadTaskList]
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
                    return item.id === action.payload.id ? { ...item, progress: parseInt(action.payload.progress.toFixed(0)) } : item
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
                    return item.id === action.payload.id ? { ...item, status: 'UPLOADED', progress: 100, cancelSource: null, file: null } : item
                })
            }
        default:
            return state
    }
}