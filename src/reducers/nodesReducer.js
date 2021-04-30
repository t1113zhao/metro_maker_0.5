import { genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    ADD_NODE,
    EDIT_NODE,
    REMOVE_NODE,
    UNDO_REMOVE_NODE
} from '../actions/actionTypes'

const initialNodesState = []

export default function nodesReducer(state = initialNodesState, action) {
    switch (action.type) {
        case ADD_NODE: {
            return doAddNode(state, action)
        }
        case EDIT_NODE: {
            return doEditNode(state, action)
        }
        case REMOVE_NODE: {
            return genericSingleDelete(state, action.payload.id)
        }
        case UNDO_REMOVE_NODE: {
            return genericSingleRestore(state, action)
        }
        default:
            return state;

    }
}

export function addNodeExtern(state, newID, action){
    return [
        ...state,
        {
            id: newID,
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
            deletedAt: null
        }
    ]
}

function doAddNode(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
            deletedAt: null
        }
    ]
}

function doEditNode(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            latitude: action.payload.latitude,
            longitude: action.payload.longitude
        }
    })
}
