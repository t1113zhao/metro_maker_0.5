import { selectStationsGivenStationIDs } from '../reducers/stationsReducer'
import { ADD_TRACK, UNDO_ADD_TRACK, REMOVE_TRACK, RESTORE_TRACK } from './actionTypes'
import { nextIDForArray } from '../utils/utils'

export function addTrack(stationA, stationB) {
    let stations = [stationA, stationB]
    return {
        type: ADD_TRACK,
        payload: {
            stations: stations
        }
    }
}

export function undoAddTrack(id, stationA, stationB) {
    let stations = [stationA, stationB]
    return {
        type: UNDO_ADD_TRACK,
        payload: {
            id: parseInt(id),
            stations: stations
        }
    }
}

export function removeTrack(id) {
    return {
        type: REMOVE_TRACK,
        payload: {
            id: parseInt(id),
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreTrack(id) {
    return {
        type: RESTORE_TRACK,
        payload: {
            id: parseInt(id)
        }
    }
}

export function getInverseTrackActions(state, action) {
    switch (action.type) {
        default: {
            return { type: 'ERROR' } // this should not happen
        }
        case ADD_TRACK: {
            return undoAddTrack(nextIDForArray(state), action.payload.stations[0], action.payload.stations[1])
        }
        case UNDO_ADD_TRACK: {
            return addTrack(action.payload.stations[0], action.payload.stations[1])
        }
        case REMOVE_TRACK: {
            return restoreTrack(action.payload.id)
        }
        case RESTORE_TRACK: {
            return removeTrack(action.payload.id)
        }
    }
}
