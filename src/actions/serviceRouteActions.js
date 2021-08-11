import { getById } from "../utils/utils"
import {
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
} from "./actionTypes"

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
            serviceID: parseInt(serviceID)
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

export function getInverseServiceRouteActions(state, action) {
    switch (action.type) {
        default: {
            return { type: "ERROR" } // this should not happen
        }
        case ADD_SERVICETRACK_TWOWAY:
        case ADD_SERVICETRACK_ONEWAY: {
            return removeServiceAlongTrack(action.payload.trackID, action.payload.serviceID, action.payload.index)
        }
        case SWITCH_ONEWAY_DIRECTION: {
            return switchOneWayDirection(action.payload.trackID, action.payload.serviceID, action.payload.index)
        }
        case ONEWAY_TO_TWOWAY: {
            return twoWayToOneWay(action.payload.trackID, action.payload.serviceID, action.payload.index)
        }
        case TWOWAY_TO_ONEWAY: {
            return oneWayToTwoWay(action.payload.trackID, action.payload.serviceID, action.payload.index)
        }
        case REMOVE_SERVICE_ALONG_TRACK: {
            let targetRoute = getById(state, action.payload.serviceID)
            let targetBlock = targetRoute.serviceTracks[action.payload.index]
            let targetEdges = targetBlock.filter(edge => {
                return edge.trackID === action.payload.trackID
            })

            if (targetEdges.length === 1) {
                let targetEdge = targetEdges[0]
                return addOneWayService(
                    action.payload.trackID,
                    action.payload.serviceID,
                    targetEdge.fromStationID,
                    targetEdge.toStationID,
                    action.payload.index
                )
            } else {
                let targetEdge = targetEdges[0]

                return addTwoWayService(
                    action.payload.trackID,
                    action.payload.serviceID,
                    targetEdge.fromStationID,
                    targetEdge.toStationID,
                    action.payload.index
                )
            }
        }
        case CLEAR_SERVICE_ROUTE: {
            let targetRoute = getById(state, action.payload.serviceID)
            let stopsCopy = targetRoute.stopsByID.slice()
            let serviceTracksCopy = targetRoute.serviceTracks.slice()
            return undoClearServiceRoute(targetRoute.id, stopsCopy, serviceTracksCopy)
        }
        case UNDO_CLEAR_SERVICE_ROUTE: {
            return clearServiceRoute(action.payload.serviceID)
        }
        case REMOVE_STOP: {
            return restoreStop(action.payload.serviceID, action.payload.stationID)
        }
        case RESTORE_STOP: {
            return removeStop(action.payload.serviceID, action.payload.stationID)
        }
    }
}
