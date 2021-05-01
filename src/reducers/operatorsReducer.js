import { genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {ADD_OPERATOR,
    EDIT_OPERATOR,
    REMOVE_OPERATOR,
    UNDO_REMOVE_OPERATOR} from '../actions/actionTypes'
const initialState = []

export default function operatorReducer (state= initialState, action){
    switch(action.type){
        case ADD_OPERATOR:{
            return doAddOperator(state,action);
        }
        case EDIT_OPERATOR:{
            return doEditOperator(state,action);
        }
        case REMOVE_OPERATOR:{
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
                );
        }
        case UNDO_REMOVE_OPERATOR:{
            return genericSingleRestore(
                state,
                action.payload.id
                );
        }
        default:
            return state;
    }
}

function doAddOperator(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            name: action.payload.name,
            color: action.payload.color,
            deletedAt: null
        }
    ]
}

function doEditOperator(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            color: action.payload.color
        }
    })
}

export function selectAllOperators(state) {
    return state.operators.filter(operator =>{
        return !operator.deletedAt
    })
}

export function selectOperatorsGivenId(state,id){
    return state.operators.filter(operator =>{
        return operator.id == id && !operator.deletedAt
    })
}
