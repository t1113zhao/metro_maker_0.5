import {
    filterById,
    genericMultiDelete,
    genericMultiRestore,
    genericSingleDelete,
    genericSingleRestore,
    nextIDForArray
} from "../utils/utils"
import {
    REMOVE_SERVICE,
    RESTORE_SERVICE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_AGENCY,
    RESTORE_AGENCY,
    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    ONEWAY_TO_TWOWAY,
    TWOWAY_TO_ONEWAY,
    REMOVE_SERVICE_ALONG_TRACK,
    CLEAR_SERVICE_ROUTE,
    UNDO_CLEAR_SERVICE_ROUTE,
    REMOVE_STOP,
    RESTORE_STOP
} from "../actions/actionTypes"
import _, { difference, union } from "underscore"

//an array of serviceRoute objects
const initialState = []

/* 
    A service route object stores three things
    1. The service runs along which tracks 
        (by extension passes through which stations)
    2. The service stops at which stations
    3. The order and grouping of service route

    e.g.
    A<->B is represented as 

    A->B, A<-B

    If there were a section of track like this

    A <-- B1 <-- C
     \--> B2 --/

    That is represented within the track block as

    A <- B1, B1 <- C
    A -> B2, B2 -> C

    or more specifically

    trackID: 1, fromID: A, toID: B2
    trackID: 2, fromID: B2, toID: C
    trackID: 3, fromID: C, toID: B1
    trackID: 4, fromID: B1, toID: A

    Also you can only add or delete from a service at the ends.
    
    4. A trackBlock stores the stations that it contains, the service tracks and the completeness/ validity of the block.

    If a block is not a perfect cycle then complete is false.

    A block must be complete before a new block can be added on top of it
*/

export default function serviceRouteReducer(state = initialState, action) {
    switch (action.type) {
        case REMOVE_AGENCY:
        case REMOVE_LINE: {
            return genericMultiDelete(state, action.payload.serviceIDs, action.payload.deletedAt)
        }
        case REMOVE_SERVICE: {
            return genericSingleDelete(state, action.payload.id, action.payload.deletedAt)
        }
        case RESTORE_AGENCY:
        case RESTORE_LINE: {
            return genericMultiRestore(state, action.payload.serviceIDs)
        }
        case RESTORE_SERVICE: {
            return genericSingleRestore(state, action.payload.id)
        }
        case ADD_SERVICETRACK_TWOWAY: {
            return doAddTwoWayServiceTrack(state, action)
        }
        case ADD_SERVICETRACK_ONEWAY: {
            return doAddOneWayServiceTrack(state, action)
        }
        case SWITCH_ONEWAY_DIRECTION: {
            return editServiceTracks(
                state,
                action,
                matchingTrackIDPredicate,
                targetEdges => {
                    return targetEdges.length !== 1
                },
                doSwitchOneWayDirection
            )
        }
        case ONEWAY_TO_TWOWAY: {
            return editServiceTracks(
                state,
                action,
                matchingTrackIDPredicate,
                targetEdges => {
                    return targetEdges.length !== 1
                },
                doOneWayToTwoWay
            )
        }
        case TWOWAY_TO_ONEWAY: {
            return editServiceTracks(
                state,
                action,
                matchingTrackIDPredicate,
                targetEdges => {
                    return targetEdges.length !== 2
                },
                doTwoWayToOneWay
            )
        }
        case REMOVE_SERVICE_ALONG_TRACK: {
            return editServiceTracks(
                state,
                action,
                matchingTrackIDPredicate,
                targetEdges => {
                    return targetEdges.length === 0
                },
                doRemoveServiceAlongTrack
            )
        }
        case CLEAR_SERVICE_ROUTE: {
            return doClearServiceRoute(state, action)
        }
        case UNDO_CLEAR_SERVICE_ROUTE: {
            return doUndoClearServiceRoute(state, action)
        }
        case REMOVE_STOP: {
            return doRemoveStop(state, action)
        }
        case RESTORE_STOP: {
            return doRestoreStop(state, action)
        }
        default:
            return state
    }
}

export function doAddServiceRoute(state, serviceID) {
    return [
        ...state,
        {
            //serviceID
            id: serviceID,
            deletedAt: null,
            stopsByID: [],
            serviceTracks: []
        }
    ]
}

