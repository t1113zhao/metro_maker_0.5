import { getNodeText } from '@testing-library/dom'
import { difference, filter } from 'underscore'
import {
    ADD_NODE,
    EDIT_NODE,
    REMOVE_NODE,
    RESTORE_NODE,
    MOVE_STATION,
    REMOVE_TRACK,
    RESTORE_TRACK,
    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
    REMOVE_SEGMENT,
    RESTORE_SEGMENT
} from '../actions/actionTypes'

/**
 * id: int
 * stationIDs: [0,1,...]
 * nodes: [ {id, lat, long, stationID}, {id, lat, long}]
 * segments: [{id, endpoints:[id, id]}]
 * deletedAt:
 */

import { genericMultiDelete, genericSingleDelete, genericSingleRestore, haversineMidpoint, nextIDForArray } from '../utils/utils'

const initialState = []

export default function trackRouteReducer(state = initialState, action) {
    switch (action.type) {
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
        case REMOVE_NODE: {
            return doRemoveNode(state, action)
        }
        case RESTORE_NODE: {
            return doRestoreNode(state, action)
        }
        case EDIT_NODE: {
            return doEditNode(state, action)
        }
        case MOVE_STATION: {
            return doMoveStation(state, action)
        }
        default:
            return state
    }
}


// Add Track
export function doAddTrackRoute(state, action, trackID, stations) {
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
                    longitude: stations[0].longitude,
                    deletedAt: null
                },
                {
                    id: 1,
                    stationID: stations[1].id,
                    latitude: stations[1].latitude,
                    longitude: stations[1].longitude,
                    deletedAt: null
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
        let newNodes = trackRoute.nodes

        for (var i = 0; i < givenNodeIDs; i++) {
            if (!givenNodeIDs[i]) {
                givenNodeIDs[i] = newNodeID
                newNodes.push({
                    id: newNodeID,
                    latitude: action.payload.latitudes[i],
                    longitude: action.payload.longitudes[i],
                    deletedAt: null
                })
                newNodeID = newNodeID + 1
            }
        }

        let controlPointID = null
        let isCurved = false;
        if (action.type === ADD_CURVED_SEGMENT) {
            controlPointID = givenNodeIDs[2]
            isCurved = true
        }
        let newSegmentID = nextIDForArray(trackRoute.segments)

        let newSegments = trackRoute.segments
        newSegments.push(
            {
                id: newSegmentID,
                isCurved: isCurved,
                endNodes: [givenNodeIDs[0], givenNodeIDs[1]],
                controlPoint: controlPointID,
                deletedAt: null
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

        let newNodes = trackRoute.nodes
        let newSegments = trackRoute.segments

        let targetSegment = trackRoute.segments[action.payload.id]

        if (!targetSegment.controlPoint) {
            let newCoords = haversineMidpoint(
                newNodes[targetSegment.endNodes[0]],
                newNodes[targetSegment.endNodes[1]]
            )
            let newNodeID = nextIDForArray(newNodes)

            newNodes.push({
                id: newNodeID,
                latitude: newCoords[0],
                longitude: newNodes[1],
                deletedAt: null
            })

            newSegments = newSegments.map(segment => {
                if (segment.id != action.payload.id) {
                    return segment
                }
                return {
                    ...segment,
                    isCurved: false,
                    controlPointID: newNodeID
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
        let newSegments = trackRoute.segments

        newSegments = newSegments.map(segment => {
            if (segment.id != action.payload.id) {
                return segment
            }
            return {
                ...segment,
                isCurved: false
            }
        })
    })
}

function doBreakSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let targetSegment = trackRoute.segments[action.payload.id]
        let newNodes = trackRoute.nodes
        let newSegments = trackRoute.segments

        let newCoords = haversineMidpoint(
            targetSegment.endNodes[0],
            targetSegment.endNodes[1]
        )
        let newNodeID = nextIDForArray(trackRoute.nodes)
        newNodes.push({
            id: newNodeID,
            latitude: newCoords[0],
            longitude: newCoords[1]
        })

        targetSegment.endNodes = [
            targetSegment.endNodes[0],
            newNodeID
        ]

        newSegments.push({
            id: nextIDForArray(trackRoute.segments),
            endNodes: [newNodeID, targetSegment[1]],
            isCurved: false,
            controlPoint: null,
            deletedAt: null
        })


        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doRemoveSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let removeNodeIds = getNodesThatOnlyGivenSegmentsConnectTo(
            [action.payload.id],
            trackRoute.segments,
            false
        )

        let newNodes = genericMultiDelete(
            trackRoute.nodes,
            removeNodeIds,
            action.payload.deletedAt
        )

        let newSegments = genericSingleDelete(
            trackRoute.segments,
            action.payload.id,
            action.payload.deletedAt
        )
        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doRestoreSegment(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let restoreNodeIds = getNodesThatOnlyGivenSegmentsConnectTo(
            [action.payload.id],
            trackRoute.segments,
            true
        )

        let newNodes = genericMultiDelete(
            trackRoute.nodes,
            restoreNodeIds,
            action.payload.deletedAt
        )

        let newSegments = genericSingleDelete(
            trackRoute.segments,
            action.payload.id,
            action.payload.deletedAt
        )
        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function getNodesThatOnlyGivenSegmentsConnectTo(subset, fullset, includeStationNodes) {

    let subsetNodeIds = []
    for (var i = 0; i < subset.length(); i++) {
        let curSegment = subset[i]
        subsetNodeIds.push(curSegment.endNodes[0])
        subsetNodeIds.push(curSegment.endNodes[1])
        if (curSegment.controlPointID) {
            subsetNodeIds.push(curSegment.controlPointID)
        }
    }

    let differenceSet = difference(
        fullset,
        subset
    )
    let differenceSetNodeIds = []

    for (var i = 0; i < differenceSet.length(); i++) {
        let curSegment = differenceSet[i]
        differenceSetNodeIds.push(curSegment.endNodes[0])
        differenceSetNodeIds.push(curSegment.endNodes[1])
        if (curSegment.controlPointID) {
            differenceSetNodeIds.push(curSegment.controlPointID)
        }
    }
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

function doEditNode(state, action) {

    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }
        let newNodes = trackRoute.nodes.map(item => {
            if (item.id != action.payload.id) {
                return item
            }
            return {
                ...item,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude
            }
        })

        return {
            ...trackRoute,
            nodes: newNodes
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

function moveSpecificNode(latitude, longitude, nodeIndex, nodes) {
    return nodes.map((node, index) => {
        if (index === nodeIndex) {
            return {
                ...node,
                latitude: latitude,
                longitude: longitude
            }
        } else {
            return node
        }
    })
}

function doRemoveNode(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        let removeSegments = trackRoute.segments.filter(segment => {
            return segment.endNodes[0] == action.payload.id ||
                segment.endNodes[1] == action.payload.id ||
                segment.controlPointID == action.payload.id
        })

        let removeSegmentIDs = removeSegments.map(segment => {
            return segment.id
        })

        let removeNodeIds = getNodesThatOnlyGivenSegmentsConnectTo(
            removeSegments,
            trackRoute.segments,
            false
        )

        let newSegments = genericMultiDelete(
            trackRoute.segments,
            removeSegmentIDs,
            action.payload.deletedAt
        )

        let newNodes = genericMultiDelete(
            trackRoute.nodes,
            removeNodeIds,
            action.payload.deletedAt
        )

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

function doRestoreNode(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id != action.payload.trackID) {
            return trackRoute
        }

        // get the segments that are attached to the to be removed node

        let restoreSegments = trackRoute.segments.filter(segment => {
            return segment.endNodes[0] == action.payload.id ||
                segment.endNodes[1] == action.payload.id ||
                segment.controlPointID == action.payload.id
        })

        let restoreSegmentIDs = restoreSegments.map(segment => {
            return segment.id
        })

        let restoreNodeIds = getNodesThatOnlyGivenSegmentsConnectTo(
            restoreSegments,
            trackRoute.segments,
            true
        )

        let newSegments = genericMultiDelete(
            trackRoute.segments,
            restoreSegmentIDs,
            action.payload.deletedAt
        )

        let newNodes = genericMultiDelete(
            trackRoute.nodes,
            restoreNodeIds,
            action.payload.deletedAt
        )

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}
