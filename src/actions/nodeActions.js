import {
    MOVE_NODE
} from './actionTypes'

export function editNode(id, latitude, longitude, trackID) {
    return {
        type: MOVE_NODE,
        payload: {
            id: parseInt(id),
            trackID: parseInt(trackID),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}
