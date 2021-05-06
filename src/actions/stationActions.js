import { transferIDsGivenStationID } from '../reducers/transferReducer'
import {
    ADD_STATION,
    EDIT_STATION,
    REMOVE_STATION,
    RESTORE_STATION
} from './actionTypes'

import store from '../app/store'

export function addStation(description, name, latitude, longitude) {
    return {
        type: ADD_STATION,
        payload: {
            name: name,
            description: description,
            latitude: latitude,
            longitude: longitude
        }
    }
}

export function editStation(id, description, name) {
    return {
        type: EDIT_STATION,
        payload: {
            id: parseInt(id),
            name: name,
            description: description
        }
    }
}

export function removeStation(id) {
    return {
        type: REMOVE_STATION,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString(),
            transferIDs: transferIDsGivenStationID(store.getState(), parseInt(id), false)
        }
    }
}

export function restoreStation(id) {
    return {
        type: RESTORE_STATION,
        payload: {
            id: parseInt(id),
            transferIDs: transferIDsGivenStationID(store.getState(), parseInt(id), true)
        }
    }
}
