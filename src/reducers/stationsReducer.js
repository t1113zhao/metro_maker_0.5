import { genericMultiDelete, genericSingleDelete, genericMultiRestore, genericSingleRestore, nextIDForArray, filterDeleted } from '../utils/utils'
import {
    EDIT_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
    REMOVE_NODE,
    RESTORE_NODE
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
        case RESTORE_NODE: {
            return genericMultiRestore(
                state,
                action.payload.stationIDs
            )
        }
        case RESTORE_STATION: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default : {
            return state
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
    let output = state.stations.filter(station => {
        return station.nodeID == nodeID
    })

    if (!includeDeleted) {
        output = filterDeleted(output)
    }
    return output
}
