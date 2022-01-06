import { configureStore } from '@reduxjs/toolkit'
import undoRedoReducer from '../reducers/undoRedoReducer'

export default configureStore({
    reducer: undoRedoReducer
})
