import { transferIDsGivenStationID } from '../reducers/transferReducer'
import { getTrackIDsByStationID } from '../reducers/trackRouteReducer'
import {
    ADD_STATION,
    UNDO_ADD_STATION,
    EDIT_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
    MOVE_STATION
} from './actionTypes'

import store from '../app/store'
import { getById, nextIDForArray } from '../utils/utils'

export function addStation(description, name, latitude, longitude) {
    return {
        type: ADD_STATION,
        payload: {
            name: name,
            description: description,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}

export function undoAddStation(id) {
    return {
        type: UNDO_ADD_STATION,
        payload: {
            id: parseInt(id),
        }
    }
}

export function moveStation(id, latitude, longitude) {
    return {
        type: MOVE_STATION,
        payload: {
            id: parseInt(id),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}

export function editStation(id, description, name) {
    return {
        type: EDIT_STATION,
        payload: {
            id: parseInt(id),
            name: name,
            description: description,
        }
    }
}

export function removeStation(id) {
    return {
        type: REMOVE_STATION,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString(),
            trackIDs: getTrackIDsByStationID(store.getState().tracks, parseInt(id), false),
            transferIDs: transferIDsGivenStationID(store.getState().transfers, parseInt(id), false)
        }
    }
}

export function restoreStation(id) {
    return {
        type: RESTORE_STATION,
        payload: {
            id: parseInt(id),
            trackIDs: getTrackIDsByStationID(store.getState().tracks, parseInt(id), true),
            transferIDs: transferIDsGivenStationID(store.getState().transfers, parseInt(id), true)
        }
    }
}

export function getInverseStationActions(state, action) {
    switch (action.type) {
        default: {
            return { type: "ERROR" } // this should not happen
        }
        case ADD_STATION: {
            return undoAddStation(nextIDForArray(state))
        }
        case UNDO_ADD_STATION: {
            let targetStation = getById(state, action.payload.id)
            return addStation(targetStation.description, targetStation.name, targetStation.latitude, targetStation.longitude)
        }
        case EDIT_STATION: {
            let targetStation = getById(state, action.payload.id)
            return editStation(targetStation.id, targetStation.description, targetStation.name)
        }
        case MOVE_STATION: {
            let targetStation = getById(state, action.payload.id)
            return moveStation(targetStation.id, targetStation.latitude, targetStation.longitude)
        }
        case REMOVE_STATION: {
            return restoreStation(action.payload.id)
        }
        case RESTORE_STATION: {
            return removeStation(action.payload.id)
        }
    }
}
