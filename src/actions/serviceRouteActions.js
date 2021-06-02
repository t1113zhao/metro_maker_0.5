import {
    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    ONEWAY_TO_TWOWAY,
    TWOWAY_TO_ONEWAY,
    REMOVE_SERVICE_ALONG_TRACK,
    CLEAR_SERVICE_ROUTE,
    UNDO_CLEAR_SERVICE_ROUTE,
    // CLEAR_SERVICE_TRACK_BLOCK,
    // UNDO_CLEAR_SERVICE_TRACK_BLOCK,
    // REMOVE_SERVICE_TRACK_BLOCK,
    // RESTORE_SERVICE_TRACK_BLOCK,
    REMOVE_STOP,
    RESTORE_STOP
} from './actionTypes'

export function addTwoWayService(trackID, serviceID, stationA_ID, stationB_ID, index) {
    return {
        type: ADD_SERVICETRACK_TWOWAY,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            stationIDs: [stationA_ID, stationB_ID],
            index: parseInt(index)
        }
    }
}

export function addOneWayService(trackID, serviceID, fromID, toID, index) {
    return {
        type: ADD_SERVICETRACK_ONEWAY,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            fromID: parseInt(fromID),
            toID: parseInt(toID),
            index: parseInt(index)
        }
    }
}

export function switchOneWayDirection(trackID, serviceID, index) {
    return {
        type: SWITCH_ONEWAY_DIRECTION,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            index: parseInt(index)
        }
    }
}

export function oneWayToTwoWay(trackID, serviceID, index) {
    return {
        type: ONEWAY_TO_TWOWAY,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            index: parseInt(index)
        }
    }
}

export function twoWayToOneWay(trackID, serviceID, index) {
    return {
        type: TWOWAY_TO_ONEWAY,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            index: parseInt(index)
        }
    }
}

export function removeServiceAlongTrack(trackID, serviceID, index) {
    return {
        type: REMOVE_SERVICE_ALONG_TRACK,
        payload: {
            trackID: parseInt(trackID),
            serviceID: parseInt(serviceID),
            index: parseInt(index)
        }
    }
}

export function clearServiceRoute(serviceID) {
    return {
        type: CLEAR_SERVICE_ROUTE,
        payload: {
            serviceID: parseInt(serviceID),
        }
    }
}

export function undoClearServiceRoute(serviceID, stops, serviceTracks) {
    return {
        type: UNDO_CLEAR_SERVICE_ROUTE,
        payload: {
            serviceID: parseInt(serviceID),
            stops: stops,
            serviceTracks: serviceTracks
        }
    }
}

// export function clearTrackBlock(serviceID, trackID, index) {
//     return {
//         type: CLEAR_SERVICE_TRACK_BLOCK,
//         payload: {
//             trackID: parseInt(trackID),
//             serviceID: parseInt(serviceID),
//             index: parseInt(index)
//         }
//     }
// }

// export function undoClearTrackBlock(serviceID, trackID, index, block) {
//     return {
//         type: UNDO_CLEAR_SERVICE_TRACK_BLOCK,
//         payload: {
//             trackID: parseInt(trackID),
//             serviceID: parseInt(serviceID),
//             index: parseInt(index),
//             block: block
//         }
//     }
// }

// export function removeTrackBlock(serviceID, trackID, index) {
//     return {
//         type: REMOVE_SERVICE_TRACK_BLOCK,
//         payload: {
//             trackID: parseInt(trackID),
//             serviceID: parseInt(serviceID),
//             index: parseInt(index)
//         }
//     }
// }

// export function restoreTrackBlock(serviceID, trackID, index, block) {
//     return {
//         type: RESTORE_SERVICE_TRACK_BLOCK,
//         payload: {
//             trackID: parseInt(trackID),
//             serviceID: parseInt(serviceID),
//             index: parseInt(index),
//             block: block
//         }
//     }
// }

export function removeStop(serviceID, stationID) {
    return {
        type: REMOVE_STOP,
        payload: {
            serviceID: parseInt(serviceID),
            stationID: parseInt(stationID)
        }
    }
}

export function restoreStop(serviceID, stationID) {
    return {
        type: RESTORE_STOP,
        payload: {
            serviceID: parseInt(serviceID),
            stationID: parseInt(stationID)
        }
    }
}
