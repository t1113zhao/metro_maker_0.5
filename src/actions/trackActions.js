import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK
} from './actionTypes'

export function addTrack(stationA_ID, stationB_ID) {
    return {
        type: ADD_TRACK,
        payload: {
            stationIDs: [parseInt(stationA_ID), parseInt(stationB_ID)]
        }
    }
}

export function removeTrack(id) {
    return {
        type: REMOVE_TRACK,
        payload: {
            id: id,
            deletedAt: new Date().toISOString()
        }
    }
}

export function restoreTrack(id) {
    return {
        type: RESTORE_TRACK,
        payload: {
            id: id
        }
    }
}
