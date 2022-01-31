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

import presentReducer from './presentReducer'
import { combineReducers } from 'redux'
/**
 * Normal Action: adds the inverse action to the past stack,
 * if future stack is not empty, clear it
 *
 * Undo Action: dispatches the top of the past stack,
 * adds the inverse of the top of the past stack to the future stack
 *
 * Redo Action: dispatches the top of the past stack
 * adds the inverse of the top of the future stack to the past stack
 */

const undohistorylength = 100

const actionStackInitialState = []

export const combinedReducer = combineReducers({
    past: pastReducer,
    present: presentReducer,
    future: futureReducer
})

export function redoUndoActionEnhancer(state, action) {
    switch (action.type) {
        case actionTypes.GLOBAL_UNDO: {
            return enhanceUndoRedoAction(state, false)
        }
        case actionTypes.GLOBAL_REDO: {
            return enhanceUndoRedoAction(state, true)
        }
        default: {
            return action
        }
    }
}

export default function undoRedoReducer(state, action) {
    let enhancedAction = redoUndoActionEnhancer(state, action)
    if (enhancedAction.type === actionTypes.EMPTY) {
        console.log('ERROR IMPROPER action' + enhancedAction.type + state)
        return state
    } else {
        return combinedReducer(state, enhancedAction)
    }
}

export function pastReducer(state = actionStackInitialState, action) {
    if (!action.type || !action.isEnhanced) {
        return state
    }
    switch (action.type) {
        // In both Undo, remove one from the past stack
        case actionTypes.GLOBAL_UNDO: {
            let oldActionStackLen = state.length
            return [...state.slice(0, oldActionStackLen - 1)]
        }
        case actionTypes.GLOBAL_REDO: {
            return [...state, action.payload]
        }
        case actionTypes.EMPTY: {
            return state
        }
        // Otherwise append action (should be inverted) to stack
        default: {
            return [...state, action]
        }
    }
}

export function futureReducer(state = actionStackInitialState, action) {
    if (!action.isEnhanced) {
        return state
    }
    switch (action.type) {
        // Remove one from the future
        case actionTypes.GLOBAL_REDO: {
            let oldActionStackLen = state.length
            return [...state.slice(0, oldActionStackLen - 1)]
        }
        // Append inverted action from past to the future
        case actionTypes.GLOBAL_UNDO: {
            return [...state, action.payload]
        }
        // Default case, no actions
        default: {
            return []
        }
    }
}

// Get the inverse of top of the future/past stack
export function enhanceUndoRedoAction(state, isFuture) {
    let pastOrFuture = isFuture ? state.future : state.past

    if (pastOrFuture.length > 0) {
        let actionToInvert = pastOrFuture[pastOrFuture.length - 1]
        let invertedAction = getInverseAction(state.present, actionToInvert)
        return {
            type: invertedAction.type,
            payload: invertedAction.payload,
            isEnhanced: true
        }
    } else {
        return {
            type: actionTypes.EMPTY
        }
    }
}

// get the inverse action to put in past/future
export function getInverseAction(presentState, action) {
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
            console.log('ERROR IMPROPER action' + action.type)
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
