import { selectStationsGivenStationIDs } from '../reducers/stationsReducer'
import { ADD_TRACK, UNDO_ADD_TRACK, REMOVE_TRACK, RESTORE_TRACK } from './actionTypes'
import store from '../app/store'
import { getById, nextIDForArray } from '../utils/utils'

export function addTrack(stationA_ID, stationB_ID) {
    let stationIDs = [parseInt(stationA_ID), parseInt(stationB_ID)]
    return {
        type: ADD_TRACK,
        payload: {
            stations: selectStationsGivenStationIDs(store.getState(), stationIDs)
        }
    }
}

export function undoAddTrack(id) {
    return {
        type: UNDO_ADD_TRACK,
        payload: {
            id: parseInt(id)
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
            return undoAddTrack(nextIDForArray(state))
        }
        case UNDO_ADD_TRACK: {
            let targetTrack = getById(state, action.payload.id)
            return addTrack(targetTrack.stationIDs[0], targetTrack.stationIDs[1])
        }
        case REMOVE_TRACK: {
            return restoreTrack(action.payload.id)
        }
        case RESTORE_TRACK: {
            return removeTrack(action.payload.id)
        }
    }
}
