import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src\reducers\rootReducer.js';

export default configureStore({
    operators: rootReducer,
    lines: rootReducer,
    services: rootReducer
})