function doAddTwoWayServiceTrack(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let newStops = serviceRoute.stopsByID.slice(0)

        newStops = union(newStops, action.payload.stationIDs)

        let serviceTracks = serviceRoute.serviceTracks.slice(0)

        let newBlock = [
            {
                trackID: action.payload.trackID,
                fromStationID: parseInt(action.payload.stationIDs[0]),
                toStationID: parseInt(action.payload.stationIDs[1])
            },
            {
                trackID: action.payload.trackID,
                fromStationID: parseInt(action.payload.stationIDs[1]),
                toStationID: parseInt(action.payload.stationIDs[0])
            }
        ]

        serviceTracks.splice(action.payload.index, 0, newBlock)

        return {
            ...serviceRoute,
            stopsByID: newStops,
            serviceTracks: serviceTracks
        }
    })
}

function doAddOneWayServiceTrack(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let newStops = serviceRoute.stopsByID.slice(0)
        if (newStops.indexOf(action.payload.fromID) === -1) {
            newStops.push(action.payload.fromID)
        }
        if (newStops.indexOf(action.payload.toID) === -1) {
            newStops.push(action.payload.toID)
        }
        let serviceTracks = serviceRoute.serviceTracks.slice(0)

        // if inserting at the beginning, the index is -1.
        if (serviceTracks.length === action.payload.index) {
            let newBlock = [
                {
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.fromID,
                    toStationID: action.payload.toID
                }
            ]
            serviceTracks.splice(action.payload.index, 0, newBlock)
        } else if (action.payload.index === -1) {
            let newBlock = [
                {
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.fromID,
                    toStationID: action.payload.toID
                }
            ]
            serviceTracks.splice(0, 0, newBlock)
        } else {
            let currentBlock = serviceTracks[action.payload.index].slice(0)

            // Adding to a complete block is not allowed
            if (!isTrackBlockComplete(currentBlock)) {
                currentBlock.push({
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.fromID,
                    toStationID: action.payload.toID
                })
                serviceTracks.splice(action.payload.index, 1, currentBlock)
            } else {
                return {
                    ...serviceRoute
                }
            }
        }
        return {
            ...serviceRoute,
            stopsByID: newStops,
            serviceTracks: serviceTracks
        }
    })
}

function editServiceTracks(state, action, targetEdgePredicate, predicate, callback) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let serviceTracks = serviceRoute.serviceTracks.slice(0)
        if (action.payload.index >= serviceTracks.length || action.payload.index < 0) {
            return serviceRoute
        }
        let targetBlock = serviceTracks[action.payload.index]

        let targetEdges = targetBlock.filter(edge => targetEdgePredicate(action, edge))

        if (predicate(targetEdges)) {
            return serviceRoute
        } else {
            return callback(serviceRoute, action, serviceTracks, targetBlock, targetEdges)
        }
    })
}

function matchingTrackIDPredicate(action, edge) {
    return edge.trackID === action.payload.trackID
}

function doSwitchOneWayDirection(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
    let newBlock = targetBlock
        .filter(edge => {
            return edge.trackID !== action.payload.trackID
        })
        .slice(0)

    let targetEdge = targetEdges[0]

    let newEdge = {
        trackID: targetEdge.trackID,
        fromStationID: targetEdge.toStationID,
        toStationID: targetEdge.fromStationID
    }

    newBlock.push(newEdge)
    serviceTracks.splice(action.payload.index, 1, newBlock)

    return {
        ...serviceRoute,
        serviceTracks: serviceTracks
    }
}

function doOneWayToTwoWay(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
    let targetEdge = targetEdges[0]

    let newBlock = [
        {
            trackID: action.payload.trackID,
            fromStationID: parseInt(targetEdge.fromStationID),
            toStationID: parseInt(targetEdge.toStationID)
        },
        {
            trackID: action.payload.trackID,
            fromStationID: parseInt(targetEdge.toStationID),
            toStationID: parseInt(targetEdge.fromStationID)
        }
    ]
    serviceTracks.splice(action.payload.index, 1, newBlock)
    return {
        ...serviceRoute,
        serviceTracks: serviceTracks
    }
}

function doTwoWayToOneWay(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
    let targetEdge = targetEdges[0]

    let newBlock = [
        {
            trackID: action.payload.trackID,
            fromStationID: parseInt(targetEdge.fromStationID),
            toStationID: parseInt(targetEdge.toStationID)
        }
    ]
    serviceTracks.splice(action.payload.index, 1, newBlock)
    return {
        ...serviceRoute,
        serviceTracks: serviceTracks
    }
}

