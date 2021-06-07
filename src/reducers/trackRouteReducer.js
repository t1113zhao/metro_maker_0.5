import { difference } from 'underscore'
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
    idCompareDsc
} from '../utils/utils'
import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK,

    REMOVE_STATION,
    RESTORE_STATION,

    EDIT_NODE,
    MOVE_STATION,

    ADD_STRAIGHT_SEGMENT,
    ADD_CURVED_SEGMENT,
    STRAIGHT_TO_CURVED,
    CURVED_TO_STRAIGHT,
    BREAK_SEGMENT,
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
        // case REMOVE_NODE: {
        //     return doRemoveNode(state, action)
        // }
        // case RESTORE_NODE: {
        //     return doRestoreNode(state, action)
        // }
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

        let controlPointID = null
        let isCurved = false;
        if (action.type === ADD_CURVED_SEGMENT) {
            controlPointID = givenNodeIDs[2]
            isCurved = true
        }
        let newSegmentID = nextIDForArray(trackRoute.segments)

        let newSegments = trackRoute.segments.slice(0)
        newSegments.push(
            {
                id: newSegmentID,
                isCurved: isCurved,
                endNodes: [givenNodeIDs[0], givenNodeIDs[1]],
                controlPoint: controlPointID
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
        let targetSegment = trackRoute.segments[action.payload.id]
        let newNodes = trackRoute.nodes.slice(0)
        let newSegments = trackRoute.segments.slice(0)
        let targetNodes = filterByIds(newNodes, [targetSegment.endNodes[0], targetSegment.endNodes[1]])

        let newCoords = haversineMidpoint(
            targetNodes[0],
            targetNodes[1]
        )
        let newNodeID = nextIDForArray(trackRoute.nodes)
        newNodes.push({
            id: newNodeID,
            stationID: null,
            latitude: newCoords.latitude,
            longitude: newCoords.longitude
        })

        newSegments.push({
            id: nextIDForArray(trackRoute.segments),
            endNodes: [newNodeID, targetSegment.endNodes[1]],
            isCurved: false,
            controlPoint: null,
        })

        targetSegment.endNodes = [
            targetSegment.endNodes[0],
            newNodeID
        ]

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
            action.payload.id,
            trackRoute.segments,
            false
        )

        let newNodes = filterOutByIds(trackRoute.nodes, removeNodeIds)

        let newSegments = filterOutById(trackRoute.segments, action.payload.id)

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

        let newNodes = trackRoute.nodes.slice(0)
        for (var i = 0; i < action.payload.nodesToRestore.length; i++) {
            newNodes.push(action.payload.nodesToRestore[i])
        }
        newNodes.sort(idCompareDsc)

        let newSegments = trackRoute.segments.slice(0)
        newSegments.splice(action.payload.id, 0, action.payload.segmentToRestore)
        newSegments.sort(idCompareDsc)

        return {
            ...trackRoute,
            nodes: newNodes,
            segments: newSegments
        }
    })
}

export function getNodesThatOnlyGivenSegmentsConnectTo(segmentID, fullset, includeStationNodes) {

    let subsetNodeIds = []

    let differenceSetNodeIds = []

    fullset.forEach(segment => {
        if (segment.id == segmentID) {
            subsetNodeIds.push(segment.endNodes[0])
            subsetNodeIds.push(segment.endNodes[1])
            if (segment.controlPoint) {
                subsetNodeIds.push(segment.controlPoint)
            }
        } else {
            differenceSetNodeIds.push(segment.endNodes[0])
            differenceSetNodeIds.push(segment.endNodes[1])
            if (segment.controlPoint) {
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

function doEditNode(state, action) {

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

    return newNodes.sort(idCompareDsc)
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
