import { getById } from '../utils/utils'
import { ADD_NEW_TRACKROUTE_NODES, EDIT_TRACKROUTE_NODES, CLEAR_TRACKROUTE_NODES } from './actionTypes'

export function addNewTrackRoute(nodes, trackID) {
    return {
        type: ADD_NEW_TRACKROUTE_NODES,
        payload: {
            nodes: nodes,
            trackID: trackID
        }
    }
}

// start index = -1 is the starting station
// end index = nodes.length + 1 means the endingStation
// not inclusive of startIndex and endIndex
export function editTrackRoute(startIndex, endIndex, nodes, trackID) {
    return {
        type: EDIT_TRACKROUTE_NODES,
        payload: {
            startIndex: startIndex,
            endIndex: endIndex,
            nodes: nodes,
            trackID: trackID
        }
    }
}

export function clearTrackRoute(nodes, trackID) {
    return {
        type: CLEAR_TRACKROUTE_NODES,
        payload: {
            nodes: nodes,
            trackID: trackID
        }
    }
}

export function getInverseTrackRouteActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' }
        }
        case ADD_NEW_TRACKROUTE_NODES: {
            return clearTrackRoute(action.payload.nodes.slice(), action.payload.trackID)
        }
        case EDIT_TRACKROUTE_NODES: {
            let targetTrackRouteNodes = getById(state, action.payload.trackID).nodes

            let removeNodes = targetTrackRouteNodes.slice(action.payload.startIndex + 1, action.payload.endIndex)
            let replaceEndIndex = action.payload.startIndex + action.payload.nodes.length + 1
            return editTrackRoute(action.payload.startIndex, replaceEndIndex, removeNodes, action.payload.trackID)
        }
        case CLEAR_TRACKROUTE_NODES: {
            return addNewTrackRoute(action.payload.nodes.slice(), action.payload.trackID)
        }
    }
}
