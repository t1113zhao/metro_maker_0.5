import { filterByIds, getById, nextIDForArray } from "../utils/utils"
import {
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    UNDO_BREAK_SEGMENT,
    MERGE_SEGMENTS,
    UNDO_MERGE_SEGMENTS,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT
} from "./actionTypes"

import { getNodesThatOnlyGivenSegmentsConnectTo, removeSegmentsFromTrackRoute } from "../reducers/trackRouteReducer"
import { difference } from "underscore"

export function addStraightSegment(latA, lngA, latB, lngB, node_A_ID, node_B_ID, trackID) {
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

export function addCurvedSegment(latA, lngA, latB, lngB, latC, lngC, node_A_ID, node_B_ID, node_C_ID, trackID) {
    return {
        type: ADD_CURVED_SEGMENT,
        payload: {
            trackID: parseInt(trackID),
            latitudes: [parseFloat(latA), parseFloat(latB), parseFloat(latC)],
            longitudes: [parseFloat(lngA), parseFloat(lngB), parseFloat(lngC)],
            nodeIDs: [parseInt(node_A_ID), parseInt(node_B_ID), parseInt(node_C_ID)]
        }
    }
}

//Turn a straight segment into a curved one
export function straightToCurved(segmentID, trackID) {
    return {
        type: STRAIGHT_TO_CURVED,
        payload: {
            trackID: parseInt(trackID),
            segmentID: parseInt(segmentID)
        }
    }
}

// Turn a curved segment straight
export function curvedToStraight(segmentID, trackID) {
    return {
        type: CURVED_TO_STRAIGHT,
        payload: {
            segmentID: parseInt(segmentID),
            trackID: parseInt(trackID)
        }
    }
}

export function breakSegment(segmentID, trackID) {
    return {
        type: BREAK_SEGMENT,
        payload: {
            trackID: parseInt(trackID),
            segmentID: parseInt(segmentID)
        }
    }
}

/**
 * Undo break and Merge are not the same thing
 * Breaking a segment turns it into two straight segments always
 * This might result in the loss of a control point for a curved segment which might have to be restored
 *
 * Merging a segment turns two segments into a straight segment always
 * This will result in the loss of their common node and if any of the former segments are curved, their control points will be lost too
 *
 * Thus the need to for inverse actions that hold this information for the undo-redo reducer to be able to dispatch
 */
export function undoBreakSegment(segmentA_ID, segmentB_ID, trackID, nodeToRestore, segmentToRestore) {
    return {
        type: UNDO_BREAK_SEGMENT,
        payload: {
            trackID: parseInt(trackID),
            segmentIDs: [parseInt(segmentA_ID), parseInt(segmentB_ID)],
            nodeToRestore: nodeToRestore,
            segmentToRestore: segmentToRestore
        }
    }
}

export function mergeSegments(segmentA_ID, segmentB_ID, trackID) {
    return {
        type: MERGE_SEGMENTS,
        payload: {
            trackID: parseInt(trackID),
            segmentIDs: [parseInt(segmentA_ID), parseInt(segmentB_ID)]
        }
    }
}

/**
 * Undo break and Merge are not the same thing
 * Breaking a segment turns it into two straight segments always
 * This might result in the loss of a control point for a curved segment which might have to be restored
 *
 * Merging a segment turns two segments into a straight segment always
 * This will result in the loss of their common node and if any of the former segments are curved, their control points will be lost too
 *
 * Thus the need to for inverse actions that hold this information for the undo-redo reducer to be able to dispatch
 */
export function undoMergeSegment(trackID, segmentToRemoveID, segmentsToRestore, nodesToRestore) {
    return {
        type: UNDO_MERGE_SEGMENTS,
        payload: {
            trackID: trackID,
            segmentToRemoveID: segmentToRemoveID,
            segmentsToRestore: segmentsToRestore,
            nodesToRestore: nodesToRestore
        }
    }
}

export function removeSegment(segmentID, trackID) {
    return {
        type: REMOVE_SEGMENT,
        payload: {
            trackID: parseInt(trackID),
            segmentID: parseInt(segmentID)
        }
    }
}

export function restoreSegment(segmentID, trackID, segmentToRestore, nodesToRestore) {
    return {
        type: RESTORE_SEGMENT,
        payload: {
            trackID: parseInt(trackID),
            segmentID: parseInt(segmentID),
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
            let targetSegment = getById(targetSegments, action.payload.segmentID)
            let removeNodeIDs = getNodesThatOnlyGivenSegmentsConnectTo(
                [action.payload.segmentID],
                targetSegments,
                false,
                true
            )
            let nodeToRestore = null

            if (removeNodeIDs.length === 1) {
                nodeToRestore = getById(targetTrack.nodes, removeNodeIDs[0])
            }

            return undoBreakSegment(
                action.payload.segmentID,
                nextIDForArray(targetSegments),
                action.payload.trackID,
                nodeToRestore,
                targetSegment
            )
        }
        case UNDO_BREAK_SEGMENT: {
            return breakSegment(action.payload.segmentIDs[0], action.payload.trackID)
        }
        case MERGE_SEGMENTS: {
            let targetTrack = getById(state, action.payload.trackID)
            let removedParentSegments = removeSegmentsFromTrackRoute(
                targetTrack.nodes,
                targetTrack.segments,
                action.payload.segmentIDs
            )

            let segmentsToRestore = difference(targetTrack.segments, removedParentSegments.segments)
            let nodesToRestore = difference(targetTrack.nodes, removedParentSegments.nodes)

            return undoMergeSegment(
                action.payload.trackID,
                action.payload.segmentIDs[0],
                segmentsToRestore,
                nodesToRestore
            )
        }
        case UNDO_MERGE_SEGMENTS: {
            let segmentsToRestore = action.payload.segmentsToRestore
            return mergeSegments(segmentsToRestore[0].id, segmentsToRestore[1].id, action.payload.trackID)
        }
        case REMOVE_SEGMENT: {
            let targetTrack = getById(state, action.payload.trackID)
            let targetSegments = targetTrack.segments
            let targetSegment = getById(targetSegments, action.payload.segmentID)
            let removeNodeIDs = getNodesThatOnlyGivenSegmentsConnectTo(
                [action.payload.segmentID],
                targetSegments,
                false
            )
            let removeNodes = filterByIds(targetTrack.nodes, removeNodeIDs)
            return restoreSegment(action.payload.segmentID, action.payload.trackID, targetSegment, removeNodes)
        }
        case RESTORE_SEGMENT: {
            return removeSegment(action.payload.segmentID, action.payload.trackID)
        }
    }
}
