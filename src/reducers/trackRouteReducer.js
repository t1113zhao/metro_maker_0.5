import { difference, intersection, object, union } from 'underscore'
import {
    genericMultiDelete,
    genericMultiRestore,
    genericSingleDelete,
    genericSingleRestore,
    haversineMidpoint,
    nextIDForArray,
    filterDeleted,
    filterByIds,
    filterOutById,
    filterOutByIds,
    idCompareAsc,
    getById
} from '../utils/utils'
import {
    ADD_TRACK,
    UNDO_ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK,

    REMOVE_STATION,
    RESTORE_STATION,

    MOVE_NODE,
    MOVE_STATION,

    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,

    BREAK_SEGMENT,
    UNDO_BREAK_SEGMENT,
    MERGE_SEGMENTS,
    UNDO_MERGE_SEGMENTS,

    REMOVE_SEGMENT,
    RESTORE_SEGMENT,
} from '../actions/actionTypes'

/**
 * id: int
 * stationIDs: [0, 1]
 * nodes: [ {id, lat, long, stationID}, {id, lat, long}]
 * segments: [{id, endpoints:[id, id]}]
 * deletedAt:
 */


const initialState = []

export default function trackRouteReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TRACK: {
            return doAddTrackRoute(state, action)
        }
        case UNDO_ADD_TRACK: {
            return filterOutById(state, action.payload.id)
        }
        case ADD_STRAIGHT_SEGMENT:
        case ADD_CURVED_SEGMENT: {
            return doAddSegmentToTrackRoute(state, action)
        }
        case STRAIGHT_TO_CURVED: {
            return doStraightToCurved(state, action)
        }
        case CURVED_TO_STRAIGHT: {
            return doCurvedToStraight(state, action)
        }
        case BREAK_SEGMENT: {
            return doBreakSegment(state, action)
        }
        case UNDO_BREAK_SEGMENT: {
            return undoBreakSegment(state, action)
        }
        case MERGE_SEGMENTS: {
            return doMergeSegments(state, action)
        }
        case UNDO_MERGE_SEGMENTS: {
            return undoMergeSegments(state, action)
        }
        case REMOVE_SEGMENT: {
            return doRemoveSegment(state, action)
        }
        case RESTORE_SEGMENT: {
            return doRestoreSegment(state, action)
        }
        case REMOVE_TRACK: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_TRACK: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        case REMOVE_STATION: {
            return genericMultiDelete(
                state,
                action.payload.trackIDs,
                action.payload.deletedAt
            )
        }
        case RESTORE_STATION: {
            return genericMultiRestore(
                state,
                action.payload.trackIDs
            )
        }
        case MOVE_NODE: {
            return doMoveNode(state, action)
        }
        case MOVE_STATION: {
            return doMoveStation(state, action)
        }
        default:
            return state
    }
}


// Add Track
export function doAddTrackRoute(state, action) {
    let trackID = nextIDForArray(state)

    let stations = action.payload.stations

    return [
        ...state,
        {
            id: trackID,
            stationIDs: [stations[0].id, stations[1].id],
            nodes: [
                {
                    id: 0,
                    stationID: stations[0].id,
                    latitude: stations[0].latitude,
                    longitude: stations[0].longitude
                },
                {
                    id: 1,
                    stationID: stations[1].id,
                    latitude: stations[1].latitude,
                    longitude: stations[1].longitude
                }
            ],
            segments: [
                {
                    id: 0,
                    isCurved: false,
                    endNodes: [0, 1],
                    controlPoint: null
                }
            ],
            deletedAt: null
        }
    ]
}

function doAddSegmentToTrackRoute(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let givenNodeIDs = action.payload.nodeIDs
        let newNodeID = nextIDForArray(trackRoute.nodes)
        let newNodes = trackRoute.nodes.slice(0)

        for (var i = 0; i < givenNodeIDs.length; i++) {
            if (givenNodeIDs[i] == null) {
                givenNodeIDs[i] = newNodeID
                newNodes.push({
                    id: newNodeID,
                    stationID: null,
                    latitude: action.payload.latitudes[i],
                    longitude: action.payload.longitudes[i],
                })
                newNodeID = newNodeID + 1
            }
        }

        let controlPoint = null
        let isCurved = false;
        if (action.type === ADD_CURVED_SEGMENT) {
            controlPoint = givenNodeIDs[2]
            isCurved = true
        }
        let newSegmentID = nextIDForArray(trackRoute.segments)

        let newSegments = trackRoute.segments.slice(0)
        newSegments.push(
            {
                id: newSegmentID,
                isCurved: isCurved,
                endNodes: [givenNodeIDs[0], givenNodeIDs[1]],
                controlPoint: controlPoint
            }
        )
        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doStraightToCurved(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let newNodes = trackRoute.nodes.slice(0)
        let newSegments = trackRoute.segments.slice(0)

        let targetSegment = trackRoute.segments[action.payload.id]

        if (!targetSegment.controlPoint) {
            let newCoords = haversineMidpoint(
                newNodes[targetSegment.endNodes[0]],
                newNodes[targetSegment.endNodes[1]]
            )
            let newNodeID = nextIDForArray(newNodes)

            newNodes.push({
                id: newNodeID,
                stationID: null,
                latitude: newCoords.latitude,
                longitude: newCoords.longitude
            })

            newSegments = newSegments.map(segment => {
                if (segment.id != action.payload.id) {
                    return segment
                }
                return {
                    ...segment,
                    isCurved: true,
                    controlPoint: newNodeID
                }
            })
        } else {
            newSegments = newSegments.map(segment => {
                if (segment.id != action.payload.id) {
                    return segment
                }
                return {
                    ...segment,
                    isCurved: true
                }
            })
        }

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doCurvedToStraight(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let newSegments = trackRoute.segments.slice(0)

        newSegments = newSegments.map(segment => {
            if (segment.id !== action.payload.id) {
                return segment
            }
            return {
                ...segment,
                isCurved: false
            }
        })

        return {
            ...trackRoute,
            segments: newSegments
        }
    })
}

function doBreakSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let targetSegment = trackRoute.segments[action.payload.segmentID]

        //remove target segment
        let removedParentSegment = removeSegmentsFromTrackRoute(
            trackRoute.nodes,
            trackRoute.segments,
            [action.payload.segmentID]
        )

        let newNodes = removedParentSegment.nodes
        let newSegments = removedParentSegment.segments

        // get the end nodes of the removed segment to construct two children segments
        let segmentEndNodes = filterByIds(newNodes, targetSegment.endNodes)

        let newCoords = haversineMidpoint(
            segmentEndNodes[0],
            segmentEndNodes[1]
        )
        let newNodeID = nextIDForArray(newNodes)
        newNodes.push({
            id: newNodeID,
            stationID: null,
            latitude: newCoords.latitude,
            longitude: newCoords.longitude
        })

        // push the new segments
        newSegments.push({
            id: targetSegment.id,
            endNodes: [targetSegment.endNodes[0], newNodeID],
            isCurved: false,
            controlPoint: null,
        })

        newSegments.push({
            id: nextIDForArray(newSegments),
            endNodes: [newNodeID, targetSegment.endNodes[1]],
            isCurved: false,
            controlPoint: null,
        })
        newSegments.sort(idCompareAsc)

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function undoBreakSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let removeParentsSegments = removeSegmentsFromTrackRoute(
            trackRoute.nodes,
            trackRoute.segments,
            action.payload.segmentIDs
        )

        let newNodes = removeParentsSegments.nodes
        let newSegments = removeParentsSegments.segments

        if(action.payload.nodeToRestore) {
            newNodes.push(action.payload.nodeToRestore)
            newNodes.sort(idCompareAsc)
        }
        newSegments.push(action.payload.segmentToRestore)
        newSegments.sort(idCompareAsc)

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doMergeSegments(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let commonNodes = getCommonEndPointsBetweenTwoSegments(
            action.payload.segmentIDs[0],
            action.payload.segmentIDs[1],
            trackRoute.segments
        )

        // if two segments dont touch
        if (commonNodes.length != 1) {
            return trackRoute
        }

        let mergeEndPoints = getUnCommonEndPointsBetweenTwoSegments(
            action.payload.segmentIDs[0],
            action.payload.segmentIDs[1],
            trackRoute.segments
        )

        let removedParentSegments = removeSegmentsFromTrackRoute(
            trackRoute.nodes,
            trackRoute.segments,
            action.payload.segmentIDs
        )

        let newNodes = removedParentSegments.nodes
        let newSegments = removedParentSegments.segments


        newSegments.push({
            id: action.payload.segmentIDs[0],
            endNodes: mergeEndPoints,
            isCurved: false,
            controlPoint: null,
        })

        newSegments.sort(idCompareAsc)

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments,
        }
    })
}

function undoMergeSegments(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let removedParentSegment = removeSegmentsFromTrackRoute(
            trackRoute.nodes,
            trackRoute.segments,
            [action.payload.segmentToRemoveID]
        )
        let newNodesAndSegments = restoreSegmentsAndNodes(
            removedParentSegment.nodes,
            removedParentSegment.segments,
            action.payload.nodesToRestore,
            action.payload.segmentsToRestore
        )

        return {
            ...trackRoute,
            nodes: newNodesAndSegments.nodes,
            segments: newNodesAndSegments.segments
        }
    })
}

function doRemoveSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let outObj = removeSegmentsFromTrackRoute(trackRoute.nodes, trackRoute.segments, [action.payload.id])

        return {
            ...trackRoute,
            nodes: outObj.nodes,
            segments: outObj.segments
        }
    })
}

