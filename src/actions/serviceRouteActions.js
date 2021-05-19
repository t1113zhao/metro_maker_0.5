import {
    ADD_SERVICETRACK_TWOWAY,
    ADD_SERVICETRACK_ONEWAY,
    SWITCH_ONEWAY_DIRECTION,
    TWOWAY_TO_ONEWAY,
    REMOVE_SERVICE_TRACK,
    RESTORE_SERVICE_TRACK,
    REMOVE_SERVICE_TRACK_BLOCK,
    RESTORE_SERVICE_TRACK_BLOCK,
    REMOVE_STOP,
    RESTORE_STATION,
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

export function addOneWayService(trackID, serviceID, fromID, toID, index, insertNew) {
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

export function switchOneWayDirection(trackID, serviceID, index ) {
    return {
        type: SWITCH_ONEWAY_DIRECTION,
        payload: {
            trackID: trackID,
            serviceID: serviceID,
            index: index
        }
    }
}