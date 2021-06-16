import { getById } from '../utils/utils'
import {
    MOVE_NODE
} from './actionTypes'

export function moveNode(id, latitude, longitude, trackID) {
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

export function getInverseNodeActions(state, action) {
    switch (action.type) {
        default: {
            return { type: "ERROR" }
        }
        case MOVE_NODE: {
            let targetTrack = getById(state, action.payload.trackID)
            let targetNode = getById(targetTrack.nodes, action.payload.id)
            return moveNode(targetNode.id, targetNode.latitude, targetNode.longitude, action.payload.trackID)
        }
    }
}