import { stationsGivenNodeID } from '../reducers/stationsReducer'
import {
    ADD_NODE,
    EDIT_NODE,
    REMOVE_NODE,
    UNDO_REMOVE_NODE
} from './actionTypes'

import store from '../app/store'

export function addNode(latitude, longitude) {
    return {
        type: ADD_NODE,
        payload: {
            latitude: latitude,
            longitude: longitude
        }
    }
}

export function editNode(id, latitude, longitude) {
    return {
        type: EDIT_NODE,
        payload: {
            id: parseInt(id),
            latitude: latitude,
            longitude: longitude
        }
    }
}

//TODO insert the dependencies for a Node.
export function removeNode(id) {
    return {
        type: REMOVE_NODE,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString(),
            stationID: stationGivenNodeID(store.getState(),id, false)
        }
    }
}

export function undoRemoveNode(id) {
    return {
        type: UNDO_REMOVE_NODE,
        payload: {
            id: parseInt(id),
            stationID: stationGivenNodeID(store.getState(),id, false)
        }
    }
}
