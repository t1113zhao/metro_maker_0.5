import { filterDeleted, genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    REMOVE_TRACK,
    RESTORE_TRACK,
    REMOVE_STATION,
    RESTORE_STATION
} from '../actions/actionTypes'

const initialState = []

export default function trackReducer(state = initialState, action) {
    switch (action.type) {
        case REMOVE_STATION: {
            return genericMultiDelete(
                state,
                action.payload.trackIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_TRACK: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_STATION: {
            return genericMultiRestore(
                state,
                action.payload.trackIDs
            )
        }
        case RESTORE_TRACK: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default: {
            return state
        }
    }
}

export function doAddTrack(state, action) {
    let trackID = nextIDForArray(state)
    return [
        ...state,
        {
            id: trackID,
            stationIDs: action.payload.stationIDs,
            deletedAt: null
        }
    ]
}

export function getTrackIDsByStationID(tracks, stationID, includeDeleted) {
    let output = tracks.filter(track => {
        return track.stationIDs[0] === stationID ||
            track.stationIDs[1] === stationID
    }).map(track => {
        return track.id
    })
    return filterDeleted(output, includeDeleted)
}
