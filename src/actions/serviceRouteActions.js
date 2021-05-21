import {
    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    ONEWAY_TO_TWOWAY,
    TWOWAY_TO_ONEWAY,
    CLEAR_SERVICE_ROUTE,
    UNDO_CLEAR_SERVICE_ROUTE,
    CLEAR_SERVICE_TRACK_BLOCK,
    UNDO_CLEAR_SERVICE_TRACK_BLOCK,
    REMOVE_SERVICE_TRACK_BLOCK,
    RESTORE_SERVICE_TRACK_BLOCK,
    REMOVE_STOP,
    RESTORE_STOP
} from './actionTypes'

export function addTwoWayService(trackID, serviceID, stationIDs, index) {
    return {
        type: ADD_SERVICETRACK_TWOWAY,
        payload: {
            trackID: parseint(trackID),
            serviceID: parseint(serviceID),
            stationIDs: stationIDs,
            index: parseint(index)
        }
    }
}

export function addOneWayService(trackID, serviceID, fromID, toID, index) {
    return {
        type: ADD_SERVICETRACK_ONEWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            fromID: fromID,
            toID: toID,
            index: index
        }
    }
}

export function switchOneWayDirection(trackID, serviceID, index) {
    return {
        type: SWITCH_ONEWAY_DIRECTION,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    }
}

export function oneWayToTwoWay(trackID, serviceID, index) {
    return {
        type: ONEWAY_TO_TWOWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    }
}

export function twoWayToOneWay(trackID, serviceID, index) {
    return {
        type: TWOWAY_TO_ONEWAY,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    }
}

export function clearServiceRoute(serviceID) {