function doRemoveServiceAlongTrack(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
    let checkStops = []

    let newBlock = targetBlock.filter(edge => {
        if (edge.trackID === action.payload.trackID) {
            checkStops = [edge.fromStationID, edge.toStationID]
        }
        return edge.trackID !== action.payload.trackID
    })

    if (newBlock.length > 0) {
        serviceTracks.splice(action.payload.index, 1, newBlock)
    } else {
        serviceTracks = [
            ...serviceTracks.slice(0, action.payload.index),
            ...serviceTracks.slice(action.payload.index + 1)
        ]
    }

    let removeStops = []

    if (!serviceRoutePassesThroughStation(serviceTracks, checkStops[0])) {
        removeStops.push(checkStops[0])
    }
    if (!serviceRoutePassesThroughStation(serviceTracks, checkStops[1])) {
        removeStops.push(checkStops[1])
    }
    let newStops = difference(serviceRoute.stopsByID, removeStops)
    return {
        ...serviceRoute,
        stopsByID: newStops,
        serviceTracks: serviceTracks
    }
}

export function doClearServiceRoute(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }
        return {
            ...serviceRoute,
            stopsByID: [],
            serviceTracks: []
        }
    })
}

export function doUndoClearServiceRoute(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }
        return {
            ...serviceRoute,
            stopsByID: action.payload.stops,
            serviceTracks: action.payload.serviceTracks
        }
    })
}

function doRemoveStop(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }
        let newStopsByID = serviceRoute.stopsByID.filter(stop => {
            return stop !== action.payload.stationID
        })
        return {
            ...serviceRoute,
            stopsByID: newStopsByID
        }
    })
}

function doRestoreStop(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }
        if (!serviceRoutePassesThroughStation(serviceRoute.serviceTracks, action.payload.stationID)) {
            return serviceRoute
        }

        let newStopsByID = serviceRoute.stopsByID.slice(0)
        newStopsByID.push(action.payload.stationID)
        newStopsByID.sort((a, b) => a - b)
        return {
            ...serviceRoute,
            stopsByID: newStopsByID
        }
    })
}

export function serviceRoutePassesThroughStation(serviceTracks, stationID) {
    for (var i = 0; i < serviceTracks.length; i++) {
        for (var j = 0; j < serviceTracks[i].length; j++) {
            let edge = serviceTracks[i][j]
            if (edge.fromStationID === stationID || edge.toStationID === stationID) {
                return true
            }
        }
    }
    return false
}

function validActionsForServiceRoute(serviceRoute, stations) {
    //so when the serviceRoute is empty, this is not called.
    // stationIDs where a new block can be added, along with the associated trackBlockIndex
    // stationIds where an incomplete block can be added to, needs associated trackBlockIndex
    // trackBlockIndices which are not complete and can be edited
}

export function isTrackBlockAtIndexComplete(serviceRoute, serviceID, index) {
    let targetServiceRoute = filterById(serviceRoute, serviceID)[0]

    if (!targetServiceRoute) {
        return false
    }

    let targetBlock = targetServiceRoute.serviceTracks[index]
    return isTrackBlockComplete(targetBlock)
}

export function isTrackBlockComplete(targetBlock) {
    if (!targetBlock || targetBlock.length === 0) {
        return false
    }

    let fromIDs = new Set()
    let toIDs = new Set()

    for (var i = 0; i < targetBlock.length; i++) {
        let edge = targetBlock[i]
        let from = edge.fromStationID
        let to = edge.toStationID

        if (from !== to) {
            if (toIDs.has(from)) {
                toIDs.delete(from)
            } else {
                fromIDs.add(from)
            }

            if (fromIDs.has(to)) {
                fromIDs.delete(to)
            } else {
                toIDs.add(to)
            }
        }
    }
    return fromIDs.size === 0 && toIDs.size === 0
}

function isServiceRouteComplete(serviceRoute) {
    //check, all stations in servicetracks = stops + passthrough
    //check, each track block complete
}

function getStationsInOrder(serviceRoute) {
    // first station is the station in the first track block that isn't in the next block
}

export function stationCanBeDeleted(state, stationID) {
    return checkIfTrackOrStationCanBeDeleted(state, stationID, (edge, stationID) => {
        return edge.fromStationID === stationID || edge.toStationID === stationID
    })
}

export function trackCanBeDeleted(state, trackID) {
    return checkIfTrackOrStationCanBeDeleted(state, trackID, (edge, trackID) => {
        return edge.trackID === trackID
    })
}

function checkIfTrackOrStationCanBeDeleted(state, removeID, predicate) {
    let canBeDeleted = true
    let serviceSet = new Set()

    for (var i = 0; i < state.length; i++) {
        let serviceRoute = state[i]

        for (var j = 0; j < serviceRoute.serviceTracks.length; j++) {
            let block = serviceRoute.serviceTracks[j]
            for (var k = 0; k < block.length; k++) {
                let edge = block[k]

                if (predicate(edge, removeID)) {
                    canBeDeleted = false
                    serviceSet.add(serviceRoute.id)
                }
            }
        }
    }

    return {
        canBeDeleted: canBeDeleted,
        serviceIDs: Array.from(serviceSet)
    }
}
