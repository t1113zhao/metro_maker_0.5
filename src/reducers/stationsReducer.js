import { genericMultiDelete, genericSingleDelete, genericMultiRestore, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    EDIT_STATION,
    REMOVE_STATION,
    UNDO_REMOVE_STATION,
    REMOVE_NODE,
    UNDO_REMOVE_NODE
} from '../actions/actionTypes'
const initialState = []

export default function stationReducer(state = initialState, action) {
    switch (action.type) {
        case EDIT_STATION: {
            return doEditStation(state, action)
        }
        case REMOVE_NODE: {
            return genericMultiDelete(
                state,
                action.payload.stationIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_STATION: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case UNDO_REMOVE_NODE: {
            return genericMultiRestore(
                state,
                action.payload.stationIDs
            )
        }
        case UNDO_REMOVE_STATION: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
    }
}

export function addStation(state, nodeID, action) {
    return [
        ...state,
        {
            id: nextIDForArray,
            nodeID: nodeID,
            name: action.payload.name,
            description: action.payload.description
        }
    ]
}

function doEditStation(state, action) {
    return state.map(item => {
        if (item.id != action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            description: action.payload.description
        }
    })
}

export function stationGivenNodeID(state, nodeID, includeDeleted) {
    if (includeDeleted) {
        return state.stations.filter(station => {
            return station.nodeID == nodeID
        })[0]
    } else {
        return state.stations.filter(station => {
            return station.nodeID == nodeID && !station.deleted
        })[0]
    }
}
