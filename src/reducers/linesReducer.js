import { genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {ADD_LINE,
    EDIT_LINE,
    REMOVE_LINE,
    UNDO_REMOVE_LINE,
    REMOVE_OPERATOR,
    UNDO_REMOVE_OPERATOR} from '../actions/actionTypes'

const initialLineState = [];

export default function lineReducer (state = initialLineState, action){
    switch(action.type){
        case ADD_LINE:{
            return doAddLine(state,action);
        }
        case EDIT_LINE:{
            return doEditLine(state,action);
        }
        case REMOVE_OPERATOR:{
            return genericMultiDelete(
                state,
                action.payload.lineIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_LINE:{
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case UNDO_REMOVE_OPERATOR:{
            return genericMultiRestore(
                state,
                action.payload.lineIDs
            )
        }
        case UNDO_REMOVE_LINE:{
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default:
            return state;
    }
}

function doAddLine(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            operatorID: action.payload.operatorID,
            name: action.payload.name,
            color: action.payload.color,
            linetype: action.payload.linetype,
            deletedAt: null
        }
    ]
}

function doEditLine(state, action) {
    return state.map(item => {
            if (item.id != action.payload.id) {
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

export function selectAllLines (state){
    return state.lines.filter(line =>{
        return !line.deletedAt
    })
}

export function selectLineGivenID(state,id){
    return state.lines.filter(line =>{
        return line.id === id && !line.deletedAt
    })
}

export function selectLinesGivenOperatorId (state, operatorID){
    return state.lines.filter(line =>{
        return line.operatorID === operatorID && !line.deletedAt
    })
}

export function lineIDsGivenOperatorId (state, operatorID){
    return selectLinesGivenOperatorId(state,operatorID).map(line => {
            return line.id
        }
    )
}