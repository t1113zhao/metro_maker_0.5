import { getById } from '../utils/utils'
import { MOVE_NODE } from './actionTypes'

/**
 * Nodes are stored as [latitude, longitude]
 */

export function moveNode(index, latitude, longitude, trackID) {
    return {
        type: MOVE_NODE,
        payload: {
            index: parseInt(index),
            trackID: parseInt(trackID),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    }
}

export function getInverseNodeActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case MOVE_NODE: {
            // nodes are stored as [latitude, longitude]
            let targetTrack = getById(state, action.payload.trackID)
            let targetNode = targetTrack.nodes[action.payload.index]
            return moveNode(action.payload.index, targetNode[0], targetNode[1], action.payload.trackID)
        }
    }
}
