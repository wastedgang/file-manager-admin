import actionTypes from '@/actions/actionTypes'

const initState = {
    uploadTaskList: [],
    uploadedCount: 0,
    uploadingCount: 0,
}

export default (state = initState, action) => {
    let uploadTaskList = null
    switch (action.type) {
        case actionTypes.START_UPLOAD_TASK:
            const { directoryPath, file, cancelSource } = action.payload
            uploadTaskList = [{
                id: file.uid,
                uploadDirectoryPath: directoryPath,
                filename: file.name,
                fileSize: file.size,
                file: file,
                status: 'UPLOADING',
                progress: 0,
                cancelSource: cancelSource,
            }, ...state.uploadTaskList]
            return {
                ...state,
                uploadingCount: uploadTaskList.filter(item => item.status !== 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        case actionTypes.REMOVE_UPLOAD_TASK:
            uploadTaskList = state.uploadTaskList.filter(item => item.id !== action.payload.id)
            return {
                ...state,
                uploadingCount: uploadTaskList.filter(item => item.status !== 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        case actionTypes.RESTART_UPLOAD_TASK:
            uploadTaskList = state.uploadTaskList.map(item => {
                if (item.id !== action.payload.id) {
                    return item
                }
                return { ...item, status: 'UPLOADING', cancelSource: action.payload.cancelSource, progress: 0 }
            })
            return {
                ...state,
                uploadingCount: uploadTaskList.filter(item => item.status !== 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        case actionTypes.UPDATE_UPLOAD_TASK_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadTaskList: state.uploadTaskList.map(item => {
                    return item.id === action.payload.id ? { ...item, progress: parseInt(action.payload.progress.toFixed(0)) } : item
                })
            }
        case actionTypes.CANCEL_UPLOAD_TASK:
            uploadTaskList = state.uploadTaskList.map(item => {
                return item.id === action.payload.id ? { ...item, status: 'CANCELED', cancelSource: null } : item
            })
            return {
                ...state,
                uploadingCount: uploadTaskList.filter(item => item.status !== 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        case actionTypes.FINISH_UPLOAD_TASK:
            uploadTaskList = state.uploadTaskList.map(item => {
                return item.id === action.payload.id ? { ...item, status: 'UPLOADED', progress: 100, cancelSource: null, file: null } : item
            })
            return {
                ...state,
                uploadingCount: uploadTaskList.filter(item => item.status !== 'UPLOADED').length,
                uploadTaskList: uploadTaskList
            }
        default:
            return state
    }
}