import { configureStore } from '@reduxjs/toolkit';
import presentReducer from '../reducers/rootReducer';

export default configureStore({
    reducer:presentReducer
});
