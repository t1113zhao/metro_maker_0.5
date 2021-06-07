import { selectStationsGivenStationIDs } from '../reducers/stationsReducer'
import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK
} from './actionTypes'
import store from '../app/store'

export function addTrack(stationA_ID, stationB_ID) {
    let stationIDs = [parseInt(stationA_ID), parseInt(stationB_ID)]
    return {
        type: ADD_TRACK,
        payload: {
            stations: selectStationsGivenStationIDs(store.getState(), stationIDs)
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
