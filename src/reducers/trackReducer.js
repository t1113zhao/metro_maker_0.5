import { filterById, filterDeleted, genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import {
    ADD_TRACK,
    REMOVE_TRACK,
    RESTORE_TRACK,
    REMOVE_STATION,
    RESTORE_STATION,
    REMOVE_NODE,
    RESTORE_NODE
} from '../actions/actionTypes'

const initialState = []

export default function trackReducer(state = initialState, action) {
    switch (action.type) {
        case REMOVE_NODE: {
            return genericMultiDelete(
                state,
                getTrackIDsByStationID(
                    state,
                    action.payload.stationID[0]
                ),
                action.payload.deletedAt
            )
        }
        case REMOVE_STATION:{
            return genericMultiDelete(
                state,
                getTrackIDsByStationID(
                    state,
                    action.payload.id
                ),
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
        case RESTORE_NODE :{
            return genericMultiRestore(
                state,
                getTrackIDsByStationID(
                    state,
                    action.payload.stationID[0]
                )
            )
        }
        case RESTORE_STATION :{
            return genericMultiRestore(
                state,
                getTrackIDsByStationID(
                    state,
                    action.payload.id
                )
            )
        }
        case RESTORE_TRACK :{
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
    let trackID = nextIDForArray()
    return [
        ...state,
        {
            id: trackID,
            stationIDs: action.payload.stationIDs,
            deletedAt: null
        }
    ]
}

function getTrackIDsByStationID(tracks, stationID){
    return tracks.filter(track =>{
        return track.stationIDs[0] === stationID ||
        track.stationIDs[1] === stationID
    }).map(track =>{
        return track.id
    })
}
