import { createSlice } from '@reduxjs/toolkit';
import { nextIDForArray } from './mapReducer.js'

export const lineSlice = createSlice({
    name: 'lines',
    initialState: [],
    reducers: {
        addLine: (state, action) => {
            return addLine(state, action)
        },
        editLine: (state, action) => {
            return editLine(state, action)
        },
        removeLines: (state, action) => {
            return removeLines(state, action)
        }
    }
});

export const {
    addLine,
    editLine,
    removeLines
} = operatorSlice.actions;

export default operatorSlice.reducer;

function addLine(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state.lines),
            operatorID: action.payload.operatorID,
            name: action.payload.name,
            color: action.payload.color,
            linetype: action.payload.linetype,
            deletedAt: null
        }
    ]
}

function editLine(state, action) {
    return state.map(item => {
            if (item.id !== action.payload.id) {
                return item
            }
            return {
                ...item,
                name: action.payload.name,
                color: action.payload.color,
                linetype: action.payload.linetype
            }
        })
}

// Remove Operators calls this for every line that Operator contains
function removeLines(state, action) {

    return state.map((item) => {
            if (action.payload.lineIDs.has(item.id)) {
                return {
                    ...item,
                    deletedAt: action.payload.deletedAt
                }
            } else {
                return item
            }
        })
}

export function selectAllLines (state){
    return state.lines
}

export function selectLineGivenID(state,id){
    return state.lines.filter(line =>{
        return line.id == id
    })
}

export function selectLinesGivenOperatorId (state, operatorID){
    return state.lines.filter(line =>{
        line.operatorID = operatorID
    })
}

export function lineIDsGivenOperatorId (state, operatorID){
    return selectLinesGivenOperatorId(state,operatorID).map(
        line => line.id
    )
}