import { nextIDForArray } from '../utils/utils'
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
        case REMOVE_OPERATOR:
        case REMOVE_LINE:{
            return doRemoveLines(state,action);
        }
        case UNDO_REMOVE_OPERATOR:
        case UNDO_REMOVE_LINE:{
            return doUnRemoveLines(state,action);
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

// Remove Operators calls this for every line that Operator contains
function doRemoveLines(state, action) {
    var lineIDset = new Set(action.payload.lineIDs)

    return state.map((item) => {
            if (lineIDset.has(item.id)) {
                return {
                    ...item,
                    deletedAt: action.payload.deletedAt
                }
            } else {
                return item
            }
        })
}

function doUnRemoveLines(state, action) {
    var lineIDset = new Set(action.payload.lineIDs)

    return state.map((item) => {
            if (lineIDset.has(item.id)) {
                return {
                    ...item,
                    deletedAt: null
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
        return line.operatorID == operatorID
    })
}

export function lineIDsGivenOperatorId (state, operatorID){
    return selectLinesGivenOperatorId(state,operatorID).map(line => {
            return line.id
        }
    )
}