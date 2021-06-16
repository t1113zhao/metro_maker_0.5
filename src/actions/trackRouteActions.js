import { filterByIds, getById, nextIDForArray } from '../utils/utils'
import {
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    MERGE_SEGMENTS,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT,
} from './actionTypes'

import {getNodesThatOnlyGivenSegmentsConnectTo} from '../reducers/trackRouteReducer'

export function addStraightSegment(
    latA, lngA,
    latB, lngB,
    node_A_ID, node_B_ID,
    trackID
) {
    return {
        type: ADD_STRAIGHT_SEGMENT,
        payload: {
            latitudes: [parseFloat(latA), parseFloat(latB)],
            longitudes: [parseFloat(lngA), parseFloat(lngB)],
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
            latitudes: [parseFloat(latA), parseFloat(latB), parseFloat(latC)],
            longitudes: [parseFloat(lngA), parseFloat(lngB), parseFloat(lngC)],
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

export function curvedToStraight(segmentID, trackID) {
    return {
        type: CURVED_TO_STRAIGHT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}

export function breakSegment(segmentID, trackID) {
    return {
        type: BREAK_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}

export function mergeSegments(segmentA_ID, segmentB_ID, trackID) {
    return {
        type: MERGE_SEGMENTS,
        payload: {
            segmentsIDs: [parseInt(segmentA_ID), parseInt(segmentB_ID)],
            trackID: parseInt(trackID),
        }
    }
}

export function removeSegment(segmentID, trackID) {
    return {
        type: REMOVE_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID),
        }
    }
}

export function restoreSegment(segmentID, trackID, segmentToRestore, nodesToRestore) {
    return {
        type: RESTORE_SEGMENT,
        payload: {
            id: parseInt(segmentID),
            trackID: parseInt(trackID),
            segmentToRestore: segmentToRestore,
            nodesToRestore: nodesToRestore
        }
    }
}

export function getInverseTrackRouteActions(state, action) {
    switch (action.type) {
        default: {
            return { type: "ERROR" }
        }
        case ADD_STRAIGHT_SEGMENT:
        case ADD_CURVED_SEGMENT: {
            let targetTrack = getById(state, action.payload.trackID)
            let targetSegments = targetTrack.segments
            return removeSegment(nextIDForArray(targetSegments), action.payload.trackID)
        }
        case STRAIGHT_TO_CURVED: {
            return curvedToStraight(action.payload.segmentID, action.payload.trackID)
        }
        case CURVED_TO_STRAIGHT: {
            return straightToCurved(action.payload.segmentID, action.payload.trackID)
        }
        case BREAK_SEGMENT: {
            let targetTrack = getById(state, action.payload.trackID)
            let targetSegments = targetTrack.segments
            return mergeSegments(action.payload.id, nextIDForArray(targetSegments), action.payload.trackID)
        }
        case MERGE_SEGMENTS: {
            return breakSegment(action.payload.segmentsIDs[0], action.payload.trackID)
        }
        case REMOVE_SEGMENT: {
            let targetTrack = getById(state, action.payload.trackID)
            let targetSegments = targetTrack.segments
            let targetSegment = getById(targetSegments, action.payload.segmentID)
            let removeNodeIDs = getNodesThatOnlyGivenSegmentsConnectTo(action.payload.segmentID, targetSegments, false)
            let removeNodes = filterByIds(targetTrack.nodes, removeNodeIDs)
            return restoreSegment(action.payload.id, action.payload.trackID, targetSegment, removeNodes)
        }
        case RESTORE_SEGMENT: {
            return removeSegment(action.payload.id, action.payload.trackID)
        }
    }
}