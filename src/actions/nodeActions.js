import {
    ADD_NODE,
    EDIT_NODE
} from './actionTypes'

export function addNode(latitude, longitude, trackID) {
    return {
        type: ADD_NODE,
        payload: {
            trackID: parseInt(trackID),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}

export function editNode(id, latitude, longitude, trackID) {
    return {
        type: EDIT_NODE,
        payload: {
            id: parseInt(id),
            trackID: parseInt(trackID),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}
