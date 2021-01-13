import { createSlice } from '@reduxjs/toolkit';
import { nextIDForArray } from './mapReducer.js'
export const operatorSlice = createSlice({
    name: 'operators',
    initialState: [],
    reducers: {
        addOperator: (state, action) => {
            return addOperator(state, action);
        },
        editOperator: (state, action) => {
            return editOperator(state, action);
        },
        removeOperator: (state, action) => {
            return removeOperator(state, action)
        }
    }
});

export const {
    addOperator,
    editOperator,
    removeOperator
} = operatorSlice.actions;

export default operatorSlice.reducer;

function addOperator(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state.operators),
            name: action.payload.name,
            color: action.payload.color,
            deletedAt: null
        }
    ]
}

function editOperator(state, action) {
    return state.map(item => {
        if (item.id !== action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            color: action.payload.color
        }
    })
}

export function removeOperator(state, action) {
    return state.map(item => {
        if (item.id !== action.payload.id) {
            return item
        }
        return {
            ...item,
            deletedAt: action.payload.deletedAt
        }
    })
}

function selectAllOperators(state) {
    return state.operators
}

function selectOperatorsGivenId(state,id){
    return state.operators.filter(operator =>{
        return operator.id == id
    })
}