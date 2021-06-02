import { filterById, filterOutById, genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    REMOVE_SERVICE, RESTORE_SERVICE,
    REMOVE_LINE, RESTORE_LINE,
    REMOVE_AGENCY, RESTORE_AGENCY,

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
} from '../actions/actionTypes'
import _ from 'underscore';

//an array of serviceRoute objects
const initialState = [];

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
            return genericMultiDelete(
                state,
                action.payload.serviceIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_SERVICE: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_AGENCY:
        case RESTORE_LINE: {
            return genericMultiRestore(
                state,
                action.payload.serviceIDs
            )
        }
        case RESTORE_SERVICE: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        case ADD_SERVICETRACK_TWOWAY: {
            return doAddTwoWayServiceTrack(state, action)
        }
        case ADD_SERVICETRACK_ONEWAY: {
            return doAddOneWayServiceTrack(state, action)
        }
        case SWITCH_ONEWAY_DIRECTION: {
            return doSwitchOneWayDirection(state, action)
        }
        case ONEWAY_TO_TWOWAY: {
            return doOneWayToTwoWay(state, action)
        }
        case TWOWAY_TO_ONEWAY: {
            return doTwoWayToOneWay(state, action)
        }
        case CLEAR_SERVICE_ROUTE: {
            return doClearServiceRoute(state, action)
        }
        case UNDO_CLEAR_SERVICE_ROUTE: {
            return doUndoClearServiceRoute(state, action)
        }
        // case CLEAR_SERVICE_TRACK_BLOCK: {
        //     return editServiceTracks(state, action, (targetEdges) => {
        //         return targetEdges.length === 0
        //     }, doClearTrackBlock)
        // }
        // case UNDO_CLEAR_SERVICE_TRACK_BLOCK: {
        //     return editServiceTracks(state, action, (targetEdges) => {
        //         return targetEdges.length === 0
        //     }, undoClearTrackBlock)
        // }
        // case REMOVE_SERVICE_TRACK_BLOCK: {
        //     return editServiceTracks(state, action, (targetEdges) => {
        //         return targetEdges.length === 0
        //     }, doRemoveTrackBlock)
        // }
        // case RESTORE_SERVICE_TRACK_BLOCK: {
        //     return editServiceTracks(state, action, (targetEdges) => {
        //         return targetEdges.length === 0
        //     }, doRestoreTrackBlock)
        // }
        case REMOVE_STOP: {
            return doRemoveStop(state, action)
        }
        case RESTORE_STOP: {
            return doRestoreStop(state, action)
        }
        default:
            return state;
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

        let newStops = serviceRoute.stopsByID.slice(0);
        let stopsSet = new Set(newStops)
        for (const stationID in action.payload.stationIDs) {
            if (stopsSet.has(stationID) == false) {
                newStops.push(stationID)
            }
        }

        let serviceTracks = serviceRoute.serviceTracks.slice(0);

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
        ];

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
                }];
            serviceTracks.splice(action.payload.index, 0, newBlock)

        } else if (action.payload.index === -1) {
            let newBlock = [
                {
                    trackID: action.payload.trackID,
                    fromStationID: action.payload.fromID,
                    toStationID: action.payload.toID
                }];
            serviceTracks.splice(0, 0, newBlock)
        } else {
            let currentBlock = serviceTracks[action.payload.index].slice(0)

            currentBlock.push({
                trackID: action.payload.trackID,
                fromStationID: action.payload.fromID,
                toStationID: action.payload.toID
            })
            serviceTracks.splice(action.payload.index, 1, currentBlock)
        }
        return {
            ...serviceRoute,
            stopsByID: newStops,
            serviceTracks: serviceTracks
        }
    })
}

function doSwitchOneWayDirection(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let serviceTracks = serviceRoute.serviceTracks.slice(0)
        if (action.payload.index >= serviceTracks.length || action.payload.index < 0) {
            return serviceRoute
        }
        let targetBlock = serviceTracks[action.payload.index]

        let targetEdges = targetBlock.filter(edge => {
            return edge.trackID === action.payload.trackID
        })

        if (targetEdges.length !== 1) {
            return serviceRoute
        } else {
            let newBlock = targetBlock.filter(edge => {
                return edge.trackID !== action.payload.trackID
            }).slice(0)

            let targetEdge = targetEdges[0]

            let newEdge = {
                trackID: targetEdge.trackID,
                fromStationID: targetEdge.toID,
                toStationID: targetEdge.fromID
            }

            newBlock.push(newEdge)
            serviceTracks.splice(action.payload.index, 1, newBlock)

            return {
                ...serviceRoute,
                serviceTracks: serviceTracks
            }
        }
    })
}

