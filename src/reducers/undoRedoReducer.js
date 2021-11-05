import * as actionTypes from '../actions/actionTypes'
import { getById, nextIDForArray } from '../utils/utils'

import { getInverseAgencyActions } from '../actions/agencyActions'
import { getInverseLineActions } from '../actions/lineActions'
import { getInverseServiceActions } from '../actions/serviceActions'
import { getInverseServiceRouteActions } from '../actions/serviceRouteActions'
import { getInverseStationActions } from '../actions/stationActions'
import { getInverseTransferActions } from '../actions/transferActions'
import { getInverseTrackRouteActions } from '../actions/trackRouteActions'
import { getInverseNodeActions } from '../actions/nodeActions'
import { getInverseTrackActions } from '../actions/trackActions'
/**
 * Normal Action: adds the inverse action to the undo stack,
 * if redo stack is not empty, clear it
 *
 * Undo Action: dispatches the top of the undo stack,
 * adds the inverse of the top of the undo stack to the redo stack
 *
 * Redo Action: dispatches the top of the redo stack
 * adds the inverse of the top of the redo stack to the undo stack
 */

const undohistorylength = 100
export default function undoRedoReducer(reducer) {
    const initialState = {
        past: [],
        present: reducer(undefined, {}),
        future: []
    }

    return function (state = initialState, action) {
        // const { past, present, future } = state
        let past = state.past
        let present = state.present
        let future = state.future

        switch (action.type) {
            case actionTypes.GLOBAL_UNDO: {
                if (past.length > 0) {
                    let newPast = past.slice()
                    let actionToApply = newPast.pop()

                    let newFuture = future.slice(0)
                    newFuture.push(getInverseAction(present, actionToApply))

                    return {
                        past: newPast,
                        present: reducer(present, actionToApply),
                        future: newFuture
                    }
                } else {
                    return state
                }
            }
            case actionTypes.GLOBAL_REDO: {
                if (future.length > 0) {
                    let newFuture = future.slice()
                    let actionToApply = newFuture.pop()

                    let newPast = past.slice(0)
                    newPast.push(getInverseAction(present, actionToApply))

                    return {
                        past: newPast,
                        present: reducer(present, actionToApply),
                        future: newFuture
                    }
                } else {
                    return state
                }
            }
            default: {
                if (action.type) {
                    let newPast = past.slice(0)
                    newPast.push(getInverseAction(present, action))
                    return {
                        past: newPast,
                        present: reducer(present, action),
                        future: []
                    }
                } else {
                    return state
                }
            }
        }
    }
}

// get the inverse action to put in past/future
function getInverseAction(presentState, action) {
    switch (action.type) {
        case actionTypes.ADD_AGENCY:
        case actionTypes.UNDO_ADD_AGENCY:
        case actionTypes.EDIT_AGENCY:
        case actionTypes.REMOVE_AGENCY:
        case actionTypes.RESTORE_AGENCY: {
            return getInverseAgencyActions(presentState.agencies, action)
        }
        case actionTypes.ADD_LINE:
        case actionTypes.UNDO_ADD_LINE:
        case actionTypes.EDIT_LINE:
        case actionTypes.REMOVE_LINE:
        case actionTypes.RESTORE_LINE: {
            return getInverseLineActions(presentState.lines, action)
        }
        case actionTypes.ADD_SERVICE:
        case actionTypes.UNDO_ADD_SERVICE:
        case actionTypes.EDIT_SERVICE:
        case actionTypes.REMOVE_SERVICE:
        case actionTypes.RESTORE_SERVICE: {
            return getInverseServiceActions(presentState.services, action)
        }
        case actionTypes.ADD_SERVICETRACK_TWOWAY:
        case actionTypes.ADD_SERVICETRACK_ONEWAY:
        case actionTypes.SWITCH_ONEWAY_DIRECTION:
        case actionTypes.ONEWAY_TO_TWOWAY:
        case actionTypes.TWOWAY_TO_ONEWAY:
        case actionTypes.REMOVE_SERVICE_ALONG_TRACK:
        case actionTypes.CLEAR_SERVICE_ROUTE:
        case actionTypes.UNDO_CLEAR_SERVICE_ROUTE:
        case actionTypes.REMOVE_STOP:
        case actionTypes.RESTORE_STOP: {
            return getInverseServiceRouteActions(presentState.serviceRoutes, action)
        }
        case actionTypes.ADD_STATION:
        case actionTypes.UNDO_ADD_STATION:
        case actionTypes.MOVE_STATION:
        case actionTypes.EDIT_STATION:
        case actionTypes.REMOVE_STATION:
        case actionTypes.RESTORE_STATION: {
            return getInverseStationActions(presentState.stations, action)
        }
        case actionTypes.ADD_TRANSFER:
        case actionTypes.UNDO_ADD_TRANSFER:
        case actionTypes.EDIT_TRANSFER:
        case actionTypes.REMOVE_TRANSFER:
        case actionTypes.RESTORE_TRANSFER: {
            return getInverseTransferActions(presentState.transfers, action)
        }
        case actionTypes.ADD_NEW_TRACKROUTE_NODES:
        case actionTypes.EDIT_TRACKROUTE_NODES:
        case actionTypes.CLEAR_TRACKROUTE_NODES: {
            return getInverseTrackRouteActions(presentState.tracks, action)
        }
        case actionTypes.MOVE_NODE: {
            return getInverseNodeActions(presentState.tracks, action)
        }
        case actionTypes.ADD_TRACK:
        case actionTypes.UNDO_ADD_TRACK:
        case actionTypes.REMOVE_TRACK:
        case actionTypes.RESTORE_TRACK: {
            return getInverseTrackActions(presentState.tracks, action)
        }
        default: {
            console.log('ERROR IMPROPER action')
            return {
                type: actionTypes.EMPTY
            }
        }
    }
}

function canUndoSelector(state) {
    return state.past.length > 0
}

function canRedoSelector(state) {
    return state.future.length > 0
}
