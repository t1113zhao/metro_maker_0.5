import { transferIDsGivenStationID } from '../reducers/transferReducer'
import { getTrackIDsByStationID } from '../reducers/trackReducer'
import {
    ADD_STATION,
    EDIT_STATION,
    REMOVE_STATION,
    RESTORE_STATION,
    MOVE_STATION
} from './actionTypes'

import store from '../app/store'

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
