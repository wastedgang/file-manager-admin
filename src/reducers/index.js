import { combineReducers } from 'redux'

import user from './user'
import uploads from './uploads'

export default combineReducers({
    user,
    uploads,
})
