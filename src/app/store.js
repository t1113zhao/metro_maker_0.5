import { configureStore } from '@reduxjs/toolkit'
import presentReducer from '../reducers/presentReducer'
import undoRedoReducer from '../reducers/undoRedoReducer'

export default configureStore({
    reducer: presentReducer
})