function doOneWayToTwoWay(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let serviceTracks = serviceRoute.serviceTracks.slice(0)
        if (action.payload.index >= serviceTracks.length || action.payload.index < 0) {
            return serviceRoute
        }
        let targetBlock = serviceTracks[action.payload.index]

        let targetEdges = targetBlock.filter(edge => {
            return edge.trackID === action.payload.trackID
        })
        if (targetEdges.length !== 1) {
            return serviceRoute
        } else {
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
    })
}

function doTwoWayToOneWay(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }

        let serviceTracks = serviceRoute.serviceTracks.slice(0)
        if (action.payload.index >= serviceTracks.length || action.payload.index < 0) {
            return serviceRoute
        }
        let targetBlock = serviceTracks[action.payload.index]

        let targetEdges = targetBlock.filter(edge => {
            return edge.trackID === action.payload.trackID
        })
        if (targetEdges.length !== 2) {
            return serviceRoute
        } else {
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
    })
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

// export function doClearTrackBlock(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
//     let newBlock = []
//     serviceTracks.splice(action.payload.index, 1, newBlock)
//     return {
//         ...serviceRoute,
//         serviceTracks: serviceTracks
//     }
// }

// export function undoClearTrackBlock(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
//     serviceTracks.splice(action.payload.index, 1, action.payload.block)
//     return {
//         ...serviceRoute,
//         serviceTracks: serviceTracks
//     }
// }

// export function doRemoveTrackBlock(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
//     serviceTracks = [...serviceTracks.slice(0, action.payload.index),
//     ...serviceTracks.slice(action.payload.index + 1)]
//     return {
//         ...serviceRoute,
//         serviceTracks: serviceTracks
//     }
// }

// export function doRestoreTrackBlock(serviceRoute, action, serviceTracks, targetBlock, targetEdges) {
//     serviceTracks.splice(action.payload.index, 1, action.payload.block)
//     return {
//         ...serviceRoute,
//         serviceTracks: serviceTracks
//     }
// }

function doRemoveStop(state, action) {
    return state.map(serviceRoute => {
        if (serviceRoute.id !== action.payload.serviceID) {
            return serviceRoute
        }
        let newStopsByID = filterOutById(serviceRoute.stopsByID, action.payload.stationID)
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
        if(serviceRoutePassesThroughStation(serviceRoute, action.payload.stationID) === false){
            return serviceRoute
        }

        let newStopsByID = serviceRoute.stopsByID.slice(0)
        newStopsByID.push(action.payload.stationID)
        return {
            ...serviceRoute,
            stopsByID: newStopsByID
        }
    })

}

function serviceRoutePassesThroughStation(serviceRoute, stationID) {
    let serviceTracks = serviceRoute.serviceTracks

    for (var i = 0; i < serviceTracks.length; i++) {
        for (var j =0; j< serviceTracks[i].length; j++) {
            let edge = serviceTracks[i][j]
            if(edge.fromStationID === stationID || edge.toStationID === stationID) {
                return true
            }
        }
    }
    return true
}

function validActionsForServiceRoute(serviceRoute, stations) {
    //so when the serviceRoute is empty, this is not called.

    // stationIDs where a new block can be added, along with the associated trackBlockIndex
    // stationIds where an incomplete block can be added to, needs associated trackBlockIndex
    // trackBlockIndices which are not complete and can be edited
}

function isTrackBlockComplete(serviceRoute, serviceID, index) {
    let targetServiceRoute = filterById(serviceRoute, serviceID)[0]

    if (!targetServiceRoute) {
        return false
    }

    let targetBlock = targetServiceRoute.serviceTracks[index]

    if (!targetBlock) {
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
                fromIDs.delete(from)
            } else {
                toIDs.add(to)
            }
        }
    }
    return fromIDs.length() === 0 && toIDs.length() === 0
}
