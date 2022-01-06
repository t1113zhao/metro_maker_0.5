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
    ADD_NEW_TRACKROUTE_NODES,
    EDIT_TRACKROUTE_NODES,
    CLEAR_TRACKROUTE_NODES
} from '../actions/actionTypes'

/**
 * id: int
 * stationIDs: [0, 1]
 * nodes: [ [lat, long]]
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
        //This can only happen if track doesn't have services running on it
        case REMOVE_TRACK: {
            return genericSingleDelete(state, action.payload.id, action.payload.deletedAt)
        }
        case RESTORE_TRACK: {
            return genericSingleRestore(state, action.payload.id)
        }
        case REMOVE_STATION: {
            let trackIDs = getTrackIDsByStationID(state, action.payload.id)
            return genericMultiDelete(state, trackIDs, action.payload.deletedAt)
        }
        case RESTORE_STATION: {
            let trackIDs = getTrackIDsByStationID(state, action.payload.id)
            return genericMultiRestore(state, trackIDs)
        }
        case MOVE_NODE: {
            return doMoveNode(state, action)
        }
        case MOVE_STATION: {
            return doMoveStation(state, action)
        }
        case ADD_NEW_TRACKROUTE_NODES: {
            return doAddNewTrackRouteNodes(state, action)
        }
        case EDIT_TRACKROUTE_NODES: {
            return doEditTrackRoute(state, action)
        }
        case CLEAR_TRACKROUTE_NODES: {
            return doClearTrackRoute(state, action)
        }
        default:
            return state
    }
}

// Add Track
export function doAddTrackRoute(state, action) {
    let trackID = nextIDForArray(state)

    let stations = action.payload.stations
    let startStation = stations[0]
    let endStation = stations[1]

    return [
        ...state,
        {
            id: trackID,
            stationIDs: [startStation.id, endStation.id],
            nodes: [],
            stationNodes: [
                [startStation.longitude, startStation.latitude],
                [endStation.longitude, endStation.latitude]
            ],
            deletedAt: null
        }
    ]
}

function doMoveNode(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id !== action.payload.trackID) {
            return trackRoute
        }
        return {
            ...trackRoute,
            nodes: moveSpecificNode(
                action.payload.latitude,
                action.payload.longitude,
                action.payload.index,
                trackRoute.nodes
            )
        }
    })
}

function doMoveStation(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.stationIDs[0] !== action.payload.id && trackRoute.stationIDs[1] !== action.payload.id) {
            return trackRoute
        } else if (trackRoute.stationIDs[0] === action.payload.id) {
            return {
                ...trackRoute,
                nodes: moveSpecificNode(action.payload.latitude, action.payload.longitude, 0, trackRoute.nodes)
            }
        } else if (trackRoute.stationIDs[1] === action.payload.id) {
            return {
                ...trackRoute,
                nodes: moveSpecificNode(
                    action.payload.latitude,
                    action.payload.longitude,
                    trackRoute.nodes.length,
                    trackRoute.nodes
                )
            }
        }
    })
}

function doAddNewTrackRouteNodes(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id !== action.payload.trackID) {
            return trackRoute
        } else {
            return {
                ...trackRoute,
                nodes: action.payload.nodes.slice()
            }
        }
    })
}

function doEditTrackRoute(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id !== action.payload.trackID) {
            return trackRoute
        } else {
            const newNodes = [
                ...trackRoute.nodes.slice(0, action.payload.startIndex + 1),
                ...action.payload.nodes,
                ...trackRoute.nodes.slice(action.payload.endIndex)
            ]

            return {
                ...trackRoute,
                nodes: newNodes
            }
        }
    })
}

function doClearTrackRoute(state, action) {
    return state.map(trackRoute => {
        if (trackRoute.id !== action.payload.trackID) {
            return trackRoute
        } else {
            return {
                ...trackRoute,
                nodes: []
            }
        }
    })
}

function moveSpecificNode(latitude, longitude, index, nodes) {
    let newNodes = nodes.splice(index, 1, [latitude, longitude])

    return newNodes
}

export function getTrackIDsByStationID(tracks, stationID, includeDeleted) {
    let output = tracks
        .filter(track => {
            return track.stationIDs[0] === stationID || track.stationIDs[1] === stationID
        })
        .map(track => {
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

    let subsetOnlyNodeIds = difference(subsetNodeIds, differenceSetNodeIds)

    if (includeStationNodes === false) {
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
