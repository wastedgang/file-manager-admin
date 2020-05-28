import { combineReducers } from 'redux'

import user from './user'
import uploads from './uploads'
import files from './files'

export default combineReducers({
    user,
    uploads,
    files
})
