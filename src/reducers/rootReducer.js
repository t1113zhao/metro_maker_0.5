import {combineReducers} from 'redux';
import operatorReducer from '../reducers/operatorsReducer';
import linesReducer from '../reducers/linesReducer';
import servicesReducer from '../reducers/servicesReducer';

const rootReducer = combineReducers({
    operators: operatorReducer,
    lines: linesReducer,
    services: servicesReducer
});

export default rootReducer;