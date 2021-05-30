import { genericSingleDelete, genericSingleRestore, nextIDForArray, filterDeleted, filterByIds } from '../utils/utils'
import {
    ADD_STATION,
    EDIT_STATION,
    MOVE_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
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
        case MOVE_STATION: {
            return doMoveStation(state, action)
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
            id: nextIDForArray(state),
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

function doMoveStation(state, action) {
    return state.map(item => {
        if (item.id !== action.payload.id) {
            return item
        }
        return {
            ...item,
            latitude: action.payload.latitude,
            longitude: action.payload.longitude,
        }
    })
}

export function selectStationsGivenStationIDs(state, stationIDs, includeDeleted) {
    let output = filterByIds(state.stations, stationIDs)
    return filterDeleted(output, includeDeleted)
}
