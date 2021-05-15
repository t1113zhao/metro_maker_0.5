import { genericSingleDelete, genericSingleRestore, nextIDForArray, filterDeleted, filterByIds } from '../utils/utils'
import {
    EDIT_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
    ADD_STATION
} from '../actions/actionTypes'
const initialState = []

export default function stationReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_STATION: {
            return doAddStation(state, action)
        }
        case EDIT_STATION: {
            return doEditStation(state, action)
        }
        case REMOVE_STATION: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_STATION: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default: {
            return state
        }
    }
}

function doAddStation(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray,
            name: action.payload.name,
            description: action.payload.description,
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
            deletedAt: null
        }
    ]
}

function doEditStation(state, action) {
    return state.map(item => {
        if (item.id !== action.payload.id) {
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
        return station.nodeID === nodeID
    })
    filterDeleted(output, includeDeleted)
    return output
}
