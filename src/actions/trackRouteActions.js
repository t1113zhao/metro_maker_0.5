import {
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT
} from './actionTypes'

export function addStraightSegment(
    latA, lngA, 
    latB, lngB, 
    node_A_ID, node_B_ID,
    trackID
    ) {
    return {
        type: ADD_STRAIGHT_SEGMENT,
        payload: {
            latitudes: [latA, latB],
            longitudes: [lngA, lngB],
            nodeIDs: [parseInt(node_A_ID), parseInt(node_B_ID)],
            trackID: parseInt(trackID)
        }
    }
}

export function addCurvedSegment(
    latA, lngA,
    latB, lngB,
    latC, lngC,
    node_A_ID,
    node_B_ID,
    node_C_ID,
    trackID
) {
    return {
        type: ADD_CURVED_SEGMENT,
        payload: {
            latitudes: [latA, latB, latC],
            longitudes: [lngA, lngB, lngC],
            nodeIDs: [parseInt(node_A_ID), parseInt(node_B_ID), parseInt(node_C_ID)],
            trackID: parseInt(trackID)
        }
    }
}

export function straightToCurved(segmentID, trackID) {
    return {
        type: STRAIGHT_TO_CURVED,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}

export function curvedToStraight(segmentID) {
    return {
        type: CURVED_TO_STRAIGHT,
        payload: {
            id: segmentID,
            trackID: trackID
        }
    }
}

export function breakSegment(segmentID) {
    return {
        type: BREAK_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}

export function removeSegment(trackID, segmentID) {
    return {
        type: REMOVE_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID),
            deletedAt: new Date().toISOString(),
        }
    }
}

export function restoreSegment(segmentID) {
    return {
        type: RESTORE_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}
