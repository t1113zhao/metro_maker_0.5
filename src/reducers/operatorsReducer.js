import { nextIDForArray } from '../utils/utils'
import {ADD_OPERATOR,
    EDIT_OPERATOR,
    REMOVE_OPERATOR,
    UNDO_REMOVE_OPERATOR} from '../actions/actionTypes'
const initialOperatorState = []

export default function operatorReducer (state= initialOperatorState, action){
    switch(action.type){
        case ADD_OPERATOR:{
            return doAddOperator(state,action);
        }
        case EDIT_OPERATOR:{
            return doEditOperator(state,action);
        }
        case REMOVE_OPERATOR:{
            return doRemoveOperator(state,action);
        }
        case UNDO_REMOVE_OPERATOR:{
            return doUnRemoveOperator(state,action);
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

function doRemoveOperator(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            deletedAt: action.payload.deletedAt
        }
    })
}

function doUnRemoveOperator(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            deletedAt: null
        }
    })
}

export function selectAllOperators(state) {
    return state.operators
}

export function selectOperatorsGivenId(state,id){
    return state.operators.filter(operator =>{
        return operator.id == id  
    })
}
