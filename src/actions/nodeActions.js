import { stationsGivenNodeID } from '../reducers/stationsReducer'
import {
    ADD_NODE,
    EDIT_NODE,
    REMOVE_NODE,
    RESTORE_NODE
} from './actionTypes'

import store from '../app/store'

export function addNode(latitude, longitude, trackID) {
    return {
        type: ADD_NODE,
        payload: {
            trackID: parseInt(trackID),
            latitude: latitude,
            longitude: longitude
        }
    }
}

export function editNode(id, latitude, longitude, trackID) {
    return {
        type: EDIT_NODE,
        payload: {
            id: parseInt(id),
            trackID: parseInt(trackID),
            latitude: latitude,
            longitude: longitude
        }
    }
}

//TODO insert the dependencies for a Node.
export function removeNode(id, trackID) {
    return {
        type: REMOVE_NODE,
        payload: {
            id: parseInt(id),
            trackID: parseInt(trackID),
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreNode(id, trackID) {
    return {
        type: RESTORE_NODE,
        payload: {
            id: parseInt(id),
            trackID: parseInt(trackID)
        }
    }
}