export function removeSegmentsFromTrackRoute(nodes, segments, segmentIDs) {
    let removeNodeIds = getNodesThatOnlyGivenSegmentsConnectTo(
        segmentIDs,
        segments,
        false,
        true
    )

    let newNodes = filterOutByIds(nodes, removeNodeIds)

    let newSegments = filterOutByIds(segments, segmentIDs)

    return {
        nodes: newNodes,
        segments: newSegments
    }
}

function doRestoreSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let outObj = restoreSegmentsAndNodes(trackRoute.nodes, trackRoute.segments, action.payload.nodesToRestore, [action.payload.segmentToRestore])

        return {
            ...trackRoute,
            nodes: outObj.nodes,
            segments: outObj.segments
        }
    })
}

function restoreSegmentsAndNodes(nodes, segments, nodesToRestore, segmentsToRestore) {
    let newNodes = nodes.slice()
    let newSegments = segments.slice()

    for (var i = 0; i < nodesToRestore.length; i++) {
        let node = nodesToRestore[i]
        newNodes.push(node)
    }
    newNodes.sort(idCompareAsc)

    for (var i = 0; i < segmentsToRestore.length; i++) {
        let segment = segmentsToRestore[i]
        newSegments.push(segment)
    }
    newSegments.sort(idCompareAsc)

    return {
        nodes: newNodes,
        segments: newSegments
    }
}

function doMoveNode(state, action) {

    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        return {
            ...trackRoute,
            nodes: moveSpecificNode(
                action.payload.latitude,
                action.payload.longitude,
                action.payload.id,
                trackRoute.nodes
            )
        }
    })
}

function doMoveStation(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.stationIDs[0] != action.payload.id &&
            trackRoute.stationIDs[1] != action.payload.id) {
            return trackRoute
        }
        else if (trackRoute.stationIDs[0] == action.payload.id) {
            return {
                ...trackRoute,
                nodes: moveSpecificNode(
                    action.payload.latitude,
                    action.payload.longitude,
                    0,
                    trackRoute.nodes
                )
            }
        }
        else if (trackRoute.stationIDs[1] == action.payload.id) {
            return {
                ...trackRoute,
                nodes: moveSpecificNode(
                    action.payload.latitude,
                    action.payload.longitude,
                    1,
                    trackRoute.nodes
                )
            }
        }
    })
}

function moveSpecificNode(latitude, longitude, id, nodes) {
    let newNodes = nodes.map(item => {
        if (item.id != id) {
            return item
        }
        return {
            ...item,
            latitude: latitude,
            longitude: longitude
        }
    })

    return newNodes.sort(idCompareAsc)
}

export function getTrackIDsByStationID(tracks, stationID, includeDeleted) {
    let output = tracks.filter(track => {
        return track.stationIDs[0] === stationID ||
            track.stationIDs[1] === stationID
    }).map(track => {
        return track.id
    })
    return filterDeleted(output, includeDeleted)
}

export function getNodesThatOnlyGivenSegmentsConnectTo(segmentIDs, fullset, includeStationNodes, includeControlPoint) {

    let segmentIDSet = new Set(segmentIDs)
    let subsetNodeIds = []

    let differenceSetNodeIds = []

    fullset.forEach(segment => {
        if (segmentIDSet.has(segment.id)) {
            subsetNodeIds.push(segment.endNodes[0])
            subsetNodeIds.push(segment.endNodes[1])
            if (includeControlPoint && segment.controlPoint) {
                subsetNodeIds.push(segment.controlPoint)
            }
        } else {
            differenceSetNodeIds.push(segment.endNodes[0])
            differenceSetNodeIds.push(segment.endNodes[1])
            if (includeControlPoint && segment.controlPoint) {
                differenceSetNodeIds.push(segment.controlPoint)
            }
        }
    })

    let subsetOnlyNodeIds = difference(
        subsetNodeIds,
        differenceSetNodeIds
    )

    if (includeStationNodes == false) {
        let checkSet = new Set(subsetOnlyNodeIds)
        checkSet.delete(0)
        checkSet.delete(1)
        return Array.from(checkSet)
    }

    return subsetOnlyNodeIds
}

export function getCommonEndPointsBetweenTwoSegments(segmentA_ID, segmentB_ID, fullset) {
    let segmentANodes = getById(fullset, segmentA_ID).endNodes
    let segmentBNodes = getById(fullset, segmentB_ID).endNodes

    return intersection(segmentANodes, segmentBNodes)
}

export function getUnCommonEndPointsBetweenTwoSegments(segmentA_ID, segmentB_ID, fullset) {
    let segmentANodes = getById(fullset, segmentA_ID).endNodes
    let segmentBNodes = getById(fullset, segmentB_ID).endNodes

    let commonNodes = intersection(segmentANodes, segmentBNodes)
    let allNodes = union(segmentANodes, segmentBNodes)
    return difference(allNodes, commonNodes)
}
